const Users = require('../models/Users')

const FetchUser = async({ user_id, authToken}, res) => {
  
    try{
      const userData = await Users.findOne({user_id: user_id})

      delete userData['user_pass']
      
      res.json({
        success: true,
        userData: {...userData._doc, authToken: authToken}
      })
    }
    catch(err){
      return res.json({
        success: false,
        error: true,
        message: 'An error occurred'
      })
    }
  }




module.exports = FetchUser