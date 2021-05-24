const { CreatedLock } = require('../../models');
const { QRAsDataURL } = require('../../helpers/qr');
const { GetUsername } = require('../../helpers/user');

async function loadlock(req, res) {

    const LockID = req.params.lockid
    const LockSearch = await CreatedLock.findOne({
        where: {
            Shared_Code: LockID,
            Shared: 1
        }
    })

    if(LockSearch) {

        const QR = await QRAsDataURL(LockID);

        res.render("loadlock", {
            LockName: LockSearch.Lock_Name,
            QR,
            Keyholder: await GetUsername(LockSearch.User_ID)
        });
    } else {
        res.end("Lock not found!", 404)
    }
}
module.exports = loadlock