import { useState } from 'react';
import { CourseFilter, ManagedCard } from '@/components/ui/course';
import { BaseLayout } from '@/components/ui/layout';
import MarketplaceHeader from '@/components/ui/marketplaceHeader';
import { Button, Message } from '@/components/ui/common';
import { useAllCourses, useAdmin } from '@/components/hooks/web3';
import { useWeb3 } from '@/components/providers/web3';
import { normalizeOwnedCourse } from '@/utils/normalize';
import Link from 'next/link';

const VerifyInput = ({ onVerified }) => {
  const [email, setEmail] = useState('');

  const handleEmail = () => {
    onVerified(email);
  };

  return (
    <div className='flex mr-2 relative rounded-md'>
      <input
        type='email'
        name='email'
        id='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md mr-2'
        placeholder='0x2341ab...'
      />
      <Button onClick={handleEmail}>Verify</Button>
    </div>
  );
};

const ManagedCourses = () => {
  const [proofedOwnership, setProofedOwnership] = useState({});
  const { web3, contract } = useWeb3();
  const { admin } = useAdmin({ redirectTo: '/marketplace' });
  const { managedCourses } = useAllCourses(admin);
  const [searchCourse, setSearchCourse] = useState();
  const [filterCourse, setFilterCourse] = useState('all');

  const verifyCourse = (email, { hash, proof }) => {
    const emailHash = web3.utils.sha3(email);
    const proofToCheck = web3.utils.soliditySha3(
      { type: 'bytes32', value: emailHash },
      { type: 'bytes32', value: hash }
    );

    // we save the proofed ownership in a state object
    proofToCheck === proof
      ? setProofedOwnership({
          ...proofedOwnership,
          [hash]: true,
        })
      : setProofedOwnership({
          ...proofedOwnership,
          [hash]: false,
        });
  };

  const changeCourseState = async (courseHash, method) => {
    try {
      await contract.methods[method](courseHash).send({
        from: admin.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const activateCourse = async (courseHash) => {
    changeCourseState(courseHash, 'activateCourse');
  };

  const deactivateCourse = async (courseHash) => {
    changeCourseState(courseHash, 'deactivateCourse');
  };

  const handleOnSearch = async (courseHash) => {
    const isValidHex = web3.utils.isHexStrict(courseHash);
    const hasValidLength = courseHash && courseHash.length === 66;

    if (isValidHex && hasValidLength) {
      try {
        const course = await contract.methods
          .getCourseByHash(courseHash)
          .call({ from: admin.data });

        if (course.owner !== 0x0000000000000000000000000000000000000000) {
          const normalize = normalizeOwnedCourse(web3)(
            { hash: courseHash },
            course
          );

          setSearchCourse(normalize);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }

    setSearchCourse(null);
  };

  const handleOnFilter = (status) => {
    setSearchCourse(null);
    setFilterCourse(status);
  };

  const card = (course, isSearched) => (
    <ManagedCard
      key={course.ownedCourseId}
      course={course}
      isSearched={isSearched}
    >
      <VerifyInput
        onVerified={(email) =>
          verifyCourse(email, { hash: course.hash, proof: course.proof })
        }
      />
      {proofedOwnership[course.hash] && (
        <div className='mt-2'>
          <Message>Verified!</Message>
        </div>
      )}
      {proofedOwnership[course.hash] === false && (
        <div className='mt-2'>
          <Message type='danger'>Wrong Proof!</Message>
        </div>
      )}
      {course.state === 'PURCHASED' && (
        <div className='mt-2'>
          <Button
            variant='success'
            className='mr-2'
            onClick={() => activateCourse(course.hash)}
          >
            Activate
          </Button>
          <Button
            variant='danger'
            onClick={() => deactivateCourse(course.hash)}
          >
            Deactivate
          </Button>{' '}
        </div>
      )}
    </ManagedCard>
  );

  const filteredCourses = managedCourses?.data
    ?.filter((course) => {
      if (filterCourse === 'all') return true;
      return course.state === filterCourse.toUpperCase();
    })
    .map((course) => card(course));

  if (!admin.isAdmin) return null;

  return (
    <>
      <MarketplaceHeader />
      <CourseFilter onSearch={handleOnSearch} onFilter={handleOnFilter} />
      <section className='grid grid-cols-1'>
        {searchCourse && (
          <>
            <h1 className='text-2xl font-bold p-5'>Search</h1>
            {card(searchCourse, true)}
          </>
        )}
        <h1 className='text-2xl font-bold p-5'>All Courses</h1>
        {filteredCourses}
        {!filteredCourses?.length && (
          <Message type='warning' className='mb-4'>
            No courses to display. You can buy one{' '}
            <Link href='/marketplace' className='text-blue-500'>
              here
            </Link>
          </Message>
        )}
      </section>
    </>
  );
};

ManagedCourses.Layout = BaseLayout;

export default ManagedCourses;
