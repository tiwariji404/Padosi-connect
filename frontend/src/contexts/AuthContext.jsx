import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginWithPhone = (phone) => true;

  const verifyOTP = (phone, otp) => {
    if (phone.endsWith('0000')) {
      setUser({
        id: 'u1',
        name: 'Aman Verma',
        phone,
        society: 'Sunrise Apartments',
        city: 'Raipur',
        bio: 'Resident of Sunrise Apartments',
        role: 'member',
        joinedAt: 'Aug 2026'
      });
      return { isNewUser: false };
    }
    return { isNewUser: true };
  };

  const completeOnboarding = (data) => {
    setUser({
      id: 'u_' + Math.random().toString(36).substr(2, 6),
      name: data.name,
      phone: data.phone,
      society: data.society,
      city: data.city,
      bio: data.bio || '',
      role: 'member',
      joinedAt: 'Aug 2026'
    });
  };

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loginWithPhone, verifyOTP, completeOnboarding, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
