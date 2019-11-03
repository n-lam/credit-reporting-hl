#!/bin/bash
#
# SPDX-License-Identifier: Apache-2.0
#
function _exit(){
    printf "Exiting:%s\n" "$1"
    exit -1
}

# Where am I?
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

cd "${DIR}/organization/borrower/configuration/cli"
docker-compose -f docker-compose.yml up -d cliBorrower

echo "

 Install and Instantiate a Smart Contract as 'Borrower'

 JavaScript Client Aplications:

 To add identity to the wallet:   node addToWallet.js
 To request a loan            :   node request.js
 To repay a loan              :   node repay.js
 To check loan applications   :   node checkLoans.js

"
echo "Suggest that you change to this dir>  cd ${DIR}/organization/borrower"