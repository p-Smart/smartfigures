const jwt = require('jsonwebtoken')
const error = require('./../components/customError');
const checkEmailExist = require('../components/checkEmailExist');
const verifyPassword = require('../components/verifyPassword');
const Users = require('../models/Users');
const checkTelExist = require('../components/checkTelExist');

const Login = async ({body}, res) => {

  try{
    const email = body.email?.toLowerCase()
    const tel = body.tel
    const pass = body.pass

    const emailExist = email && await checkEmailExist(email)
    email && !emailExist && error('Invalid username or password')

    const telExist = tel && await checkTelExist(tel)
    tel && !telExist && error('Invalid username or password')

    const userData = await Users.findOne({$or: [{user_email: email}, {user_tel: tel}]})

    const passwordCorrect = await verifyPassword(userData.user_id, pass)
    !passwordCorrect && error('Invalid username or password')

    let user_id = userData.user_id
    let authToken = await jwt.sign({user_id: user_id}, process.env.JWT_SECRET, {
      expiresIn: '15m'
    })
    res.json({
      success: true,
      authToken: authToken
    })
    }
    catch(err){
      res.status(err.status || 500).json({
        error: {
          message: err.message
        }
      })
    }
  }



  module.exports = Login