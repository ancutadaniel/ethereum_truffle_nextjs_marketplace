import { Button, Loader } from '@/components/ui/common';

const CardFooter = ({
  course,
  owned,
  onPurchase,
  onRepurchase,
  ownedCourses,
  isConnecting,
  inBuyProgress,
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
    return (
      <div className='flex justify-center mt-4'>
        <Button className='w-full' variant='white' size='sm' disabled>
          Initializing...
        </Button>
      </div>
    );
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
              disabled={!hasConnectedWallet || inBuyProgress}
              size='sm'
            >
              {inBuyProgress ? (
                <div className='flex justify-center'>
                  <Loader size='sm' />
                  <div className='ml-2'>In Progress</div>
                </div>
              ) : (
                <div>Fund to activate</div>
              )}
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
        disabled={!hasConnectedWallet || inBuyProgress}
      >
        {inBuyProgress ? (
          <div className='flex justify-center'>
            <Loader size='sm' />
            <div className='ml-2'>In Progress</div>
          </div>
        ) : (
          <div>Purchase</div>
        )}
      </Button>
    </div>
  );
};
export default CardFooter;
