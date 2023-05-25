const Transactions = require('../models/Transactions')
const crypto = require('crypto')
const generateTxRef = async() => {
    let txRef = 'tx' + crypto.randomBytes(8).toString('hex')
    const duplicate = await Transactions.findOne({ tx_ref: txRef })
    if (duplicate){
      return await generateTxRef()
    }
    return txRef
  }


module.exports = generateTxRef