const jwt = require('jsonwebtoken')

const verifyAuthToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const authToken = (authHeader && authHeader.split(' ')[1]) || req.cookies.authToken || req.query.token
    try{
    const {user_id} = await jwt.verify(authToken, process.env.JWT_SECRET)
    req.user_id = user_id
    req.authToken = authToken
    next()
    }
    catch(err){
        res.status(401).json({
          success: false,
          error: false,
          message: 'Not authorized'
        })
      }
}

module.exports = verifyAuthToken