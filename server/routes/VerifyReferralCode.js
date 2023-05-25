const checkRefCodeExists = require("../components/checkRefCodeExists")



const VerifyReferralCode = async({query}, res) => {
    try{
        const refCodeExist = await checkRefCodeExists(query.refCode)
        res.json({
            refCodeExist: refCodeExist
        })
    }
    catch(err){
        res.json({
            error: {
                message: err.message
            }
        })
    }
}


module.exports = VerifyReferralCode