import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:4200',
})

/**
 * middleware-функция, которая при каждом запросе будет проверять есть токен или нет, если есть - отправляет его в запросе*/
instance.interceptors.request.use((config) => {
  config.headers.Authorization = localStorage.getItem('blog/token')
  return config
})

export default instance
