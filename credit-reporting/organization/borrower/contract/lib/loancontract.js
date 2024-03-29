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

    async request(ctx, issuer, borrower, original_amount, application_date, repayment_period, repayment_amount) {

        let loan = Loan.createInstance(
            issuer, 
            borrower, 
            original_amount, 
            application_date, 
            repayment_period, 
            repayment_amount
        );

        loan.setRequested();

        await ctx.loanList.addLoan(loan);

        return loan;
    }

    async getReport(ctx, issuer, borrower, original_amount, application_date) {
        let loanKey = Loan.makeKey([issuer, borrower, original_amount, application_date]);
        let loan = await ctx.loanList.getLoan(loanKey);

        return loan;
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
            loan.setRejected();
        } else {
            throw new Error('Loan application ' + issuer + borrower + ' is not in a valid state');
        }

        await ctx.loanList.updateLoan(loan);
        return loan;
    }

    async repay(ctx, issuer, borrower, original_amount, application_date) {
        let loanKey = Loan.makeKey([issuer, borrower, original_amount, application_date]);
        let loan = await ctx.loanList.getLoan(loanKey);

        console.log(`Loan current_state = ${loan.currentState}`);

        if (loan.isApproved()) {
            loan.setRepaid();
        } else {
            throw new Error('Loan application ' + issuer + borrower + ' is not in a valid state');
        }

        await ctx.loanList.updateLoan(loan);
        return loan;
    }

    async defaulted(ctx, issuer, borrower, original_amount, application_date) {
        let loanKey = Loan.makeKey([issuer, borrower, original_amount, application_date]);
        let loan = await ctx.loanList.getLoan(loanKey);

        console.log(`Loan current_state = ${loan.currentState}`);

        if (loan.isApproved()) {
            loan.setDefault();
        } else {
            throw new Error('Loan application ' + issuer + borrower + ' is not in a valid state');
        }

        await ctx.loanList.updateLoan(loan);
        return loan;
    }
}

module.exports = LoanContract;
