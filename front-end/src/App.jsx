import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';

const CheckList = lazy(() => import('./pages/CheckList/CheckList'));
const LogIn = lazy(() => import('./pages/LogIn/LogIn'));
const SignUp = lazy(() => import('./pages/SignUp/SignUp'));
const Homepage = lazy(() => import('./pages/Homepage/Homepage'));
const NovelDetail = lazy(() => import('./pages/NovelDetail/NovelDetail'));
const NovelReader = lazy(() => import('./pages/NovelReader/NovelReader'));
const ConfigLayout = lazy(() => import('./pages//ConfigLayout/ConfigLayout'));
const ManageContent = lazy(() => import('./pages/ManageContent/ManageContent'));

function App() {
  return (
    <>
      <Suspense
        fallback={
          <div className='h-screen bg-slate-100'>
            <div className='flex h-full w-full justify-center'>
              <LoadingSpinner className='self-center fill-primary/50'></LoadingSpinner>
            </div>
          </div>
        }
      >
        <Routes>
          <Route path='/login' element={<LogIn />}></Route>
          <Route path='/signup' element={<SignUp />}></Route>
          <Route element={<ConfigLayout></ConfigLayout>}>
            <Route path='/' element={<Navigate to='/home' replace />}></Route>
            <Route path='/home' element={<Homepage />}></Route>
            <Route path='/:novelId/detail' element={<NovelDetail />}></Route>
            <Route path='/admin' element={<ManageContent />}></Route>
            <Route path='/todos' element={<CheckList />}></Route>
          </Route>
          <Route path='/:novelId/read/:chapterId' element={<NovelReader />}></Route>
        </Routes>
      </Suspense>
    </>
  );
}
export default App;
