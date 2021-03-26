const { ValidateEmail } = require('../helpers/validation');
const { expect } = require('chai');

describe("Email validation", function() {
    it("Works as expected", function() {
        expect(ValidateEmail("test@example.com")).to.equal(true);
        expect(ValidateEmail("thisisareallylongemail@example.co")).to.equal(true);
        expect(ValidateEmail("a@a.co")).to.equal(true);
        expect(ValidateEmail("invalid@example")).to.equal(false);;
        expect(ValidateEmail("@google.com")).to.equal(false);
        expect(ValidateEmail("")).to.equal(false);
        expect(ValidateEmail("f")).to.equal(false);

})

});