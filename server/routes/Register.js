const bcrypt = require('bcrypt');
const generateUuid = require('../components/generateUuid');
const avatar = (require('../avatars'))()
const fs = require('fs');
const path = require('path');
const {join} = path
const rootDir = path.join(__dirname, '..')
const error = require('./../components/customError')
const checkTelExist = require('./../components/checkTelExist')
const checkEmailExist = require('./../components/checkEmailExist');
const checkRefCodeExists = require('../components/checkRefCodeExists')

// MongoDB
const Users = require('../models/Users');



const Register = async ({body}, res) => {

    try{
      let emailExist = await checkEmailExist(body.email)
      let telExist = body.tel==='' ? false : await checkTelExist(body.tel)
      let refCodeExists = body.ref_code === '' ? true : await checkRefCodeExists(body.ref_code)
    
      telExist && error('This phone number is registered')
      emailExist && error('Email exists, please login')
      !refCodeExists && error('This referral code does not exist')
    
      var userId = await generateUuid()
      var hash = await bcrypt.hash(body.pass, 10)

      // MongoDB
      const result = await Users.create({
        user_id: userId,
        user_fname: body.fname,
        user_lname: body.lname,
        user_mname: body.mname,
        user_email: body.email,
        user_tel: body.tel,
        user_dp: {
          url: avatar,
          cld_public_id: ""
        },
        user_pass: hash,
        referral_id: body?.ref_code ? body.ref_code : undefined
      })

      res.json({
        success: true,
        emailExist: false,
        telExist: false,
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


  module.exports = Register