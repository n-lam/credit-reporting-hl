'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const Loan = require('../contract/lib/loan.js');

// A wallet stores a collection of identities for use
//const wallet = new FileSystemWallet('../user/isabella/wallet');
const wallet = new FileSystemWallet('../identity/user/isabella/wallet');

// Main program function
async function main() {

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        // const userName = 'isabella.issuer@magnetocorp.com';
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

        console.log('Submit loan rejection transaction.');

        const issueResponse = await contract.submitTransaction('reject', 'Lender', 'Borrower', '100', '2019-11-03');

        // process response
        console.log('Process issue transaction response.'+issueResponse);

        let loan = Loan.fromBuffer(issueResponse);

        console.log(`${loan.application_date} : ${loan.borrower} requesting ${loan.original_amount} from ${loan.issuer} has been rejected.`);
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

    console.log('Rejection program complete.');

}).catch((e) => {

    console.log('Rejection program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});