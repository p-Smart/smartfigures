const error = require("../components/customError")
const generateUniqueRId = require("../components/generateUniqueRId")
const Users = require("../models/Users")



const GenerateReferralId = async ({user_id}, res) => {
    try{
        const userData = await Users.findOne({user_id: user_id})
        userData?.referee_id.length !== 0 && error('Referral Link generated already')

        const refId = await generateUniqueRId()
        await Users.updateOne({user_id: user_id}, {referee_id: refId})

        res.json({
            success: true,
            message: 'Referral link generated successfully',
            refId: refId
        })
    }
    catch(err){
        res.status(err.status || 500).json({
            error:{
                message: err.message
            }
        })
    }
}

module.exports = GenerateReferralId