import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { useUserSet, useUserValue } from './contexts/userContext';

import Navigation from './modules/public/components/Navigation';
import SoftwareCompany from './modules/public/components/SoftwareCompany';
import HomePage from './modules/public/components/HomePage';
import Notification from './modules/public/components/Notification';
import SignIn from './modules/usersAndAuthentications/components/Login';
import UserManagement from './modules/usersAndAuthentications/components/UserManagement';

function App() {

  // User management
  const setUser = useUserSet();
  const user = useUserValue();

  useEffect(() => {
    const signedUser = window.localStorage.getItem('QualityHub_SignedUser');
    signedUser && setUser(JSON.parse(signedUser));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <div style={{ width: '98vw', minHeight: '60vh', margin: 10 }}>
      <Router>
        <Navigation signedUser={user} />
        <Notification  />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/user_management' element={<UserManagement />} />
        </Routes>
      </Router>
      <footer>
        <SoftwareCompany />
      </footer>
    </div>
  );
}

export default App;
