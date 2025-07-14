import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { logoutApi } from '../../services/api';

export default class ProfileScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Profile Screen</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 40,
    color: Colors.light.text,
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