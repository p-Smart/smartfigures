const { deleteExpiredOTPs } = require("../components/OTP")



const DeleteExpiredOTPs = async (_, res) => {
    try{
        res.json({
            success: true,
            message: 'Delete Expired OTPs Job Started'
        })
        await deleteExpiredOTPs()
    }
    catch(err){
        res.json({
            error: {
                message: err.message
            }
        })
    }
}


module.exports = DeleteExpiredOTPs