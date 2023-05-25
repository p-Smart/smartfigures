const axios = require('axios')


const FetchBanks = (req, res) => {
    axios.get('https://api.paystack.co/bank?country=nigeria', {
      headers: {
        'Authorization': 'Bearer ' + process.env.PYS_SECRET_KEY
      }
    })
    .then(({data}) => {
      res.json(data.data)
    })
    .catch((err) => {
      res.json({
        error:{
            message: err.message,
            additionalData: err?.response?.data
        }
      })
    });
}



module.exports = FetchBanks