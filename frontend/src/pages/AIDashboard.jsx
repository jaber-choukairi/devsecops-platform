import { useState } from 'react'
import { agentService } from '../services/agentApi'
import StatusBadge from '../components/StatusBadge'

export default function AIDashboard() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const runAnalysis = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await agentService.analyze()
      setResult(data)
    } catch (e) {
      setError('Erreur lors de l\'analyse. Vérifiez que l\'agent IA est démarré.')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 50) return 'text-yellow-500'
    return 'text-red-600'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          🤖 Agent IA DevSecOps
        </h1>
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? '⏳ Analyse en cours...' : '🔍 Lancer l\'analyse'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-700 font-medium">🤖 L'agent analyse les rapports de sécurité...</p>
          <p className="text-blue-500 text-sm mt-1">Interrogation du RAG et création des tickets</p>
        </div>
      )}

      {result && !loading && (
        <div>
          {/* Score */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow p-5 text-center">
              <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}
              </div>
              <div className="text-sm text-gray-500 mt-1">Score sécurité /100</div>
            </div>
            <div className="bg-white rounded-xl shadow p-5 text-center">
              <div className="text-3xl font-bold text-red-600">{result.critical_count}</div>
              <div className="text-sm text-gray-500 mt-1">CRITICAL</div>
            </div>
            <div className="bg-white rounded-xl shadow p-5 text-center">
              <div className="text-3xl font-bold text-orange-500">{result.high_count}</div>
              <div className="text-sm text-gray-500 mt-1">HIGH</div>
            </div>
            <div className="bg-white rounded-xl shadow p-5 text-center">
              <div className="text-3xl font-bold text-green-600">{result.tickets_created}</div>
              <div className="text-sm text-gray-500 mt-1">Tickets créés</div>
            </div>
          </div>

          {/* Vulnérabilités */}
          <h2 className="text-lg font-semibold mb-3">Vulnérabilités détectées</h2>
          <div className="space-y-4">
            {result.vulnerabilities.map((vuln, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-800">{vuln.cve_id}</span>
                  <StatusBadge type="priority" value={
                    vuln.severity === 'CRITICAL' ? 'CRITIQUE' : 'ELEVE'
                  } />
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  📦 {vuln.package} {vuln.installed_version} → {vuln.fixed_version}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  CVSS Score : <span className="font-medium">{vuln.cvss_score}/10</span>
                </p>
                {vuln.recommendation && (
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-purple-700 mb-1">🤖 Recommandation IA</p>
                    <p className="text-sm text-purple-800">{vuln.recommendation}</p>
                  </div>
                )}
                {vuln.ticket_id && (
                  <p className="text-xs text-green-600 mt-2">
                    ✅ Ticket créé : {vuln.ticket_id}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}