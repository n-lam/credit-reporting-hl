credit-reporting-hl

docker exec cliLender peer chaincode install -n loancontract -v 0 -p /opt/gopath/src/github.com/contract -l node

docker exec cliLender peer chaincode instantiate -n loancontract -v 0 -l node -c '{"Args":["org.creditnet.loan:instantiate"]}' -C mychannel -P "AND ('Org1MSP.member')"

docker exec cliLender peer chaincode invoke -n mycc -c '{"function":"queryMarks","Args":["Alice"]}'
