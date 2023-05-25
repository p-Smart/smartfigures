const Users = require('../models/Users');
function filterDetails(array) {
    const result = array.map(({ user_fname, user_lname, user_email, user_tel, user_dp, user_email_verified, user_reg_date}) => {
        return {
            user_fname: user_fname,
            user_lname: user_lname,
            user_email: user_email,
            user_tel: user_tel,
            user_dp: user_dp,
            user_email_verified: user_email_verified,
            user_reg_date: user_reg_date
        }
    });
    return result;
  }
  

const FetchReferrals = async ({user_id, query}, res) => {
    try{
      const userData = await Users.findOne({user_id: user_id})
      const referee_id = userData?.referee_id?.length !== 0 ? userData?.referee_id : null

      const totalRecords = await Users.countDocuments({referral_id: referee_id})

      const {perPage=5, sortBy='user_reg_date', page=1} = query
      const sortOrder = query.sortOrder === 'ASC' ? 1 : -1
      const searchToken = query.searchToken

      const start = ((page - 1) * perPage)
      
      const searchResult = await Users.find({
        referral_id: referee_id,
        $or: [
          { user_fname: { $regex: searchToken, $options: 'i' } },
          { user_lname: { $regex: searchToken, $options: 'i' } },
          { user_email: { $regex: searchToken, $options: 'i' } },
          { user_tel: { $regex: searchToken, $options: 'i' } }
        ]
      })
      .sort({ [sortBy]: sortOrder })
      .skip(start)
      .limit(parseInt(perPage))

      res.json({
        data: filterDetails(searchResult),
        totalRecords: totalRecords
      })
    }
    catch(err){
        res.json({error: {message: err.message}})
    }
}

module.exports = FetchReferrals