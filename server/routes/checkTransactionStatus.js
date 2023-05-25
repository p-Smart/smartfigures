const axios = require('axios')
const generateTxRef = require('../components/generateTxRef')
const Transactions = require('../models/Transactions')
const Users = require('../models/Users')

const CheckTransactionStatus = async (_, res) => {
    try{
        const TEN_MINUTES = 10 * 60 * 1000

        const transactions = await Transactions.find({
            status: 'PENDING',
            created_on: { $lte: new Date(Date.now() - TEN_MINUTES) }
        })
        .sort({ created_on: 1 })
        .limit(50)

        res.json({
          success: true,
          message: transactions.length ? 'Transactions Status Update Job started' : 'No Pending Transactions on ground'
        })

        transactions.map(
            async ({ tx_ref, user_id, payment_provider, tx_type, amount }) => {
              if (tx_type === 'DEPOSIT') {
                if (payment_provider === 'FLUTTERWAVE') {
                  try {
                    const { data } = await axios.get(
                      `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${tx_ref}`,
                      {
                        headers: {
                          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
                          'Content-Type': 'application/json',
                        },
                      }
                    );
      
                    if (data.status === 'success') {
                      await Transactions.updateOne(
                        { tx_ref: tx_ref },
                        { status: 'COMPLETED', finalized_on: new Date() }
                      );
      
                      const amount = parseFloat(data.data.amount);
      
                      await Users.updateOne(
                        { user_id: user_id },
                        { $inc: { main_balance: amount } }
                      );
                    }
                  } catch (err) {
                    if (err?.response?.data?.status === 'error') {
                      try {
                        await Transactions.updateOne(
                          { tx_ref: tx_ref },
                          { status: 'FAILED', finalized_on: new Date() }
                        );
                      } catch (err) {
                        console.log(err);
                      }
                    } else {
                      console.log(err);
                    }
                  }
                } else if (payment_provider === 'PAYSTACK') {
                  try {
                    const { data } = await axios.get(
                      `https://api.paystack.co/transaction/verify/${tx_ref}`,
                      {
                        headers: {
                          Authorization: `Bearer ${process.env.PYS_SECRET_KEY}`,
                          'Content-Type': 'application/json',
                        },
                      }
                    );
      
                    if (data.data.status === 'success') {
                      await Transactions.updateOne(
                        { tx_ref: tx_ref },
                        { status: 'COMPLETED', finalized_on: new Date() }
                      );
      
                      const amount =
                        parseFloat(data.data.amount).toFixed(2) / 100;
      
                      await Users.updateOne(
                        { user_id: user_id },
                        { $inc: { main_balance: amount } }
                      );
                    } else if (
                      data.data.status === 'abandoned' ||
                      data.data.status === 'failed'
                    ) {
                      await Transactions.updateOne(
                        { tx_ref: tx_ref },
                        { status: 'FAILED', finalized_on: new Date() }
                      );
                    }
                  } catch (err) {
                    if (err?.response?.data?.status === false) {
                      try {
                        await Transactions.updateOne(
                          { tx_ref: tx_ref },
                          { status: 'FAILED', finalized_on: new Date() }
                        );
                      } catch (err) {
                        console.log(err);
                      }
                    } else {
                      console.log(err);
                    }
                  }
                }
              } else if (tx_type === 'WITHDRAWAL') {
                try {
                  const { data } = await axios.get(
                    `https://api.paystack.co/transfer/verify/${tx_ref}`,
                    {
                      headers: {
                        Authorization: `Bearer ${process.env.PYS_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                      },
                    }
                  );
      
                  if (data?.status === true && data?.data?.status === 'success') {
                    await Transactions.updateOne(
                      { tx_ref: tx_ref },
                      { status: 'COMPLETED', finalized_on: new Date() }
                    );
                  }
                } catch (err) {
                  if (
                    err?.response?.data?.status === false ||
                    err?.response?.data?.data?.status === 'abandoned'
                  ) {
                    try {
                      await Transactions.updateOne(
                        { tx_ref: tx_ref },
                        { status: 'FAILED', finalized_on: new Date() }
                      );
      
                      await Users.updateOne(
                        { user_id: user_id },
                        { $inc: { main_balance: parseFloat(amount) } }
                      );
      
                      const txRef = await generateTxRef();
                      await Transactions.create({
                        user_id: user_id,
                        tx_ref: txRef,
                        amount: amount,
                        tx_type: 'REFUND',
                        status: 'COMPLETED',
                        payment_provider: 'SMARTFIGURES',
                      });
                    } catch (err) {
                      console.log(err);
                    }
                  }
                }
              }
              return console.log(`Job ${tx_ref} done`);
            }
          );
        }
        catch(err){
            console.log(err.message)
        }
}


module.exports = CheckTransactionStatus