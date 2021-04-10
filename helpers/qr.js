const QRCode = require('qrcode');

async function QRAsDataURL(ShareCode) {
  QRCode.toDataURL(`chastilock-${ShareCode}`, function (err, url) {
    if(err === null) {
      return url;
    } else {
      return err;
    }
  })
}
module.exports = {
  QRAsDataURL
}
