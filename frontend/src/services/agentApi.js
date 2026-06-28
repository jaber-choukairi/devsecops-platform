import axios from 'axios'

const agentApi = axios.create({
  baseURL: 'http://localhost:8001',
  headers: { 'Content-Type': 'application/json' }
})

export const agentService = {
  analyze: () => agentApi.post('/agent/analyze').then(r => r.data),
  getScore: () => agentApi.get('/agent/score').then(r => r.data),
  getVulnerabilities: () => agentApi.get('/agent/vulnerabilities').then(r => r.data),
  getLastResult: () => agentApi.get('/agent/last-result').then(r => r.data),
}

export default agentApi