#!/bin/bash

function _exit(){
    printf "Exiting:%s\n" "$1"
    exit -1
}

# Where am I?
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

cd "${DIR}/organization/lender/configuration/cli"
docker-compose -f docker-compose.yml up -d cliLender

echo "
 Install and Instantiate a Smart Contract

 JavaScript Client Aplications:

 To add identity to the wallet   :   node addToWallet.js
 To get credit report            :   node getReport.js
 To approve the loan application :   node approve.js
 To reject the loan application  :   node reject.js

"

echo "Installing chaincode..."

docker exec cliLender peer chaincode install -n loancontract -v 0 -p /opt/gopath/src/github.com/contract -l node

echo "done."

echo "Instantiating chaincode..."

docker exec cliLender peer chaincode instantiate -n loancontract -v 0 -l node -c '{"Args":["org.creditnet.loan:instantiate"]}' -C mychannel -P "AND ('Org1MSP.member')"

echo "done."

echo "Suggest that you change to this dir>  cd ${DIR}/organization/lender/"
