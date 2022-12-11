const{ expect } = require('chai');
const { ethers } = require("hardhat");
const tokens = (n)=>{
    return ethers.utils.parseUnits(n.toString(),'ether');
}
describe("Token", () => {
    //Tests go inside here

    let token

    beforeEach(async ()=> {
        //Repeated code before every it function
        // Fetch Token from blockchain
        const Token = await ethers.getContractFactory('Token')
        token = await Token.deploy("LUFFY","LUF", '1000000')

    })


    describe("Deployment", () => {

        const name ="LUFFY";
        const symbol = "LUF";
        const decimal = '18';
        const totalSupply = '1000000';

        it("TOKEN HAS THE CORRECT NAME!!", async () => {
            expect(await token.name()).to.equal(name)

        })

        it("TOKEN HAS THE CORRECT SYMBOL!!", async () => {
             expect(await token.symbol()).to.equal(symbol)
        })

        it("TOKEN HAS THE CORRECT DECIMAL!!", async () => {
            expect(await token.decimals()).to.equal(decimal)
       })

       it("TOKEN HAS THE CORRECT TOTAL SUPPLY!!", async () => {

        expect(await token.totalSupply()).to.equal(tokens(totalSupply))
    })
    })


})
