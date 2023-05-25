const axios = require('axios')
const Transactions = require('../models/Transactions')
const Users = require('../models/Users')

const VerifyPaystackDeposit = async({user_id, query}, res) => {
    try{
      const {tx_ref} = await Transactions.findOne({tx_ref: query?.trxref, status: 'PENDING'})
      const {data} = await axios.get(`https://api.paystack.co/transaction/verify/${query?.trxref}`,{
        headers: {
          Authorization: `Bearer ${process.env.PYS_SECRET_KEY}`,
          'Content-Type': 'application/json'
      }
      })
      if(data.data.status==='success'){
        await Transactions.updateOne({tx_ref: tx_ref}, {finalized_on: new Date(), status: 'COMPLETED'})
        
        const amount = parseFloat((data.data.amount)).toFixed(2) / 100

        await Users.updateOne({user_id: user_id}, {$inc: {main_balance: amount}})
      }
      else if(data.data.status === 'abandoned' || data.data.status === 'failed'){
        await Transactions.updateOne({tx_ref: tx_ref}, {finalized_on: new Date(), status: 'FAILED'})
      }
    }
    catch(err){
      console.log(err.message)
    }
    finally{
      res.status(302).redirect(`${process.env.CLIENT_DOMAIN}/dashboard`)
    }
}

module.exports = VerifyPaystackDeposit