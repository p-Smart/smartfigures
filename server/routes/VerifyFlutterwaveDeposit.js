const axios = require('axios')
const Transactions = require('../models/Transactions')
const Users = require('../models/Users')

const VerifyFlutterwaveDeposit = async({user_id, query}, res,) => {
    try{
      const {tx_ref} = await Transactions.findOne({tx_ref: query?.tx_ref, status: 'PENDING'})
      if(query.status === 'successful' || query.status === 'completed'){
        const {data} = await axios.get(`https://api.flutterwave.com/v3/transactions/${query.transaction_id}/verify`,{
          headers: {
            Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
        })  
        if(data.status==='success'){
          await Transactions.updateOne({tx_ref: tx_ref}, {finalized_on: new Date(), status: 'COMPLETED'})
          
          const amount = parseFloat(data.data.amount)

          await Users.updateOne({user_id: user_id}, {$inc: {main_balance: amount}})
        }
        else{
          await Transactions.updateOne({tx_ref: tx_ref}, {finalized_on: new Date(), status: 'FAILED'})
        }
      }
      else if(query.status === 'cancelled'){
        await Transactions.updateOne({tx_ref: tx_ref}, {finalized_on: new Date(), status: 'FAILED'})
      }
    }
    catch(err){
      console.error(err.message)
    }
    finally{
      res.status(302).redirect(`${process.env.CLIENT_DOMAIN}/dashboard`)
    }
}

module.exports = VerifyFlutterwaveDeposit