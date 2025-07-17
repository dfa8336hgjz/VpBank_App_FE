import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const API_URL = 'https://1ef51303de17.ngrok-free.app'

export async function loginApi(username: string, password: string) {
  const response = await axios.post(`${API_URL}/identity/auth/token`, { username, password }, {
    headers: { 
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    }
  })
  if (response.status === 200) {
    const token = response.data.result.token
    if (token !== undefined && token !== null) {
      await AsyncStorage.setItem('accessToken', token)
    } else {
      await AsyncStorage.removeItem('accessToken')
      throw new Error('Invalid username or password')
    }
  } else {
    throw new Error('Invalid username or password')
  }
}

export async function registerApi({ username, password, email, firstName, lastName, dob, city }: { username: string, password: string, email: string, firstName: string, lastName: string, dob: string, city: string }) {
  return axios.post(`${API_URL}/identity/users/registration`, { username, password, email, firstName, lastName, dob, city },
    { headers: { 
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    } }
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
  const token = await AsyncStorage.getItem('accessToken')
  return axios.post(`${API_URL}/chatbot/chatbot/chat`, { message }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'
    }
  })
  .then(response => {
    return response.data.response;
  })
  .catch(error => {
    console.error(error);
    return 'Bot cannot reply now.';
  });
}

export async function getSurveyQuestionsApi() {
  const token = await AsyncStorage.getItem('accessToken')
  const response = await axios.get(
    `${API_URL}/profile/surveys`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
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
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    }
  )
  if (response.status === 200) {
    console.log(response.data)
    return response.data
  } else {
    throw new Error('Failed to fetch jar info')
  }
}

export async function submitSurveyApi(surveyAnswers: Array<{surveyId: string, answers: string[]}>) {
  const token = await AsyncStorage.getItem('accessToken')
  const response = await axios.post(
    `${API_URL}/profile/surveys/submit`,
    { surveyAnswers },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
    }
  )
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error('Failed to submit survey')
  }
}

export async function updateJarPercentagesApi(percentages: {
  necessitiesPercentage: number,
  educationPercentage: number,
  entertainmentPercentage: number,
  savingsPercentage: number,
  investmentPercentage: number,
  givingPercentage: number
}) {
  const token = await AsyncStorage.getItem('accessToken')
  const response = await axios.post(
    `${API_URL}/profile/jar-division/update`,
    percentages,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
    }
  )
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error('Failed to update jar percentages')
  }
} 

export async function createJarDivisionApi(percentages: {
  necessitiesPercentage: number,
  educationPercentage: number,
  entertainmentPercentage: number,
  savingsPercentage: number,
  investmentPercentage: number,
  givingPercentage: number
}) {
  const token = await AsyncStorage.getItem('accessToken')
  const response = await axios.post(
    `${API_URL}/profile/jar-division`,
    percentages,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
    }
  )
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error('Failed to create jar division')
  }
} 

export async function submitTransactionApi(transactionData: {
  receiverProfileId: string,
  amount: number,
  content: string
}) {
  const token = await AsyncStorage.getItem('accessToken')
  const response = await axios.post(
    `${API_URL}/transaction/transactions/submit`,
    transactionData,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
    }
  )
  if (response.status === 200) {
    console.log(response.data)
    return response.data
  } else {
    throw new Error('Failed to submit transaction')
  }
}

export async function getTransactionHistoryApi() {
  const token = await AsyncStorage.getItem('accessToken')
  const response = await axios.get(
    `${API_URL}/transaction/transactions/history`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
    }
  )
  console.log("history", response.data)
  if (response.status === 200) {
    return response.data.result || []
  } else {
    console.log("history fail")
    throw new Error('Failed to fetch transaction history')
  }
}

export async function getBalanceApi() {
  const token = await AsyncStorage.getItem('accessToken')
  const response = await axios.get(
    `${API_URL}/profile/balance/my`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
    }
  )
  if (response.status === 200) {
    console.log(response.data)
    return response.data
  } else {
    throw new Error('Failed to fetch balance')
  }
} 

export async function getUserSummariesApi() {
  const token = await AsyncStorage.getItem('accessToken')
  const response = await axios.get(
    `${API_URL}/profile/users/summary`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
    }
  )
  if (response.status === 200) {
    return response.data.result || []
  } else {
    throw new Error('Failed to fetch user summaries')
  }
} 

export async function confirmTransactionApi({ transactionId, actualJarType }: { transactionId: string, actualJarType: string }) {
  const token = await AsyncStorage.getItem('accessToken')
  const response = await axios.post(
    `${API_URL}/transaction/transactions/confirm`,
    { transactionId, actualJarType },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
    }
  )
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error('Failed to confirm transaction', response.data)
  }
} 