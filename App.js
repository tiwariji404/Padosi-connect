import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { colors } from './src/theme';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { AppDataProvider } from './src/contexts/AppDataContext';

// Components
import BottomNav from './src/components/BottomNav';
import SOSAlertModal from './src/components/SOSAlertModal';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import OTPScreen from './src/screens/OTPScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import CityFeedScreen from './src/screens/CityFeedScreen';
import ChatListScreen from './src/screens/ChatListScreen';
import ChatRoomScreen from './src/screens/ChatRoomScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import MarketplaceScreen from './src/screens/MarketplaceScreen';
import BloodDirectoryScreen from './src/screens/BloodDirectoryScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

function MainAppNavigator() {
  const { user } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('home');
  const [routeParams, setRouteParams] = useState({});

  const navigate = (screenName, params = {}) => {
    setRouteParams(params);
    setCurrentScreen(screenName);
  };

  // If user is not logged in, show Auth Flow
  if (!user) {
    if (currentScreen === 'otp') {
      return <OTPScreen routeParams={routeParams} onNavigate={navigate} />;
    }
    if (currentScreen === 'onboarding') {
      return <OnboardingScreen routeParams={routeParams} onNavigate={navigate} />;
    }
    return <LoginScreen onNavigate={navigate} />;
  }

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={navigate} />;
      case 'city':
        return <CityFeedScreen onNavigate={navigate} />;
      case 'chat':
        return <ChatListScreen onNavigate={navigate} />;
      case 'chatroom':
        return <ChatRoomScreen routeParams={routeParams} onNavigate={navigate} />;
      case 'services':
        return <ServicesScreen onNavigate={navigate} />;
      case 'marketplace':
        return <MarketplaceScreen onNavigate={navigate} />;
      case 'blood':
        return <BloodDirectoryScreen onNavigate={navigate} />;
      case 'notifications':
        return <NotificationsScreen onNavigate={navigate} />;
      case 'profile':
        return <ProfileScreen onNavigate={navigate} />;
      default:
        return <HomeScreen onNavigate={navigate} />;
    }
  };

  // Check if current screen is a main tab that shows BottomNav
  const isMainTab = ['home', 'city', 'chat', 'services', 'profile'].includes(currentScreen);

  return (
    <View style={styles.appContainer}>
      <View style={styles.screenContent}>
        {renderScreen()}
      </View>

      {isMainTab && (
        <BottomNav currentScreen={currentScreen} onNavigate={navigate} />
      )}

      {/* Global Emergency Alert Modal */}
      <SOSAlertModal />
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <SafeAreaView style={styles.rootSafeArea}>
          <ExpoStatusBar style="dark" />
          <View style={styles.outerWrapper}>
            <View style={styles.mobileShell}>
              <MainAppNavigator />
            </View>
          </View>
        </SafeAreaView>
      </AppDataProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  rootSafeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  outerWrapper: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#0F172A' : colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileShell: {
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 440 : '100%',
    height: '100%',
    maxHeight: Platform.OS === 'web' ? 920 : '100%',
    backgroundColor: colors.bg,
    overflow: 'hidden',
    borderRadius: Platform.OS === 'web' ? 28 : 0,
    borderWidth: Platform.OS === 'web' ? 1.5 : 0,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: Platform.OS === 'web' ? 0.35 : 0,
    shadowRadius: 28,
    elevation: Platform.OS === 'web' ? 12 : 0,
  },
  appContainer: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  screenContent: {
    flex: 1,
  },
});
