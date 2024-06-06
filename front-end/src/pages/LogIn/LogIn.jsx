import { Button, Input } from '../../components';
import { cn } from '../../utils/utils';
import logo from '../../assets/novel.png';
import { Navigate, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const LogIn = ({ props }) => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  if (user) {
    return <Navigate to='/home' />;
  }
  const handleLogIn = async (e) => {
    e.preventDefault();
    const result = await login({ username: e.target[0].value, password: e.target[1].value });
    if (result) {
      navigate('/home');
    }
  };

  return (
    <div {...props} className={cn('flex h-screen justify-center', props ? props.className ?? '' : '')}>
      <form className='-mt-16 w-fit self-center' onSubmit={handleLogIn}>
        <img className='mx-auto my-6 w-3/5' src={logo} alt='logo'></img>
        <div className='h-fit w-1/3 min-w-[400px] rounded-lg bg-slate-50 p-6 shadow-lg shadow-slate-400/10'>
          <h1 className='text-xl font-bold'>Log In</h1>
          <label className='my-2 block text-sm font-medium'>Username</label>
          <Input className='mb-4 w-full' placeholder='Username'></Input>
          <label className='my-2 block text-sm font-medium'>Password</label>
          <Input className='mb-4 w-full' type='password' placeholder='Password'></Input>
          <Button type='submit' className='mt-4 w-full'>
            Log In
          </Button>
          <Button
            variant='secondary'
            className='mt-4 w-full bg-transparent'
            onClick={() => {
              navigate('/signup');
            }}
          >
            or Sign Up
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LogIn;
