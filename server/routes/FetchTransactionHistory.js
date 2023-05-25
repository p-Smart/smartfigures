const Transactions = require('../models/Transactions')


const FetchTransactionHistory = async ({user_id, query}, res) => {
    try{
        const filterDates = query.filterDates?.split(',')

        const startDate = filterDates ? `${filterDates[0] || '0000-01-01'}T00:00:00.000Z` : `0000-01-01T00:00:00.000Z`
        const endDate = filterDates ? `${filterDates[1] || '9999-12-31'}T23:59:59.999Z` : `9999-12-31T23:59:59.999Z`

        const type =  (query?.txType===undefined || query?.txType==='all') ? '' : query?.txType
        const totalRecords = ( 
          await Transactions.find({
          user_id: user_id,
          tx_type: { $regex: type, $options: 'i' },
          created_on: { $gt: new Date(startDate), $lt: new Date(endDate) }
        }) ).length

        if(Object.keys(query).length===0){
            var transactionsData = await Transactions.find({user_id: user_id}).sort({created_on: -1}).limit(5)
        }
        else{
          const {perPage, sortBy, sortOrder, page, txType} = query
          const start = ((page - 1) * perPage)

          var transactionsData = await Transactions.find({
            user_id: user_id,
            tx_type: { $regex: !txType || txType==='all' ? /./ : txType, $options: 'i' },
            created_on: { $gte: startDate, $lte: endDate },
          })
        .sort({ [sortBy]: sortOrder })
        .skip(start)
        .limit(parseInt(perPage))

        }
        // transactionsData = transactionsData.map((transaction) => ({...transaction, created_on: transaction.created_on}))
      res.json({
        data: transactionsData,
        totalRecords: totalRecords
      })
    }
    catch(err){
        console.log(err.message)
      res.json({error: {message: err.message}})
    }
}

module.exports = FetchTransactionHistory