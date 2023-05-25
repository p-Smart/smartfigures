const error = require("../components/customError")
const generateTxRef = require("../components/generateTxRef")
const axios = require('axios')
const Users = require("../models/Users")
const Transactions = require("../models/Transactions")



const InitiateWithdrawal = async ({user_id, body}, res) => {
    const maxAmount = 100000.00
    const minAmount = 1000.00
    const {amount = parseFloat(amount), acct_num, bankname, confirmed} = body
    if (confirmed == 0){
        try{
            const {data} = await axios.get(`https://api.paystack.co/bank/resolve?account_number=${acct_num}&bank_code=${bankname}`, {
                headers: {
                    Authorization: `Bearer ${process.env.PYS_SECRET_KEY}`
                }
            })
            
            data.status !== true && error('Invalid account number')
            res.json(data)
        }
        catch(err){
            err?.response?.status !== 500 && (() => {err.status = 200})()
            res.status(err.status || 500)
            .json({
                error: {
                    message: 'Invalid account number',
                    additionalMessage: err?.response?.data || ''
                }
            })
        }

    }
    else if(confirmed == 1){
        try{
            const {main_balance, user_fname, user_lname} = await Users.findOne({user_id: user_id})
            const userName = `${user_fname} ${user_lname}`

            const currentBalance = parseFloat(main_balance)
            amount > currentBalance && error('Insufficient Balance')
            amount < minAmount && error(`Minimum Withdrawal is ${minAmount}`)
            amount > maxAmount && error(`Maximum Withdrawal is ${maxAmount}`)

            const transferRecipientData = { 
                "type": "nuban", 
                "name": userName,
                "account_number": acct_num, 
                "bank_code": bankname, 
                "currency": "NGN"
              }
            const response = await axios.post(`https://api.paystack.co/transferrecipient`, transferRecipientData, {
                headers: {
                    Authorization: `Bearer ${process.env.PYS_SECRET_KEY}`
                }
            })
            response.data.status !== true && error('An error occurred, try again later')
            const recipientCode = response?.data?.data?.recipient_code

            await Users.updateOne({user_id: user_id}, {$inc: {main_balance: -amount}})
    
            const txRef = await generateTxRef()
            await Transactions.create({
                user_id: user_id,
                tx_ref: txRef,
                amount: amount,
                payment_provider: 'PAYSTACK',
                tx_type: 'WITHDRAWAL',
                status: 'PENDING',
                created_on: new Date(),
                finalized_on: new Date()
            })
    
            const paymentData = { 
                "source": "balance", 
                "reason": "Smart Figures Withdrawal",
                "amount": parseFloat((amount)).toFixed(2) * 100,
                "recipient": recipientCode,
                "reference": txRef
            }

            const {data} = await axios.post(`https://api.paystack.co/transfer`, paymentData,{
                headers: {
                    Authorization: `Bearer ${process.env.PYS_SECRET_KEY}`
                }
            })
            data?.status === true ?
                res.json({
                    success: true,
                    message: `Withdrawal successful, you will receive your funds shortly`,
                }) :
            error('An error occurred')
    
        }
        catch(err){
            err?.response?.status !== 500 && (() => {err.status = 200})()
            res.status(err.status || 500)
            .json({
                error: {
                    message: err.message,
                    additionalMessage: err?.response?.data || ''
                }
            })
        }
    }
    

}



module.exports = InitiateWithdrawal