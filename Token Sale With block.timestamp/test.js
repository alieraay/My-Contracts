const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const provider = ethers.provider;

describe("TokenXYZ Contract", function () {
    
    let owner, user1, user2;
    let XYZToken, xyztoken;
    let startTime, endTime, saleDuration, transferDuration;

    function ethToNum(val) {
        return Number(ethers.utils.formatEther(val));
    }

    before(async function() {
        [owner, user1, user2] = await ethers.getSigners();

        XYZToken = await ethers.getContractFactory("TokenXYZ");
        xyztoken  = await XYZToken.connect(owner).deploy();

        xyztoken.connect(owner).transfer(user1.address, ethers.utils.parseUnits("100",18));
        xyztoken.connect(owner).transfer(user2.address, ethers.utils.parseEther("50"));

    });

    it("Deploys the contract", async function() {
        expect(xyztoken.address).to.not.be.undefined;
    });

    it("Check balances", async function() {
        expect(await xyztoken.balanceOf(owner.address)).to.equal(0)
    });

    it("Check saleOpen constructor ", async function() {
        expect(await xyztoken.saleOpen()).to.equal(false)
    });

    it("Check fundAddress constructor ", async function() {
        expect(await xyztoken.fundAddress()).to.equal("0xdD870fA1b7C4700F2BD7f44238821C26f7392148")
    });
    
    it("Check transferClosed status constructor ", async function() {
        expect(await xyztoken.transferClosed()).to.equal(true)
    });

    it("Check noMoreSales after deployment", async function() {
        expect(await xyztoken.noMoreSales()).to.equal(false)
    });

    it("Starts sale", async function() {
        await expect(xyztoken.connect(user1).startSale()).to.reverted;
        await xyztoken.connect(owner).startSale();
        expect(await xyztoken.saleOpen()).to.equal(true);
    });
    
    it("Start time", async function(){
        expect(await xyztoken.startTime()).to.equal((await provider.getBlock()).timestamp);
    });

    it("Check endTime", async function(){
        startTime = await xyztoken.startTime();
        saleDuration = await xyztoken.saleDuration();
        expectedEndtime = Number(startTime) + Number(saleDuration);
        expect(await xyztoken.endTime()).to.equal(expectedEndtime);
    });

    it("Check startTransfer before transfer time", async function(){
        expect(await xyztoken.saleOpen()).to.equal(true);     
        await expect(xyztoken.connect(owner).startTransfer()).to.be.reverted;
    });

    it("Check startTransfer exact time", async function(){
        
        await network.provider.send("evm_setNextBlockTimestamp", [await xyztoken.endTime()-await xyztoken.transferDuration()+1]);
        await xyztoken.connect(owner).startTransfer();
        expect(await xyztoken.transferClosed()).to.equal(false);
    });

    it("Check endSale, saleOpen", async function(){
        expect(await xyztoken.saleOpen()).to.equal(true);
    });

    it("Check endSale, time control", async function(){
        //burası hatalı tekrar bak
        console.log(" testin başlangıç zamanı ",(await provider.getBlock()).timestamp);
        console.log(" endSale'ın gerçekleşmesi için gereken min timestamp",Number(await xyztoken.endTime()));
        await ethers.provider.send("evm_mine", [Number(await xyztoken.endTime())-1]);
        console.log(" timestamp endtime -1 e ayarlandı, endSale hata vermeli",(await provider.getBlock()).timestamp);
        await xyztoken.connect(owner).endSale();
        console.log(" endSale devam ettikten sonraki timestamp ",(await provider.getBlock()).timestamp);

        // await ethers.provider.send("evm_mine", [Number(await xyztoken.endTime())]);
        // expect((await provider.getBlock()).timestamp).to.equal(await xyztoken.endTime());

    });
    
    it("Check endSale, bools", async function(){
        expect(await xyztoken.saleOpen()).to.equal(false);
        expect(await xyztoken.transferClosed()).to.equal(true);
        expect(await xyztoken.noMoreSales()).to.equal(true);

    });

    it("Check buyTokens(), requires", async function(){
        //timestamp boku var o yüzden hata alıyoruz düzgün ayarlamayı öğrenince burası da çalışacak
        expect(await xyztoken.saleOpen()).to.equal(true);
        expect(await xyztoken.remainSupply()).greaterThan(0);


    });

    // it("Check buyTokens(), mint", async function(){

    // });

    // it("Check buyTokens(), remainSupply,reservationCount", async function(){

    // });

    // it("Check buyTokens(), transfer ether to fundAddress", async function(){

    // });

    // it("Check buyTokens() time, transferTokens()", async function(){

    // });

    // it("Check transferTokens(), transferClosed", async function(){

    // });
    
    // it("Check transferTokens(), reservationCount", async function(){

    // });

    // it("Check transferTokens(), _transfer successful", async function(){

    // });

    // it("Check transferTokens(), reservationCount is 0?", async function(){

    // });

    // it("Check burn(), saleOpen && transferClosed", async function(){

    // });

    // it("Check burn(), _burn", async function(){

    // });


    
}) 
