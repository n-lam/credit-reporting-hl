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
 Install and Instantiate a Smart Contract in either langauge

 JavaScript Client Aplications:

 To add identity to the wallet   :   node addToWallet.js
 To get credit report            :   node getReport.js
 To approve the loan application :   node approve.js
 To reject the loan application  :   node reject.js

"

echo "Suggest that you change to this dir>  cd ${DIR}/organization/lender/"
