'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const Loan = require('./loan.js');

class LoanList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.creditnet.loanlist');
        this.use(Loan);
    }

    async addLoan(loan) {
        return this.addState(loan);
    }

    async getLoan(loanKey) {
        return this.getState(loanKey);
    }

    async updateLoan(loan) {
        return this.updateState(loan);
    }

    async getAllLoans() {
        return this.supportedClasses;
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static fromBuffer(buffer) {
        return LoanList.deserialize(buffer);
    }
}


module.exports = LoanList;