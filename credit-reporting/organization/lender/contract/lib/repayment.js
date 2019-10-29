'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate commercial paper state values
const cpState = {
    UNPAID: 1,
    PAID: 2,
    LATE: 3
};

class Repayment extends State {

    constructor(obj) {
        super(Repayment.getClass(), 
            [obj.loanKey,
            obj.expectedAmount,
            obj.expectedDate]);
        Object.assign(this, obj);
    }

    setUnpaid() {
        this.unpaid = UNPAID;
    }

    setPaid() {
        this.paid = PAID;
    }

    setLate() {
        this.currentState = LATE;
    }

    isUnpaid() {
        return this.currentState === cpState.UNPAID;
    }

    isPaid() {
        return this.currentState === cpState.PAID;
    }

    isLate() {
        return this.currentState === cpState.LATE;
    }

    static fromBuffer(buffer) {
        return Repayment.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Repayment);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(loanKey, amount, timestamp, previousRepayment, expectedAmount, expectedDate) {
        return new Repayment({loanKey, amount, timestamp, previousRepayment, expectedAmount, expectedDate});
    }

    static getClass() {
        return 'org.creditnet.repayment';
    }
}

module.exports = Repayment;
