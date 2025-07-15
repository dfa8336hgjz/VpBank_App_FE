import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const API_URL = 'https://1cc7adec0611.ngrok-free.app'

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
  return axios.post(`${API_URL}/identity/users/registration`, { username, password, email, firstName, lastName, dob, city },
    { headers: { 'Content-Type': 'application/json' } }
  )
    .then(response => {
      if (response.status === 200) {
        return response.data.result
      } else {
        throw new Error(response.data.error)
      }
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

export async function getSurveyQuestionsApi() {
  const token = await AsyncStorage.getItem('accessToken')
  const response = await axios.post(
    `${API_URL}/profile/surveys`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )
  if (response.status === 200) {
    return response.data.result || response.data
  } else {
    throw new Error('Failed to fetch survey questions')
  }
}

export async function getJarInfoApi() {
  const token = await AsyncStorage.getItem('accessToken')
  const response = await axios.get(
    `${API_URL}/profile/jar-division/my`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: {
        necessitiesPercentage: 50.0,
        educationPercentage: 15.0,
        entertainmentPercentage: 15.0,
        savingsPercentage: 10.0,
        investmentPercentage: 8.0,
        givingPercentage: 2.0
      }
    }
  )
  if (response.status === 200) {
    return response.data.result || response.data
  } else {
    throw new Error('Failed to fetch jar info')
  }
} 