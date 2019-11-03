#!/bin/bash

function _exit(){
    printf "Exiting:%s\n" "$1"
    exit -1
}

# Exit on first error, print all commands.
set -ev
set -o pipefail

# Where am I?
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

cd "${DIR}/../basic-network/"

docker kill cliBorrower cliLender logspout || true
./teardown.sh || true
./start.sh || _exit "Failed to start Fabric"

"${DIR}/organization/lender/configuration/cli/monitordocker.sh" net_basic
