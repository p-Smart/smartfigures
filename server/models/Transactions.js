const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transConfig = {
    type: String,
    required: true
}
const dateConfig = {
    type: Date,
    default: new Date()
}
const otherConfig = {
    type: String,
    default: ''
  }

const Transactions = mongoose.model('Transactions', new Schema({
    user_id: transConfig,
    tx_ref: transConfig,
    amount: {
        type: Number,
        required: true
    },
    payment_provider: otherConfig,
    tx_type: transConfig,
    status: {
        type: String,
        default: 'PENDING'
    },
    created_on: dateConfig,
    finalized_on: dateConfig
  }, 
  {
    collection: 'transactions'
  })
)

module.exports = Transactions