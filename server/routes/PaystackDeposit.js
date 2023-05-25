const generateTxRef = require("../components/generateTxRef")
const axios = require('axios')
const error = require('../components/customError')
const Transactions = require("../models/Transactions")
const Users = require("../models/Users")

const PaystackDeposit = async ({user_id, body, authToken}, res) => {
    try{
        const txRef = await generateTxRef()
        const {user_fname, user_lname, user_email, user_tel} = await Users.findOne({user_id: user_id})
        await Transactions.create({
          user_id: user_id,
          tx_ref: txRef,
          amount: body.amount,
          payment_provider: 'PAYSTACK',
          tx_type: 'DEPOSIT',
          status: 'PENDING',
          created_on: new Date(),
          finalized_on: new Date()
        })
  
      
      // Generate payment link from Flutterwave
      const paystackData = {
        reference: txRef,
        amount: parseFloat((body.amount)).toFixed(2) * 100,
        currency: "NGN",
        callback_url: `${process.env.SERVER_DOMAIN}/user/deposit/paystack/verify?token=${authToken}`,
        email: user_email,
    }
    const {data} = await axios.post('https://api.paystack.co/transaction/initialize', paystackData, {
        headers: {
            Authorization: `Bearer ${process.env.PYS_SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    })
    data?.status && res.json(data)
    !data?.status && error('Error generating payment link', 500)
  
    }
    catch(err){
      return res.status(err.status || 500).json({error: {message: err.message}})
    }
    finally{

    }
}




module .exports = PaystackDeposit