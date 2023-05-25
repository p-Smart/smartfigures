const Users = require('../models/Users');


const checkRefCodeExists = async (ref_code) => {
    const duplicate = await Users.findOne({ referee_id: ref_code })
    return duplicate
}


module.exports = checkRefCodeExists