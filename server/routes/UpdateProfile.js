const checkEmailExist = require("../components/checkEmailExist")
const checkTelExist = require("../components/checkTelExist")
const error = require("../components/customError")
const Users = require("../models/Users")



const UpdateProfile = async ({user_id, body}, res) => {
    try{
        const userData = await Users.findOne({user_id: user_id})

        await checkEmailExist(body.email) && userData.user_email !== (body.email) && error(`Can't use this email, it exists!`)
        await checkTelExist(body.tel) && userData.user_tel !== (body.tel) && error(`Can't use this phone number, it exists!`)

        // If email has been verified, change the email to the verified one in the DB. This makes the user not be able to change it.
        body.email = userData.user_email_verified == 1 ? userData.user_email : body.email    

        await Users.updateOne({user_id: user_id}, {
          user_fname: body.fname,
          user_lname: body.lname,
          user_email: body.email,
          user_tel: body.tel,
          user_country: body.country,
          user_state: body.state
        })
  
        res.json( {success: true} )
      }
      catch(err){
        res.status(err.status || 500).json({
          error: {
            message: err.message
          }
        })
      }
}


module.exports = UpdateProfile