import { cn } from '../../utils/utils';
import logo from '../../assets/novel.png';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';

const Header = ({ ...props }) => {
  return (
    <header
      {...props}
      className={cn('fixed left-0 top-0 z-[1000] flex h-14 w-full justify-between bg-slate-200', props.className ?? '')}
    >
      <Link className='mx-4 self-center' to='/home'>
        <img className='h-8' src={logo} alt='logo'></img>
      </Link>
      <Button className='mx-4 h-10 self-center rounded-full'>Log In</Button>
    </header>
  );
};

export default Header;
