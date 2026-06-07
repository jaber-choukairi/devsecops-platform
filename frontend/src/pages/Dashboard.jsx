import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ticketService } from '../services/api'

export default function Dashboard() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ticketService.getAll()
      .then(setTickets)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const count = (key, value) => tickets.filter(ticket => ticket[key] === value).length

  const stats = [
    { label: 'Total tickets', value: tickets.length, color: 'text-blue-600' },
    { label: 'Ouverts', value: count('status', 'OUVERT'), color: 'text-blue-500' },
    { label: 'En cours', value: count('status', 'EN_COURS'), color: 'text-purple-600' },
    { label: 'Résolus', value: count('status', 'RESOLU'), color: 'text-green-600' },
    { label: 'Critiques', value: count('priority', 'CRITIQUE'), color: 'text-red-600' },
    { label: 'Priorité haute', value: count('priority', 'HAUTE'), color: 'text-orange-500' },
  ]

  if (loading) {
    return <p className="text-center py-12 text-gray-400">Chargement...</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Sécurité
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl shadow p-5">
            <div className={`text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link
          to="/tickets"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          Voir tous les tickets
        </Link>

        <Link
          to="/tickets/new"
          className="border px-5 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
        >
          + Nouveau ticket
        </Link>
      </div>
    </div>
  )
}