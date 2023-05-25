const Users = require('../models/Users')
const {sqlQuery} = require('./database')
const crypto = require('crypto')
const generateUniqueRId = async() => {

    let id = (crypto.randomBytes(3).toString('hex')).toUpperCase()
    try{
    const duplicate = await Users.findOne({$or: [{referral_id: id}, {referee_id: id}] })
    if (duplicate){
      return generateUniqueRId()
    }
    return id
    }
    catch(err){
      throw new Error(err.message)
    }
  }


module.exports = generateUniqueRId