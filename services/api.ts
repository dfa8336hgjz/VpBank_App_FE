import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const API_URL = 'https://a1b24dbec00a.ngrok-free.app'

export async function loginApi(username: string, password: string) {
  const response = await axios.post(`${API_URL}/identity/auth/token`, { username, password }, {
    headers: { 'Content-Type': 'application/json' }
  })
  if (response.status === 200) {
    const token = response.data.result.token
    if (token !== undefined && token !== null) {
      await AsyncStorage.setItem('accessToken', token)
    } else {
      await AsyncStorage.removeItem('accessToken')
    }
    return token
  } else {
    throw new Error('Invalid username or password')
  }
}

export async function registerApi({ username, password, email, firstName, lastName, dob, city }: { username: string, password: string, email: string, firstName: string, lastName: string, dob: string, city: string }) {
  return axios.post(`${API_URL}/identity/users/registration`, { username, password, email, firstName, lastName, dob, city })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}

export async function logoutApi() {
  await AsyncStorage.removeItem('accessToken')

}

export async function sendChatMessageApi(message: string): Promise<string> {
  return axios.post(`${API_URL}/chatbot`, { message }, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => {
    return response.data.reply;
  })
  .catch(error => {
    console.error(error);
    return 'Bot cannot reply now.';
  });
} 