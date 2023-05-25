const Users = require("../models/Users")
const bcrypt = require('bcrypt')



const verifyPassword = async (id, pass) => {
    const userData = await Users.findOne({user_id: id})
    const dbPass = userData.user_pass
    let result = await bcrypt.compare(pass, dbPass)
    return result
}


module.exports = verifyPassword