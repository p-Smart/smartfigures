const mongoose = require('mongoose')
const Schema = mongoose.Schema

const balanceConfig = {
    type: Number,
    default: 0.00
}
const detailConfig = {
    type: String,
    required: true
}
const dateConfig = {
    type: Date,
    default: new Date()
}
const refConfig = {
  type: String,
  default: ''
}
const verifyConfig = {
  type: Boolean,
  default: false
}
const otherConfig = {
  type: String,
  default: ''
}

const Users = mongoose.model('Users', new Schema({
    user_id: detailConfig,
    user_fname: detailConfig,
    user_lname: detailConfig,
    user_mname: otherConfig,
    main_balance: balanceConfig,
    investment_balance: balanceConfig,
    profit_balance: balanceConfig,
    user_email: detailConfig,
    user_tel: otherConfig,
    user_country: otherConfig,
    user_state: otherConfig,
    user_pass: otherConfig,
    user_dp: Object,
    user_email_verified: verifyConfig,
    user_tel_verified: verifyConfig,
    referee_id: refConfig,
    referral_id: refConfig,
    user_reg_date: dateConfig
  }, 
  {
    collection: 'users'
  })
)

module.exports = Users