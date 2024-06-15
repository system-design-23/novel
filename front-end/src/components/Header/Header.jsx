import { cn } from '../../utils/utils';
import logo from '../../assets/novel.png';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import useAuth from '../../hooks/useAuth';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover/Popover';
import { LogOut, Settings } from 'lucide-react';

const Header = ({ ...props }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header
      {...props}
      className={cn(
        'fixed left-0 top-0 z-[1000] flex h-14 w-full justify-between bg-slate-200 align-middle',
        props ? props.className ?? '' : ''
      )}
    >
      <Link className='mx-4 self-center' to='/home'>
        <img className='h-8' src={logo} alt='logo'></img>
      </Link>
      {user ? (
        <UserSettings className='mx-4 self-center' user={user} isOpen={isOpen} onOpenChange={setIsOpen} />
      ) : (
        <Link className='mx-4 h-fit w-fit self-center' to='/login'>
          <Button className='h-10 rounded-full'>Log In</Button>
        </Link>
      )}
    </header>
  );
};

export function UserSettings({ user, isOpen, onOpenChange, className }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleAdminPageOpen = () => {
    navigate('/admin');
  };

  if (!user) return null;

  return (
    <Popover className='' open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant={isOpen ? 'default' : 'secondary'}
          role='combobox'
          aria-expanded={open}
          className={cn(
            'w-fit justify-center overflow-hidden text-ellipsis text-nowrap text-[0.8rem]',
            className ?? ''
          )}
        >
          {user &&
            user.username?.slice(
              0,
              user.username.indexOf('@') !== -1 ? user.username.indexOf('@') : user.username.length
            )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='end'
        className='z-[1001] mt-0.5 w-[220px] rounded-lg bg-slate-50 p-0 align-middle text-[0.8rem]'
      >
        <div
          className='space-4 m-2 flex h-fit cursor-pointer p-2 px-3 align-middle hover:bg-sky-200/20'
          onClick={() => {
            onOpenChange(false);
            handleAdminPageOpen();
          }}
        >
          <Settings className='mr-2 h-4 w-4 self-center' />
          <p>Manage Content</p>
        </div>
        <div
          className='space-4 m-2 flex h-fit cursor-pointer p-2 px-3 align-middle hover:bg-sky-200/20'
          onClick={() => {
            logout();
            onOpenChange(false);
            navigate('/home');
          }}
        >
          <LogOut className='mr-2 h-4 w-4 self-center' />
          <p>Log Out</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default Header;
