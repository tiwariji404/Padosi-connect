import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Initial demo user pre-configured for instant preview, can be logged out anytime
  const [user, setUser] = useState({
    id: 'u1',
    name: 'Aman Verma',
    phone: '9876543210',
    society: 'Sunrise Apartments',
    city: 'Raipur',
    bio: 'Resident of Tower B-402, Sunrise Apartments.',
    role: 'member',
    flat: 'B-402',
    joinedAt: 'Aug 2026'
  });

  const loginWithPhone = (phone) => true;

  const verifyOTP = (phone, otp) => {
    if (phone.endsWith('0000') || otp === '0000') {
      const existingUser = {
        id: 'u1',
        name: 'Aman Verma',
        phone,
        society: 'Sunrise Apartments',
        city: 'Raipur',
        bio: 'Resident of Tower B-402, Sunrise Apartments.',
        role: 'member',
        flat: 'B-402',
        joinedAt: 'Aug 2026'
      };
      setUser(existingUser);
      return { isNewUser: false, user: existingUser };
    }
    return { isNewUser: true };
  };

  const completeOnboarding = (data) => {
    const newUser = {
      id: 'u_' + Math.random().toString(36).substring(2, 8),
      name: data.name,
      phone: data.phone,
      society: data.society,
      city: data.city,
      flat: data.flat || 'A-101',
      bio: data.bio || `Resident of ${data.society}`,
      role: 'member',
      joinedAt: 'Today'
    };
    setUser(newUser);
    return newUser;
  };

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginWithPhone, verifyOTP, completeOnboarding, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
