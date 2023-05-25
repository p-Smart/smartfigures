const formidable = require('formidable');
const cloudinary = require('cloudinary').v2
const sharp = require('sharp');
const Users = require('../models/Users');

const formidablePromise = async (req) => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({fields, files});
    });
  });
};


const ChangeProfileImage = async (req, res) => {
  try{
    const {files} = await formidablePromise(req)
    
    const tempImagePath = files.profileImage.filepath

    // Fetch current image file path in database and delete from cloudinary
    const {user_dp} = await Users.findOne({user_id: req.user_id})
    const currentCldPublicId = user_dp.cld_public_id
    currentCldPublicId && await cloudinary.uploader.destroy(currentCldPublicId)

    // Compress image before saving
    const compressedImage = 
    await sharp(tempImagePath)
          .rotate()
          .resize(800)
          .jpeg({ quality: 40 })
          .toBuffer()
    const dataUrl = `data:image/png;base64,${compressedImage.toString('base64')}`

    const {secure_url, public_id} = await cloudinary.uploader.upload(dataUrl, {
      folder: `smartfigures/users/dp/${req.user_id}`,
    })

    // Store new uploaded image's relative path in database
    await Users.updateOne({user_id: req.user_id}, {user_dp: {
      url: secure_url,
      cld_public_id: public_id
    }})

    res.json({
      success: true,
      path: secure_url
    })
  }
  catch(err){
    res.status(err.status || 500).json({
      error: {
        message: 'An error occurred, try again'
      }
    })
  }
}


module.exports = ChangeProfileImage