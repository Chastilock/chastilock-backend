async function passwordReset(req, res) {
    console.log(req.params.code);
    console.log(req.params.email);
    console.log(req.params);
}
module.exports = passwordReset;