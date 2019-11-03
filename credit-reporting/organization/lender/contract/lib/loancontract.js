/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const Loan = require('./loan.js');
const LoanList = require('./loanlist.js');

/**
 * A custom context provides easy access to list of all commercial papers
 */
class LoanContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.loanList = new LoanList(this);
    }

}

class LoanContract extends Contract {

    constructor() {
        super('org.creditnet.loan');
    }

    createContext() {
        return new LoanContext();
    }

    async instantiate(ctx) {
        console.log('Instantiate the contract');
    }

    async request(ctx, issuer, borrower, original_amount, remaining_amount, settlement_date, repayment_period, repayment_amount) {

        let loan = Loan.createInstance(ctx, 
            issuer, 
            borrower, 
            original_amount, 
            remaining_amount, 
            settlement_date,
            repayment_period, 
            repayment_amount
        );

        loan.setRequested();

        await ctx.loanList.addLoan(loan);

        return loan;
    }

    async getReport(ctx) {
        ctx.loanList.getAllLoans();
    }

    async approve(ctx, issuer, borrower, original_amount, application_date) {
        let loanKey = Loan.makeKey([issuer, borrower, original_amount, application_date]);
        let loan = await ctx.loanList.getLoan(loanKey);

        if (loan.isRequested()) {
            loan.setApproved();
        } else {
            throw new Error('Loan application ' + issuer + borrower + ' is not in a valid state');
        }

        await ctx.loanList.updateLoan(loan);
        return loan;
    }

    async reject(ctx, issuer, borrower, original_amount, application_date) {
        let loanKey = Loan.makeKey([issuer, borrower, original_amount, application_date]);
        let loan = await ctx.loanList.getLoan(loanKey);

        if (loan.isRequested()) {
            loan.setReject();
        } else {
            throw new Error('Loan application ' + issuer + borrower + ' is not in a valid state');
        }

        await ctx.loanList.updateLoan(loan);
        return loan;
    }

}

module.exports = LoanContract;
