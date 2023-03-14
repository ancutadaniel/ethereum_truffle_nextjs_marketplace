const Web3 = require('web3');
const { catchRevert } = require('./utils/exception');

const CourseMarketplace = artifacts.require('CourseMarketplace');

const getBalance = async (address) => await web3.eth.getBalance(address);
const toBN = (number) => web3.utils.toBN(number);

const getGasCost = async (txObj) => {
  // Calculate the transaction fee
  const gasUsed = toBN(txObj.receipt.gasUsed);
  // Get the gas price from the transaction
  const tx = await web3.eth.getTransaction(txObj.tx);
  // Calculate the transaction fee
  const gasPrice = toBN(tx.gasPrice);
  // Calculate the total transaction fee
  return gasUsed.mul(gasPrice);
};

contract('CourseMarketplace', (accounts) => {
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
  const courseId = '0x00000000000000000000000000003130';
  const proof =
    '0x0000000000000000000000000000313000000000000000000000000000003130';
  const courseId2 = '0x00000000000000000000000000002130';
  const proof2 =
    '0x0000000000000000000000000000213000000000000000000000000000002130';
  const coursePrice = '90000000';

  let instance;
  let contractOwner = accounts[0];
  let buyer = accounts[1];
  let newOwner = accounts[2];
  let courseHash;

  before(async () => {
    instance = await CourseMarketplace.deployed();
  });

  describe('Purchase new course', async () => {
    before(async () => {
      await instance.purchaseCourse(courseId, proof, {
        from: buyer,
        value: coursePrice,
      });
    });

    it('should be deployed successfully', async () => {
      const address = await instance.address;
      assert.notEqual(address, null);
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, undefined);
    });

    it('should get the course hash by index', async () => {
      const index = 0;
      courseHash = await instance.getCourseByIdx(index);
      const expectedCourseHash = web3.utils.soliditySha3(
        { t: 'bytes16', v: courseId },
        { t: 'address', v: buyer }
      );
      assert.equal(
        courseHash,
        expectedCourseHash,
        'Course hash is not correct'
      );
    });

    it('should not NOT allowed to buy already own course', async () => {
      await catchRevert(
        instance.purchaseCourse(courseId, proof, {
          from: buyer,
          value: coursePrice,
        })
      );
    });

    it('should match the course data purchased by buyer', async () => {
      const expectedIndex = 0;
      const expectedState = 0;
      const course = await instance.getCourseByHash(courseHash);

      assert.equal(expectedIndex, course.id, 'Course index should be 0');
      assert.equal(expectedState, course.state, 'State should be 0');
      assert.equal(buyer, course.owner, 'Owner is not correct');
      assert.equal(
        coursePrice,
        course.price,
        `Course price is not correct, it should be ${coursePrice}`
      );
      assert.equal(proof, course.proof, 'Proof is not correct');
    });
  });

  describe('Activate the purchase course', async () => {
    before(async () => {
      await instance.activateCourse(courseHash, { from: contractOwner });
    });

    it('should activate the course', async () => {
      const course = await instance.getCourseByHash(courseHash);
      const expectedState = 1;
      assert.equal(expectedState, course.state, 'State should be 1');
    });

    it('should not activate the course if not owner', async () => {
      await catchRevert(instance.activateCourse(courseHash, { from: buyer }));
    });
  });

  describe('Transfer ownership', async () => {
    let owner;

    before(async () => {
      owner = await instance.getContractOwner();
    });

    it('should return the owner', async () => {
      assert.equal(owner, contractOwner, 'Owner is not correct');
    });

    it('should transfer the ownership', async () => {
      await instance.transferOwnership(newOwner, {
        from: owner,
      });
      owner = await instance.getContractOwner();
      assert.equal(newOwner, owner, 'Owner is not correct');
    });

    it('should not transfer the ownership if not owner', async () => {
      await catchRevert(
        instance.transferOwnership(newOwner, {
          from: buyer,
        })
      );
    });

    it('should transfer the ownership back to initial owner', async () => {
      await instance.transferOwnership(contractOwner, { from: newOwner });
      owner = await instance.getContractOwner();
      assert.equal(contractOwner, owner, 'Owner is not correct');
    });
  });

  describe('Deactivate the course', async () => {
    let courseHash2;

    before(async () => {
      await instance.purchaseCourse(courseId2, proof2, {
        from: buyer,
        value: coursePrice,
      });
      courseHash2 = await instance.getCourseByIdx(1);
    });

    it('should not be able to deactivate the course if not owner', async () => {
      await catchRevert(
        instance.deactivateCourse(courseHash2, { from: buyer })
      );
    });

    it('should have a status of deactivated and price 0', async () => {
      const beforeTxOwnerBalance = await getBalance(contractOwner);

      const result = await instance.deactivateCourse(courseHash2, {
        from: contractOwner,
      });
      const afterTxOwnerBalance = await getBalance(contractOwner);

      const txFee = await getGasCost(result);

      const course = await instance.getCourseByHash(courseHash2);
      const expectedState = 2;
      const expectedPrice = 0;

      assert.equal(expectedState, course.state, 'State should be 2');
      assert.equal(expectedPrice, course.price, 'Price should be 0');

      assert.equal(
        toBN(beforeTxOwnerBalance).sub(txFee).toString(),
        afterTxOwnerBalance,
        'Contract owner balance is not correct'
      );
    });

    it('should not be able to activate the course if already deactivated', async () => {
      await catchRevert(
        instance.activateCourse(courseHash2, { from: contractOwner })
      );
    });
  });

  describe('Repurchase course', async () => {
    let courseHash2;
    before(async () => {
      courseHash2 = await instance.getCourseByIdx(1);
    });

    it('should NOT repurchase when the course does not exist', async () => {
      const badHash =
        '0x613b590133514e9d25a2c1ce384159f96f154135bf8704ce9e525824c58d376a';
      await catchRevert(
        instance.repurchaseCourse(badHash, {
          from: buyer,
          value: coursePrice,
        })
      );
    });

    it('should NOT repurchase with no course owner', async () => {
      await catchRevert(
        instance.repurchaseCourse(courseHash2, {
          from: accounts[3],
          value: coursePrice,
        })
      );
    });

    it("should be able to repurchase the course if it's original buyer", async () => {
      const beforeTxBalance = await getBalance(buyer);
      const beforeTxContractBalance = await getBalance(instance.address);
      const result = await instance.repurchaseCourse(courseHash2, {
        from: buyer,
        value: coursePrice,
      });
      const txFee = await getGasCost(result);

      const course = await instance.getCourseByHash(courseHash2);
      const afterTxBalance = await getBalance(buyer);
      const afterTxContractBalance = await getBalance(instance.address);
      const expectedState = 0;

      assert.equal(
        toBN(beforeTxBalance).sub(toBN(coursePrice)).sub(txFee).toString(),
        afterTxBalance,
        'Balance is not correct'
      );
      assert.equal(
        toBN(beforeTxContractBalance).add(toBN(coursePrice)).toString(),
        afterTxContractBalance,
        'Contract balance is not correct'
      );

      assert.equal(buyer, course.owner, 'Owner is not correct');
      assert.equal(expectedState, course.state, 'State should be 0');
    });

    it('should NOT repurchase if the course is purchased', async () => {
      await catchRevert(
        instance.repurchaseCourse(courseHash2, {
          from: buyer,
          value: coursePrice,
        })
      );
    });
  });

  describe('Add funds to contract', async () => {
    it('should have funds', async () => {
      const contractBalance = await getBalance(instance.address);

      await web3.eth.sendTransaction({
        from: buyer,
        to: instance.address,
        value: web3.utils.toWei('1', 'ether'),
      });

      const newContractBalance = await getBalance(instance.address);

      assert.equal(
        toBN(contractBalance)
          .add(toBN(web3.utils.toWei('1', 'ether')))
          .toString(),
        newContractBalance,
        'Contract balance is not correct'
      );
    });
  });

  describe('Normal Withdraw funds', async () => {
    const funds = web3.utils.toWei('1', 'ether');
    const overLimitFunds = web3.utils.toWei('999', 'ether');

    before(async () => {
      await web3.eth.sendTransaction({
        from: buyer,
        to: instance.address,
        value: funds,
      });
    });

    it('should NOT withdraw funds if not owner', async () => {
      await catchRevert(
        instance.withdraw(funds, {
          from: buyer,
        })
      );
    });

    it('should fail when withdrawing over limit', async () => {
      const owner = await instance.getContractOwner();
      await catchRevert(
        instance.withdraw(overLimitFunds, {
          from: owner,
        })
      );
    });

    it('should withdraw funds', async () => {
      const beforeTxOwnerBalance = await getBalance(contractOwner);
      const beforeTxContractBalance = await getBalance(instance.address);

      const result = await instance.withdraw(funds, {
        from: contractOwner,
      });

      const txFee = await getGasCost(result);

      const afterTxOwnerBalance = await getBalance(contractOwner);
      const afterTxContractBalance = await getBalance(instance.address);

      assert.equal(
        toBN(beforeTxOwnerBalance).add(toBN(funds)).sub(toBN(txFee)).toString(),
        afterTxOwnerBalance,
        'Contract owner balance is not correct'
      );

      assert.equal(
        toBN(beforeTxContractBalance).sub(toBN(funds)).toString(),
        afterTxContractBalance,
        'Contract balance is not correct'
      );
    });
  });

  describe('Emergency Withdraw funds', async () => {
    let owner;

    before(async () => {
      owner = await instance.getContractOwner();
    });

    // cleanup
    after(async () => {
      await instance.startContract({
        from: owner,
      });
    });

    it('should NOT emergency withdraw funds if not owner', async () => {
      await catchRevert(
        instance.emergencyWithdraw({
          from: buyer,
        })
      );
    });

    it('should have +contract funds on contract owner', async () => {
      await instance.stopContract({
        from: owner,
      });

      const beforeTxOwnerBalance = await getBalance(contractOwner);
      const beforeTxContractBalance = await getBalance(instance.address);

      const result = await instance.emergencyWithdraw({
        from: owner,
      });

      const txFee = await getGasCost(result);

      const afterTxOwnerBalance = await getBalance(contractOwner);

      assert.equal(
        toBN(beforeTxOwnerBalance)
          .add(toBN(beforeTxContractBalance))
          .sub(txFee)
          .toString(),
        afterTxOwnerBalance,
        'Contract owner balance is not correct'
      );
    });

    it('should have contract balance of 0', async () => {
      const contractBalance = await getBalance(instance.address);
      assert.equal(contractBalance, 0, 'Contract balance is not correct');
    });
  });

  describe('Self destruct', async () => {
    let owner;

    before(async () => {
      owner = await instance.getContractOwner();
    });

    it('should NOT self destruct if not owner', async () => {
      await catchRevert(
        instance.emergencyWithdraw({
          from: buyer,
        })
      );
    });

    it('should have +contract funds on contract owner', async () => {
      await instance.stopContract({
        from: owner,
      });

      const beforeTxOwnerBalance = await getBalance(contractOwner);
      const beforeTxContractBalance = await getBalance(instance.address);

      const result = await instance.selfDestruct({
        from: owner,
      });

      const txFee = await getGasCost(result);

      const afterTxOwnerBalance = await getBalance(contractOwner);

      assert.equal(
        toBN(beforeTxOwnerBalance)
          .add(toBN(beforeTxContractBalance))
          .sub(txFee)
          .toString(),
        afterTxOwnerBalance,
        'Contract owner balance is not correct'
      );
    });

    it('should have contract balance of 0', async () => {
      const contractBalance = await getBalance(instance.address);
      assert.equal(contractBalance, 0, 'Contract balance is not correct');
    });

    it('should have contract code of 0', async () => {
      const code = await web3.eth.getCode(instance.address);
      assert.equal(code, '0x', 'Contract code is not correct');
    });
  });
});
