import axios from 'axios'
const API_URL = 'https://your-api-domain.com/api'
export async function loginApi(phone: string, password: string) {
  const res = await axios.post(`${API_URL}/login`, { phone, password })
  return res.data
}

export async function registerApi({ name, phone, email, password }: { name: string, phone: string, email: string, password: string }) {
  const res = await axios.post(`${API_URL}/register`, { name, phone, email, password })
  return res.data
} 