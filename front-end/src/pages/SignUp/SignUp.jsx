import { Button, Input } from '../../components';
import { cn } from '../../utils/utils';
import logo from '../../assets/novel.png';
import { useNavigate } from 'react-router-dom';

const SignUp = ({ props }) => {
  const navigate = useNavigate();
  return (
    <div {...props} className={cn('flex h-screen justify-center', props ? props.className ?? '' : '')}>
      <form className='-mt-20 w-fit self-center'>
        <img className='mx-auto my-6 w-3/5' src={logo} alt='logo'></img>
        <div className='h-fit w-1/3 min-w-[400px] rounded-lg bg-slate-50 p-6 shadow-lg shadow-slate-400/10'>
          <h1 className='text-xl font-bold'>Sign Up</h1>
          <label className='my-2 block text-sm font-medium'>Username</label>
          <Input className='mb-4 w-full' placeholder='Username'></Input>
          <label className='my-2 block text-sm font-medium'>Password</label>
          <Input className='mb-4 w-full' type='password' placeholder='Password'></Input>
          <label className='my-2 block text-sm font-medium'>Password Confirm</label>
          <Input className='mb-4 w-full' type='password' placeholder='Retype password'></Input>
          <Button
            className='mt-4 w-full'
            onClick={() => {
              navigate('/login');
            }}
          >
            Sign Up
          </Button>
          <Button
            variant='secondary'
            className='mt-4 w-full bg-transparent'
            onClick={() => {
              navigate('/login');
            }}
          >
            or Log In
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
