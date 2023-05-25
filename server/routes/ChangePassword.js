const bcrypt = require('bcrypt');
const error = require('../components/customError');
const Users = require('../models/Users');
const verifyPassword = require('../components/verifyPassword')


const ChangePassword = async ({body, user_id}, res) => {
      try{
        const passwordCorrect = await verifyPassword(user_id, body.pass)
        !passwordCorrect && error('Old password is incorrect')
        
        const hash = await bcrypt.hash(body.confirmnewpass, 10)

        await Users.updateOne({user_id: user_id}, {user_pass: hash})
        
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




  module.exports = ChangePassword