require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser')

// MongoDB Connection
const mongoose = require('mongoose')
const connectToDB = require('./config/dbConnect');
connectToDB();


const verifyAuthToken = require('./components/verifyAuthToken');
const Register = require('./routes/Register')
const FetchUser = require('./routes/FetchUser')
const Login = require('./routes/Login')
const LoggedIn = require('./routes/CheckLoggedIn')
const ChangeProfileImage = require('./routes/ChangeProfileImage')
const ChangePassword = require('./routes/ChangePassword')
const FetchTransactionHistory = require('./routes/FetchTransactionHistory')
const CheckTransactionStatus = require('./routes/checkTransactionStatus')
const PaystackDeposit = require('./routes/PaystackDeposit')
const FlutterwaveDeposit = require('./routes/FlutterwaveDeposit')
const VerifyFlutterwaveDeposit = require('./routes/VerifyFlutterwaveDeposit')
const VerifyPaystackDeposit = require('./routes/VerifyPaystackDeposit');
const UpdateProfile = require('./routes/UpdateProfile');
const FetchBanks = require('./routes/FetchBanks');
const InitiateWithdrawal = require('./routes/InitiateWithdrawal');
const VerifyEmail = require('./routes/VerifyEmail');
const FetchReferrals = require('./routes/FetchReferrals');
const GenerateReferralId = require('./routes/GenerateReferralId');
const VerifyReferralCode = require('./routes/VerifyReferralCode');
const DeleteExpiredOTPs = require('./routes/DeleteExpiredOTPs');


app.use(cookieParser())

app.use(express.urlencoded({extended: false}))

app.use(cors({
  origin: [process.env.CLIENT_DOMAIN],
  methods: ['GET', 'POST', 'PUT'],
  credentials: true,
}));


app.post('/register', Register)


app.get('/fetchUser', verifyAuthToken, FetchUser)


app.get('/loggedIn', LoggedIn)


app.post('/login', Login)


app.post('/changeProfileImage', verifyAuthToken, ChangeProfileImage)


app.put('/user/changePassword', verifyAuthToken, ChangePassword)


app.post('/user/deposit/flutter', verifyAuthToken, FlutterwaveDeposit)


app.post('/user/deposit/paystack', verifyAuthToken, PaystackDeposit)


app.get('/user/deposit/flutter/verify', verifyAuthToken, VerifyFlutterwaveDeposit)


app.get('/user/deposit/paystack/verify', verifyAuthToken, VerifyPaystackDeposit)


app.get('/fetchTransactionHistory', verifyAuthToken, FetchTransactionHistory)


app.put('/user/profile/update', verifyAuthToken, UpdateProfile)


app.get('/fetchBanks', verifyAuthToken, FetchBanks)


app.post('/user/withdrawal/initiate', verifyAuthToken, InitiateWithdrawal)


app.post('/verify-email',verifyAuthToken, VerifyEmail)


app.get('/verify-email',verifyAuthToken, VerifyEmail)


app.get('/referrals/fetch-referrals', verifyAuthToken, FetchReferrals)


app.get('/referrals/generate-referral-id', verifyAuthToken, GenerateReferralId)


app.get('/referrals/verify-referral-code', VerifyReferralCode)


app.get('/update-transactions', CheckTransactionStatus)

app.get('/delete-expired-otps', DeleteExpiredOTPs)




app.get('/keep-active', (_, res) => res.send('Active...'))


// const cloudinary = require('cloudinary').v2
// app.get('/test', async (req, res) => {
//   try{
//     const des = await cloudinary.uploader.destroy('s')
//     const response = await cloudinary.uploader.upload('Waterfall-Model.png', {
//       folder: 'smartfigures/users/dp/eaby7257',
//     })
//     res.json({
//       response: response
//     })
//   }
//   catch(err){
//     console.error(err)
//     res.status(500).json({
//       error: {
//         message: err.message
//       }
//     })
//   }
// })


// const Users = require('./models/Users');
// const Transactions = require('./models/Transactions');
// app.get('/', async (req, res) => {
//   await Transactions.updateMany({}, { $unset: { id: 1 } });
//   res.send('Done')
// })






app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
})

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: `You're lost, man!`
    }
  });
  next()
})


mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(process.env.PORT, () => console.log(`server running on port ${process.env.PORT}`))
})