import React, {useEffect, useState} from'react';

const AuthContext = React.createContext();

import { auth } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
export function AuthProvider({ children }) {

  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);


  async function initializeUser(user) {
    if (user) {
      setCurrentUser(user);
      setUserLoggedIn(true);
    }
    setLoading(false);
  }

  
  return (
      <AuthContext.Provider value=
      {{currentUser, setCurrentUser, userLoggedIn, setUserLoggedIn}}>
        {children}</AuthContext.Provider>
  )
}


export default AuthContext;