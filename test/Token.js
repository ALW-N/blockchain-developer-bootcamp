const{ expect } = require('chai');
const { ethers } = require("hardhat");
const tokens = (n)=>{
    return ethers.utils.parseUnits(n.toString(),'ether');
}
describe("TOKEN", () => {
    //Tests go inside here

    let token, accounts, deployer, receiver, exchange;

    beforeEach(async ()=> {
        //Repeated code before every it function
        // Fetch Token from blockchain
        const Token = await ethers.getContractFactory('Token')
        token = await Token.deploy("LUFFY","LUF", '1000000')
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        receiver = accounts[1];
        exchange = accounts[2];
    })


    describe("DEPLOYMENT", () => {

        const name ="LUFFY";
        const symbol = "LUF";
        const decimal = '18';
        const totalSupply = '1000000';

        it("Token has the correct name...", async () => {
            expect(await token.name()).to.equal(name)

        })

        it("Token has the correct symbol...", async () => {
             expect(await token.symbol()).to.equal(symbol)
        })

        it("Token has the correct decimal...", async () => {
            expect(await token.decimals()).to.equal(decimal)
       })

       it("Token has the correct total supply...", async () => {

        expect(await token.totalSupply()).to.equal(tokens(totalSupply))
    })

    it("It assigns total supply to the deployer...", async () => {
        expect(await token.balanceOf(deployer.address)).to.equal(tokens(totalSupply))
   })
    })

    describe("SENDING TOKENS",()=>{
        let amount, transaction, result;

        describe("Success..", ()=> {
            beforeEach(async() => {
                amount = tokens(100)
                transaction = await token.connect(deployer).transfer(receiver.address, amount);
                result = await transaction.wait();
            })

                it("Transfers Tokens!", async()=>{
                // console.log("DEPLOYER balance before transaction! ", await token.balanceOf(deployer.address));
                // console.log("RECEIVER balance before transaction! ", await token.balanceOf(receiver.address));

                //ensure tokens were transfered
                     expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
                     expect(await token.balanceOf(receiver.address)).to.equal(amount)

                // console.log("DEPLOYER balance before transaction! ", await token.balanceOf(deployer.address));
                // console.log("RECEIVER balance before transaction! ", await token.balanceOf(receiver.address));

            })
                it("Emits a Transfer Event...", async ()=>{
                    const eventLog = result.events[0];

                    expect(eventLog.event).to.equal("Transfer")


                    const args = eventLog.args;

                    expect(args.from).to.equal(deployer.address)
                    expect(args.to).to.equal(receiver.address)
                    expect(args.value).to.equal(amount)

            })

        })

        describe("Failure...", ()=>{
            it("Rejects insufficiant balances ", async()=>{
                const invalidAmount = tokens(100000000)
                await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted
            })

            it("Rejects invalid recipients..", async () => {
                const amount = tokens(100)
                await expect(token.connect(deployer).transfer("0x0000000000000000000000000000000000000000", amount)).to.be.reverted

            })

        })

    })

    describe("APPROVING TOKENS", ()=>{
        let amount, transaction, result;

        beforeEach(async()=>{
            amount = tokens(100)
            transaction = await token.connect(deployer).approve(exchange.address, amount);
            result = await transaction.wait();
        })
        describe("Success...",()=>{
            it("allocates an allowance for a delegated token spending.",async () => {
                expect (await token.allowance(deployer.address, exchange.address)).to.equal(amount)
            })
            it("Emits an Approval event...", async() =>{
                const eventLog = result.events[0];

                    expect(eventLog.event).to.equal("Approval")


                    const args = eventLog.args;

                    expect(args.owner).to.equal(deployer.address)
                    expect(args.spender).to.equal(exchange.address)
                    expect(args.value).to.equal(amount)

            })
        })

        describe("Failure..", async () =>{
            it("rejects Invalid spenders..", async()=>{
                await expect(token.connect(deployer).approve("0x0000000000000000000000000000000000000000", amount)).to.be.reverted

            })

        })

    })

})
