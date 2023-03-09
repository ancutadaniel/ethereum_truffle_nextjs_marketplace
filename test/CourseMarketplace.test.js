const Web3 = require('web3');
const { catchRevert } = require('./utils/exception');

const CourseMarketplace = artifacts.require('CourseMarketplace');

contract('CourseMarketplace', (accounts) => {
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
  const courseId = '0x00000000000000000000000000003130';
  const proof =
    '0x0000000000000000000000000000313000000000000000000000000000003130';
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
});
