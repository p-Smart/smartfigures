const { generateOTP, validateOTP } = require("../components/OTP")
const checkEmailExist = require("../components/checkEmailExist")
const error = require("../components/customError")
const sendOTPEmail = require("../email-templates/otp")
const Users = require("../models/Users")


const VerifyEmail = async  ({method, query, body, user_id}, res) => {
    try{
        // Check if email exists and reject
        const userEmail = (await Users.findOne({user_id: user_id}))?.user_email
        
        await checkEmailExist(query.email || body.email) && userEmail !== (query.email || body.email) && error(`Can't use this email, it exists!`)

    
    if (method === 'GET'){
        !query?.email && error('Parameters missing')

        const OTP = await generateOTP({expires: 30, email: query.email, tel: query.tel, user_id: query.user_id})
        await sendOTPEmail(query.email, `Email Verification Code: ${OTP}`, query.name, OTP, 30)
        res.json({
            success: true,
            message: 'OTP sent successfully'
        })
    }
    else if (method === 'POST'){

        const {otp, email} = body

        const {valid, message} = await validateOTP(otp)
        if(valid){
            await Users.updateOne({user_id: user_id}, {user_email: email, user_email_verified: true})
            
            res.json({
                success: true,
                message: 'Email Verified Successfully'
            })
        }
        else{
            error(message)
        }
    }
    }
    catch(err){
        if(err.message.includes(`Can't send mail`)){
            err.message = 'Invalid email provided'
        }
        res.status(err.status || 500).json({
            error: {
              message: err.message
            }
          })
    }
    
}

module.exports = VerifyEmail