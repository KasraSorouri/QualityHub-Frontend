import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';

import { useUserSet, useUserValue } from './contexts/userContext';
import SoftwareCompany from './modules/public/components/SoftwareCompany';
import Navigation from './modules/public/components/Navigation';
import SignIn from './modules/usersAndAuthentications/components/Login';
import HomePage from './modules/public/components/HomePage';
import Notification from './modules/public/components/Notification';



function App() {

  // User management
  const setUser = useUserSet();
  const user = useUserValue();

  useEffect(() => {
    const signedUser = window.localStorage.getItem('QualityHub_SignedUser');
    signedUser && setUser(JSON.parse(signedUser));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  console.log('app user ->',user);

  return (

    <div>
      <Router>
        <Navigation signedUser={user} />
        <Notification  />

        {/*}
  */}
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/signin' element={<SignIn />} />
          {/*
            <Route path='/Config' element={<ConfigurationPage user={user} />} />
            <Route path='/userManagement'element={<UserManagement />} />
            <Route path='/bomManagement' element={<BomManagement />} />
*/}
        </Routes>
      </Router>
      <footer>
        <SoftwareCompany />
      </footer>
    </div>
  );

}

export default App;
