/*
SPDX-License-Identifier: Apache-2.0
*/

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
}


module.exports = LoanList;