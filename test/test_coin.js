var TestCoin = artifacts.require("./TestCoin.sol");



//may need work when setBal function is removed
contract('TestCoin', function(accounts) {
    var inst

    it("contract returns token name, symbol, and decimals", function() {
        return TestCoin.deployed()
        .then(function(instance) {
            inst = instance;
            return inst.name.call();
        }).then(function(claimedName) {
            assert.equal(claimedName, "Test Coin", "does not return the correct name");
            return inst.symbol.call();
        }).then(function(claimedSymbol) {
            assert.equal(claimedSymbol, "TST", "does not return the correct symbol");
            return inst.decimals.call();
        }).then(function(claimedDecimals) {
            assert.equal(claimedDecimals, 18, "does not return the correct number of decimals");
        });
    });


    it("balanceOf() working", function() {
        return inst.setBal(accounts[0], 1337)
        .then(function(){
            return inst.balanceOf.call(accounts[0]);
        }).then(function(newBalance) {
            assert.equal(newBalance, 1337, "new Balance not returned");
        });

    });


    it("should return correct number of total coins", function(){
        return inst.totalSupply.call()
        .then(function(claimedTotal) {
            assert.equal(claimedTotal, 65000000, "totalSupply returned the wrong number of total coins");
        });
    });


    it("sender must have enough coins for transaction", function(){
        return inst.transfer(accounts[0], 1338, {from: accounts[0]})
        .then(assert.fail).catch(function(error) {
            assert.include(
                error.message,
                'invalid opcode',
                "transfer should throw exception when sender doesn't have enough coins"
            );
        });
    });

    // this test depends on the one above it passing.
    // if an error is not thrown when the sender has insufficient balance
    // then the transaction will not be rolled back, which is what
    // we are expecting at the beginning of this function
    it("verify transfer(to, tokens) subtracts from sender and gives to receiver", function() {
        return inst.transfer(accounts[1], 1, {from: accounts[0]})
        .then(function() {
            return inst.balanceOf.call(accounts[0]);
        }).then(function(newBalance) {
            assert.equal(newBalance, 1336, "new balance of sender should equal old balance - tokens sent");
            return inst.balanceOf.call(accounts[1]);
        }).then(function(newBalance) {
            assert.equal(newBalance, 1, "new balance of receiver should be old balance + tokens sent");
        });
    });


    it("correctly sets spending allowances", function(){
        return inst.approve(accounts[1], 500, {from: accounts[0]} )
        .then(function(){
            return inst.allowance.call(accounts[0], accounts[1]);
        }).then(function(claimedAllowance){
            assert.equal(claimedAllowance, 500, "the correct allowance is not set after calling approve");
        });
    });


    // this test is dependent upon the above test passing
    // we expect setting spending allowances to work since this
    // is a test of remote spending with approval
    it("transferFrom sends correct number of coins from sender to receiver, and allowance is decreased", function() {
        return inst.transferFrom(accounts[0], accounts[2], 100, {from: accounts[1]} )
        .then(function(){
            return inst.balanceOf.call(accounts[2]);
        }).then(function(receiverBalance) {
            assert.equal(receiverBalance, 100, "receiver did not receive the correct amount of tokens");
            return inst.balanceOf.call(accounts[0]);
        }).then(function(senderBalance) {
            assert.equal(senderBalance, 1236, "sender did not loose the correct amount");
            return inst.allowance.call(accounts[0], accounts[1]);
        }).then(function(remainingAllowance){
            assert.equal(remainingAllowance, 400, "allowance did not decrease by the send amount");
        });
    });

    it("transferFrom throws if spender does not have suffecient allowance", function() {
        return inst.transferFrom(accounts[0], accounts[2], 600, {from: accounts[1]} )
        .then(assert.fail).catch(function(error) {
            assert.include(
                error.message,
                'invalid opcode',
                "transferFrom should throw invalid opcode exception when spender doesnt have enough allowance"
            );
        });
    });

    //we need to test this seperatly than transfer because we didnt implement calling transfer from transferFrom
    it("transferFrom throws is owner does not have sufficient funds", function() {
        return inst.transferFrom(accounts[0], accounts[2], 2000, {from: accounts[1]} )
        .then(assert.fail).catch(function(error) {
            assert.include(
                error.message,
                'invalid opcode',
                "transferFrom should throw invalid opcode exception when ownder does not have sufficient funds"
            );
        });
    });


});
