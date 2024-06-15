import { Outlet } from 'react-router-dom';
import { Header } from '../../components';

const ConfigLayout = () => {
  return (
    <>
      <Header></Header>
      <div className='flex min-h-screen flex-col pt-14'>
        <Outlet></Outlet>
      </div>
    </>
  );
};

export default ConfigLayout;
