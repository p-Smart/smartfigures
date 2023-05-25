const generateTxRef = require("../components/generateTxRef")
const axios = require('axios')
const error = require('../components/customError')
const Users = require('../models/Users')
const Transactions = require('../models/Transactions')

const FlutterwaveDeposit = async ({user_id, body, authToken}, res) => {
    const txRef = await generateTxRef()
    // Get user details
    try{
      const {user_fname, user_lname, user_email, user_tel} = await Users.findOne({user_id: user_id})
      await Transactions.create({
        user_id: user_id,
        tx_ref: txRef,
        amount: body.amount,
        payment_provider: 'FLUTTERWAVE',
        tx_type: 'DEPOSIT',
        status: 'PENDING',
        created_on: new Date(),
        finalized_on: new Date()
      })

      // Generate payment link from Flutterwave
      const flwData = {
        tx_ref: txRef,
        amount: body.amount,
        currency: "NGN",
        redirect_url: `${process.env.SERVER_DOMAIN}/user/deposit/flutter/verify?token=${authToken}`,
        customer: {
            email: user_email,
            phonenumber: user_tel,
            name: `${user_fname} ${user_lname}`
        },
        customizations: {
            title: "Smart Figures Deposit",
            logo: ""
        }
    }
    const {data} = await axios.post("https://api.flutterwave.com/v3/payments", flwData, {
        headers: {
            Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
        }
    })
    data.status==='success' && res.json(data)
    data.status!=='success' && error('Error generating payment link', 500)
  
    }
    catch(err){
      return res.status(err.status || 500).json({error: {message: err.message}})
    }
    finally{

    }
}




module .exports = FlutterwaveDeposit