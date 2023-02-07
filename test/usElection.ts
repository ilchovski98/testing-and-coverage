import { USElection__factory } from "./../typechain-types/factories/Election.sol/USElection__factory";
import { USElection } from "./../typechain-types/Election.sol/USElection";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("USElection", function () {
  let usElectionFactory: USElection__factory;
  let usElection: USElection;

  before(async () => {
    usElectionFactory = await ethers.getContractFactory("USElection");

    usElection = await usElectionFactory.deploy();

    await usElection.deployed();
  });

  it("Should return the current leader before submit any election results", async function () {
    expect(await usElection.currentLeader()).to.equal(0); // NOBODY
  });

  it("Should return the election status", async function () {
    expect(await usElection.electionEnded()).to.equal(false); // Not Ended
  });

  it("Should submit state results and get current leader", async function () {
    const stateResults: USElection.StateResultStruct = {
      name: "California",
      votesBiden: ethers.BigNumber.from(1000),
      votesTrump: ethers.BigNumber.from(900),
      stateSeats: 32
    };

    const submitStateResultsTx = await usElection.submitStateResult(
      stateResults
    );

    await submitStateResultsTx.wait();

    expect(await usElection.currentLeader()).to.equal(1); // BIDEN
  });

  it("Should throw when try to submit already submitted state results", async function () {
    const stateResults: USElection.StateResultStruct = {
      name: "California",
      votesBiden: ethers.BigNumber.from(1000),
      votesTrump: ethers.BigNumber.from(900),
      stateSeats: 32
    };

    await expect(usElection.submitStateResult(stateResults)).to.be.revertedWith(
      "This state result was already submitted!"
    );
  });

  it("Should submit state results and get current leader", async function () {
    const stateResults: USElection.StateResultStruct = {
      name: "Ohaio",
      votesBiden: ethers.BigNumber.from(800),
      votesTrump: ethers.BigNumber.from(1200),
      stateSeats: 33
    };

    const submitStateResultsTx = await usElection.submitStateResult(
      stateResults
    );

    await submitStateResultsTx.wait();

    expect(await usElection.currentLeader()).to.equal(2); // TRUMP
  });

  it("Should throw when trying to submit state with 0 seats", async function () {
    const stateResults: USElection.StateResultStruct = {
      name: "Florida",
      votesBiden: ethers.BigNumber.from(800),
      votesTrump: ethers.BigNumber.from(1200),
      stateSeats: 0
    };

    await expect(usElection.submitStateResult(stateResults)).to.be.revertedWith(
      "States must have at least 1 seat"
    );
  });

  it("Should throw when trying to submit state result with a tie", async function () {
    const stateResults: USElection.StateResultStruct = {
      name: "Alaska",
      votesBiden: ethers.BigNumber.from(1200),
      votesTrump: ethers.BigNumber.from(1200),
      stateSeats: 32
    };

    await expect(usElection.submitStateResult(stateResults)).to.be.revertedWith(
      "There cannot be a tie"
    );
  });

  it("Should end the elections, get the leader and election status", async function () {
    const endElectionTx = await usElection.endElection();

    await endElectionTx.wait();

    expect(await usElection.currentLeader()).to.equal(2); // TRUMP

    expect(await usElection.electionEnded()).to.equal(true); // Ended
  });

  //TODO: ADD YOUR TESTS
  it("Should throw when trying to submit state results after election have ended", async function () {
    const stateResults: USElection.StateResultStruct = {
      name: "Texas",
      votesBiden: ethers.BigNumber.from(800),
      votesTrump: ethers.BigNumber.from(1200),
      stateSeats: 33
    };

    await expect(usElection.submitStateResult(stateResults)).to.be.revertedWith(
      "The election has ended already"
    );
  });
});
