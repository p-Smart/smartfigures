const { noreplyTransport } = require("./config")


const sendOTPEmail = async (email, subject, username, otp, expiry) => {
    let mailOptions = {
        from: 'SmartFigures no-reply@smartfigures.vercel.app',
        to: email,
        subject: subject,
        html: html(username, otp, expiry)
      };
    
    try{
    await noreplyTransport.sendMail(mailOptions)
    }
    catch(err){
        await noreplyTransport.sendMail(mailOptions)
    }
}


const html = (username, otp, expiry) => {
    return(`
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
<html lang="en">

  <head></head>
  <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Confirm your email address<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
  </div>

  <body style="background-color:#ffffff;margin:0 auto;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif">
    <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:600px;margin:0 auto">
      <tr style="width:100%">
        <td>
          <table style="margin-top:32px" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
            <tbody>
              <tr>
                <td><img alt="Smart Figures" src="https://lh3.googleusercontent.com/u/2/drive-viewer/AFGJ81qA2eN62nHF8JTfaRU10R8kOj_m1dtF2eO8e5J8C26SaOzH4NHjAuK2NyVdMe4c7oYcT8-Am88FVYeYyq_HUjxAGTgE=w1920-h932" width="50" height="50" style="display:block;outline:none;border:none;text-decoration:none; object-fit: cover;" /></td>
              </tr>
            </tbody>
          </table>
          <h1 style="color:#1d1c1d;font-size:36px;font-weight:700;margin:30px 0;padding:0;line-height:42px">Confirm your email address</h1>
          <p style="font-size:20px;line-height:28px;margin:16px 0;margin-bottom:30px">Dear ${username}, your confirmation code is below - enter it in your open browser window to verify your email address. <br> Valid for ${expiry} minutes.</p>
          <table style="background:rgb(245, 244, 245);border-radius:4px;margin-right:50px;margin-bottom:30px;padding:43px 23px" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
            <tbody>
              <tr>
                <td>
                  <p style="font-size:30px;line-height:24px;margin:16px 0;text-align:center;vertical-align:middle">${otp}</p>
                </td>
              </tr>
            </tbody>
          </table>
          <p style="font-size:14px;line-height:24px;margin:16px 0;color:#000">If you didn&#x27;t request this email, there&#x27;s nothing to worry about - you can safely ignore it.</p>
          <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
            <tbody>
              <tr>
                <td>
                  <table width="100%" style="margin-bottom:32px;padding-left:8px;padding-right:8px;width:100%" align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0">
                    <tbody style="width:100%">
                      <tr style="width:100%">
                        <td style="width:66%"><img alt="Smart Figures" src="https://lh3.googleusercontent.com/u/2/drive-viewer/AFGJ81qA2eN62nHF8JTfaRU10R8kOj_m1dtF2eO8e5J8C26SaOzH4NHjAuK2NyVdMe4c7oYcT8-Am88FVYeYyq_HUjxAGTgE=w1920-h932" width="50" height="50" style="display:block;outline:none;border:none;text-decoration:none; object-fit: cover;" /></td>
                        <td>
                          <table width="100%" align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0">
                            <tbody style="width:100%">
                              <tr style="width:100%">
                                <td><a target="_blank" style="color:#067df7;text-decoration:none" href="https://smartfigures.vercel.app"><img alt="smart figures" src="https://lh3.googleusercontent.com/u/2/drive-viewer/AFGJ81oNX35WiM2cNsrz4Be7VT7aMEJcWGI2Fs-h5aDaj1b6Nm6_VU4faOUu-6JQuHbtTX-70yR63r8IpfKfNMito6-fW3U-Lw=w648-h932" width="32" height="32" style="display:inline;outline:none;border:none;text-decoration:none;margin-left:32px" /></a></td>
                                <td><a target="_blank" style="color:#067df7;text-decoration:none" href="https://smartfigures.vercel.app"><img alt="smart figures" src="https://lh3.googleusercontent.com/u/2/drive-viewer/AFGJ81p0EDiMCd1qUQq2MaasdmW5aG5tASgE7eRhpcSlgFGxVvrMfQXc_1gmXy8t07BkoZad06fh3MDdiA8jbodV2uItM1MKPg=w648-h932" width="32" height="32" style="display:inline;outline:none;border:none;text-decoration:none;margin-left:32px" /></a></td>
                                <td><a target="_blank" style="color:#067df7;text-decoration:none" href="https://smartfigures.vercel.app"><img alt="smart figures" src="https://lh3.googleusercontent.com/u/2/drive-viewer/AFGJ81riT83OcbGjLJqnBUGJa--d6Tpo9Rm5njXC1dBPwPS7lCd1rSovqWs-DL_POtr7-jg1A5ycwY3_RX8yPP1GICj2Lr5Q=w648-h932" width="32" height="32" style="display:inline;outline:none;border:none;text-decoration:none;margin-left:32px" /></a></td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
            <tbody>
              <tr>
                <td><div style="color:#b7b7b7;">This email was auto-generated.<br>Replies to this emails won't be delivered. Have any enquiries? Contact us through our service channels</div>
                  <p style="font-size:12px;line-height:15px;margin:16px 0;color:#b7b7b7;text-align:left;margin-bottom:50px">©2022 Smart Figures. <br />Flat 6, Block 12, Amina Way, University of Ibadan. <br /><br />All rights reserved.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </table>
  </body>

</html>
    `)
}


module.exports = sendOTPEmail