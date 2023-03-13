import { Button, Loader } from '@/components/ui/common';

const CardFooter = ({
  course,
  owned,
  onPurchase,
  onRepurchase,
  ownedCourses,
  isConnecting,
  requireInstall,
  hasConnectedWallet,
}) => {
  if (requireInstall) {
    return (
      <div className='flex justify-center mt-4'>
        <Button className='w-full' variant='secondary' disabled>
          Install Wallet
        </Button>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className='flex justify-center mt-4'>
        <Button className='w-full' variant='secondary' disabled>
          <Loader size='sm' />
        </Button>
      </div>
    );
  }

  if (!ownedCourses.hasInitialized) {
    return <div style={{ height: '42px' }}></div>;
  }

  if (owned) {
    return (
      <div className='flex justify-center flex-col mt-2'>
        <div className='flex justify-center gap-1'>
          <Button
            className='w-full'
            variant='white'
            size='sm'
            onClick={() => alert('You already own this course')}
          >
            Owned &#10004;
          </Button>
          {owned.state === 'DEACTIVATED' && (
            <Button
              className='w-full'
              variant='secondary'
              onClick={() => onRepurchase(course)}
              disabled={!hasConnectedWallet}
              size='sm'
            >
              Fund to activate
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='flex justify-center mt-4'>
      <Button
        className='w-full'
        variant='secondary'
        onClick={() => onPurchase(course)}
        disabled={!hasConnectedWallet}
      >
        Purchase
      </Button>
    </div>
  );
};
export default CardFooter;
