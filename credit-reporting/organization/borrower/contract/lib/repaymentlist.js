/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');

const Repayment = require('./repayment.js');

class RepaymentList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.creditnet.repayment');
        this.use(Repayment);
    }

    async addRepayment(repayment) {
        return this.addRepayment(repayment);
    }

    async getRepayment(repaymentKey) {
        return this.getState(repaymentKey);
    }

    async updateRepayment(repayment) {
        return this.updateState(repayment);
    }
}


module.exports = RepaymentList;