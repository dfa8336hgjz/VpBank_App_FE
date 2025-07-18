import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { getUserInfoApi, logoutApi } from '../../services/api';

interface UserInfo {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  roles: Array<{
    name: string;
    description: string;
    permissions: string[];
  }>;
}

interface ProfileState {
  userInfo: UserInfo | null;
  loading: boolean;
}

export default class ProfileScreen extends React.Component<{}, ProfileState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      userInfo: null,
      loading: true
    };
  }

  async componentDidMount() {
    try {
      const userInfo = await getUserInfoApi();
      this.setState({ userInfo, loading: false });
    } catch (error) {
      console.error('Error fetching user info:', error);
      Alert.alert('Error', 'Failed to load user information');
      this.setState({ loading: false });
    }
  }

  render() {
    const { userInfo, loading } = this.state;

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        
        {userInfo && (
          <View style={styles.profileCard}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImageWrapper}>
                <Image 
                  source={require('../../assets/images/icon.png')} 
                  style={styles.profileImage}
                />
              </View>
              <View style={styles.profileBasicInfo}>
                <Text style={styles.profileName}>{userInfo.username}</Text>
                <Text style={styles.profileEmail}>{userInfo.email}</Text>
              </View>
            </View>
            
            <View style={styles.profileDetailsContainer}>
              <View style={styles.profileInfo}>
                <FontAwesome name="user" size={16} color="#666" />
                <Text style={styles.label}>Username:</Text>
                <Text style={styles.value}>{userInfo.username}</Text>
              </View>
              
              <View style={styles.profileInfo}>
                <FontAwesome name="envelope" size={16} color="#666" />
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{userInfo.email}</Text>
              </View>
              
              <View style={styles.profileInfo}>
                <FontAwesome name="check-circle" size={16} color={userInfo.emailVerified ? "#10B981" : "#EF4444"} />
                <Text style={styles.label}>Email Verified:</Text>
                <Text style={[styles.value, { color: userInfo.emailVerified ? '#10B981' : '#EF4444' }]}>
                  {userInfo.emailVerified ? 'Yes' : 'No'}
                </Text>
              </View>
              
              <View style={styles.profileInfo}>
                <FontAwesome name="shield" size={16} color="#666" />
                <Text style={styles.label}>Role:</Text>
                <Text style={styles.value}>{userInfo.roles[0]?.name || 'No role'}</Text>
              </View>
            </View>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={async () => {
            await logoutApi()
            router.replace('/login')
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.light.text,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 30,
    color: Colors.light.text,
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  profileImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileBasicInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  profileDetailsContainer: {
    marginTop: 10,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    flex: 1,
    marginLeft: 12,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    flex: 1,
    textAlign: 'right',
  },
  valueSmall: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.light.text,
    flex: 2,
    textAlign: 'right',
  },
  logoutButton: {
    backgroundColor: '#ff4757',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 