import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  if (response.status !== 200) {
    return Error
  }
  return response.data
}

export default { login }