const QRCode = require('qrcode');

async function QRAsDataURL(ShareCode) {
  QRCode.toDataURL(`chastilocksharedlock-${ShareCode}`, function (err, url) {
    if(err === null) {
      return url;
    } else {
      return `Error: ${err}`;
    }
  })
}
module.exports = {
  QRAsDataURL
}
