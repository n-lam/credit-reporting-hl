'use strict';

const State = require('./../ledger-api/state.js');

const cpState = {
    REQUESTED: 1,
    APPROVED: 2,
    REJECTED: 3,
    REPAID: 4,
    DEFAULT: 5
};

class Loan extends State {

    constructor(obj) {
        super(Loan.getClass(), 
            [obj.issuer, 
            obj.borrower, 
            obj.original_amount, 
            obj.application_date]);
        Object.assign(this, obj);
    }

    setRequested() {
        this.currentState = cpState.REQUESTED;
    }

    setApproved() {
        this.currentState = cpState.APPROVED;
    }

    setRejected() {
        this.currentState = cpState.REJECTED;
    }

    setRepaid() {
        this.currentState = cpState.REPAID;
    }

    setDefault() {
        this.currentState = cpState.DEFAULT;
    }

    isRequested() {
        return this.currentState === cpState.REQUESTED;
    }

    isApproved() {
        return this.currentState === cpState.APPROVED;
    }

    isRejected() {
        return this.currentState === cpState.REJECTED;
    }

    isRepaid() {
        return this.currentState === cpState.REPAID;
    }

    isDefault() {
        return this.currentState === cpState.DEFAULT;
    }

    static fromBuffer(buffer) {
        return Loan.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static deserialize(data) {
        return State.deserializeClass(data, Loan);
    }

    static createInstance(issuer, borrower, original_amount, application_date, repayment_period, repayment_amount) {
        return new Loan({issuer, borrower, original_amount, application_date, repayment_period, repayment_amount});
    }



    static getClass() {
        return 'org.creditnet.loan';
    }
}

module.exports = Loan;
