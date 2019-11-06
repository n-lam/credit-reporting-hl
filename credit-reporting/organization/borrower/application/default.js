'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const Loan = require('../contract/lib/loan.js');

// A wallet stores a collection of identities for use
const wallet = new FileSystemWallet('../identity/user/isabella/wallet');

// Main program function
async function main() {

    if (process.argv.length != 6) {
        console.log('Error: Incorrect number of arguments');
        console.log(`Usage: ${process.argv[0]} ${process.argv[1]} <lender> <borrower> <original_amount> <settlement_date>`);
        return;
    }

    let lender = process.argv[2];
    let borrower = process.argv[3];
    let original_amount = process.argv[4];
    let settlement_date = process.argv[5];

    console.log(`Defaulting for the following loan => ${lender}:${borrower}:${original_amount}:${settlement_date}`);

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        const userName = 'User1@org1.example.com';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/networkConnection.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:false, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        console.log('Use org.creditnet.loan smart contract.');

        const contract = await network.getContract('loancontract');

        console.log('Submit loan request transaction.');

        const issueResponse = await contract.submitTransaction('defaulted', lender, borrower, original_amount, settlement_date);

        // process response
        console.log('Process request transaction response.'+issueResponse);

        let loan = Loan.fromBuffer(issueResponse);

        console.log(`${loan.borrower}:${loan.issuer}:${loan.application_date}:${loan.original_amount}:${loan.repayment_amount}:${loan.repayment_period} has defaulted`);
        console.log('Transaction complete.');

    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}
main().then(() => {

    console.log('Default program complete.');

}).catch((e) => {

    console.log('Default program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});