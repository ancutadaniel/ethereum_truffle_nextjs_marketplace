import { useState } from 'react';
import { CourseFilter, ManagedCard } from '@/components/ui/course';
import { BaseLayout } from '@/components/ui/layout';
import MarketplaceHeader from '@/components/ui/marketplaceHeader';
import { Button, Message } from '@/components/ui/common';
import { useAllCourses, useAdmin } from '@/components/hooks/web3';
import { useWeb3 } from '@/components/providers/web3';

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

  if (!admin.isAdmin) return null;

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

  return (
    <>
      <MarketplaceHeader />
      <CourseFilter />
      <section className='grid grid-cols-1'>
        {managedCourses.data?.map((course) => (
          <ManagedCard key={course.ownedCourseId} course={course}>
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
              <>
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
              </>
            )}
          </ManagedCard>
        ))}
      </section>
    </>
  );
};

ManagedCourses.Layout = BaseLayout;

export default ManagedCourses;
