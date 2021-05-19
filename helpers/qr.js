const QRCode = require('qrcode');

async function QRAsDataURL(ShareCode) {
  try {
    return await QRCode.toDataURL(`chastilocksharedlock-${ShareCode}`, { errorCorrectionLevel: 'H' })
  } catch (err) {
    return err;
  }
}
module.exports = {
  QRAsDataURL
}
