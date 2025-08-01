import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      
      if (token) {
        try {
          const userRes = localStorage.getItem("user");
          if(userRes) {
            setUserData({
              token,
              user: JSON.parse(userRes),
            });
          }
        } catch (error) {
          console.error("Failed to parse user data from localStorage", error);
        }
      }
    };

    checkLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
}; 