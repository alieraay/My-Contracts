const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, network } = require("hardhat");
const provider = ethers.provider;

describe("TokenXYZ Contract", function () {
    
    let owner, user1;
    let XYZToken, xyztoken;
    let startTime, endTime, saleDuration, transferTime, remainSupply;

    before(async function() {
        [owner, user1] = await ethers.getSigners();

        XYZToken = await ethers.getContractFactory("TokenXYZ");
        xyztoken  = await XYZToken.connect(owner).deploy();
    });

    it("Deploys the contract", async function() {
        expect(xyztoken.address).to.not.be.undefined;
    });

    it("Check balances", async function() {
        expect(await xyztoken.balanceOf(owner.address)).to.equal(0);
    });

    it("Check remainSupply", async function() {
        expect(Number(await xyztoken.remainSupply())).to.equal(10**6*10**18);
        remainSupply = Number(await xyztoken.remainSupply());
    });

    it("Check tokenPrice", async function() {
        expect(Number(await xyztoken.tokenPrice())).to.equal(10**18);
    });

    it("Check saleOpen constructor ", async function() {
        expect(await xyztoken.saleOpen()).to.equal(false);
    });

    it("Check fundAddress constructor ", async function() {
        expect(await xyztoken.fundAddress()).to.equal("0xdD870fA1b7C4700F2BD7f44238821C26f7392148");
    });
    
    it("Check transferClosed status constructor ", async function() {
        expect(await xyztoken.transferClosed()).to.equal(true);
    });

    it("Check noMoreSales after deployment", async function() {
        expect(await xyztoken.noMoreSales()).to.equal(false);
    });

    it("Starts sale", async function() {
        await expect(xyztoken.connect(user1).startSale()).to.be.reverted;
        await xyztoken.connect(owner).startSale();
        expect(await xyztoken.saleOpen()).to.equal(true);
    });
    
    it("Start time", async function(){
        expect(await xyztoken.startTime()).to.equal((await provider.getBlock()).timestamp);
        startTime = Number(await xyztoken.startTime());
    });

    it("Check transferDuration", async function(){
        expect(Number(await xyztoken.saleDuration()/2)).to.equal(Number(await xyztoken.transferDuration()));
        saleDuration = Number(await xyztoken.saleDuration());
        transferTime = startTime + saleDuration/2;
    });

    it("Check endTime", async function(){
        expectedEndtime = startTime + saleDuration;
        expect(Number(await xyztoken.endTime())).to.equal(expectedEndtime);
        endTime = expectedEndtime;
    });

    // Before transfer time
    
    it("Check buyTokens() requires before transfer time, ", async function(){
        expect(await xyztoken.saleOpen()).to.equal(true);
        expect(Number(await xyztoken.remainSupply())).greaterThan(0);
    });

    it("Check buyTokens() before transfer time, different value", async function(){
        await expect( xyztoken.connect(user1).buyTokens({ value: ethers.utils.parseEther("0.2") })).to.be.reverted;
    });

    it("Check buyTokens() before transfer time, mint", async function(){
        expect(await xyztoken.reservationCount(user1.address)).to.equal(0);
        const initialRemainSupply = Number(await xyztoken.remainSupply());
        const initialSupply = await xyztoken.totalSupply();
        await xyztoken.connect(user1).buyTokens({ value: ethers.utils.parseEther("1") });
        const finalSupply = initialSupply + ethers.utils.parseEther("1");
        expect(finalSupply).to.equal(await xyztoken.balanceOf(owner.address));
        expect(Number(await xyztoken.remainSupply())).to.equal(initialRemainSupply - ethers.utils.parseEther("1"));
    });

    it("Check buyTokens(), transfer ether to fundAddress", async function(){
        const fundAddressBalance = await ethers.provider.getBalance(xyztoken.fundAddress());
        expect(fundAddressBalance).to.equal(ethers.utils.parseEther("1"));
    });
    
    it("Check buyTokens() before transfer time,reservationCount", async function(){
        expect(await xyztoken.reservationCount(user1.address)).to.equal(ethers.utils.parseEther("1"));
    });

    it("Check startTransfer before transfer time", async function(){
        expect(await xyztoken.saleOpen()).to.equal(true);     
        await expect(xyztoken.connect(owner).startTransfer()).to.be.reverted;
    });

    it("Check burn() before transfer time", async function(){
        await expect(xyztoken.connect(owner).burnRemain()).to.be.reverted;
    });

    // After Transfertime
    it("Check startTransfer exact time", async function(){
        
        await network.provider.send("evm_setNextBlockTimestamp", [transferTime]);
        await xyztoken.connect(owner).startTransfer();
        expect(await xyztoken.transferClosed()).to.equal(false);
    });

    it("Check buyTokens() requires before transfer time, ", async function(){
        expect(await xyztoken.saleOpen()).to.equal(true);
        expect(Number(await xyztoken.remainSupply())).greaterThan(0);
    });

    it("Check buyTokens() after transfer time, different value", async function(){
        await expect( xyztoken.connect(user1).buyTokens({ value: ethers.utils.parseEther("0.2") })).to.be.reverted;
    });

    it("Check buyTokens() after transfer time, mint, balanceOf, remainSupply", async function(){
        const initialRemainSupply = Number(await xyztoken.remainSupply());
        const reserved = Number(await xyztoken.reservationCount(user1.address));
        
        await xyztoken.connect(user1).buyTokens({ value: ethers.utils.parseEther("1") });
        expect(Number(await xyztoken.balanceOf(user1.address))).to.equal(reserved + Number(ethers.utils.parseEther("1")));
        expect(Number(await xyztoken.remainSupply())).to.equal(initialRemainSupply - ethers.utils.parseEther("1"));
        
    });

    it("Check buyTokens() 1 ether to fundAddress (fundAddress should has 2 ether)", async function(){
        const fundAddressBalance = await ethers.provider.getBalance(xyztoken.fundAddress());
        expect(fundAddressBalance).to.equal(ethers.utils.parseEther("2"));
    });

    it("Check startSale() after transfer time", async function(){
        await expect(xyztoken.connect(owner).startSale()).to.be.revertedWith("Sale has already started");
    });

    it("Check startTransfer after transfer time", async function(){
        await expect(xyztoken.connect(owner).startTransfer()).to.be.revertedWith("Transfer already started");
    });

    it("Check endSale() after transfer time", async function(){
        await expect(xyztoken.connect(owner).endSale()).to.be.revertedWith("Sale time doesn't end yet");
    });

    // This is for testing burn mechanism

    it("This function for adding token for owner and do not transfer anyone for next tests", async function(){
        await xyztoken.connect(owner).buyTokens({value : ethers.utils.parseEther("1")});
    });

    // After Sale

    it("Check endSale(), requires", async function(){
        await network.provider.send("evm_setNextBlockTimestamp", [endTime]);
        expect(await xyztoken.saleOpen()).to.equal(true);
        expect(await xyztoken.transferClosed()).to.equal(false);
        expect(await xyztoken.noMoreSales()).to.equal(false);
    });

    it("Check startSale after sale time", async function(){
        await expect((xyztoken.connect(owner)).startSale()).to.be.revertedWith("Sale has already started");
    });

    it("Check startTransfer after sale time", async function(){
        await expect((xyztoken.connect(owner)).startTransfer()).to.be.revertedWith("Transfer already started");
    });

    it("Check buyTokens() after sale time", async function(){
        await expect((xyztoken.connect(user1)).buyTokens({value: ethers.utils.parseEther("1") })).to.be.revertedWith("Time is up");
    });

    it("Check transferTokens after sale time", async function(){
        await expect(xyztoken.connect(owner).transferTokens()).to.be.revertedWith("Time is up");

    });

    // After endSale() function

    it("Check endSale, bools", async function(){
        expect( (await (provider.getBlock())).timestamp).to.greaterThanOrEqual(endTime);
        await xyztoken.connect(owner).endSale();
        expect(await xyztoken.saleOpen()).to.equal(false);
        expect(await xyztoken.transferClosed()).to.equal(true);
        expect(await xyztoken.noMoreSales()).to.equal(true);

    });

    it("Check burn(), saleOpen && transferClosed", async function(){
        expect(await xyztoken.saleOpen()).to.equal(false);
        expect(await xyztoken.transferClosed()).to.equal(true);
    });

    it("Check burn(), _burn", async function(){
        const remainToken = Number(await xyztoken.balanceOf(owner.address));
        await xyztoken.connect(owner).burnRemain();
        expect(remainToken - Number(ethers.utils.parseEther("1"))).to.equal(0);
    });    
});
