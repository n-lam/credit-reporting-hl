'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate commercial paper state values
const cpState = {
    SUBMITTED: 1,
    VERIFIED: 2
};

class BorrowerIdentity extends State {

    constructor(obj) {
        super(BorrowerIdentity.getClass(), [obj.surname, obj.givenNames, obj.birthDate, obj.driverLicenseNo]);
        Object.assign(this, obj);
    }

    setSubmitted() {
        this.currentState = SUBMITTED;
    }

    setVerified() {
        this.currentState = VERIFIED;
    }

    isSubmitted() {
        return this.currentState === cpState.SUBMITTED;
    }

    isVerified() {
        return this.currentState === cpState.VERIFIED;
    }

    static fromBuffer(buffer) {
        return BorrowerIdentity.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, BorrowerIdentity);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(surname, givenNames, birthDate, currentAddress, previousAddress1, previousAddress2, latestEmployer, driverLicenseNo) {
        return new BorrowerIdentity({surname, givenNames, birthDate, currentAddress, previousAddress1, previousAddress2, latestEmployer, driverLicenseNo });
    }

    static getClass() {
        return 'org.creditnet.borroweridentity';
    }
}

module.exports = BorrowerIdentity;
