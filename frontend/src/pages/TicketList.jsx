import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ticketService } from '../services/api'
import StatusBadge from '../components/StatusBadge'

export default function TicketList() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [search, setSearch] = useState('')

  const loadTickets = async () => {
    setLoading(true)

    try {
      let data

      if (search.trim() !== '') {
        data = await ticketService.search(search)
      } else if (filterStatus !== '') {
        data = await ticketService.filterByStatus(filterStatus)
      } else {
        data = await ticketService.getAll()
      }

      setTickets(data)
    } catch (error) {
      console.error('Erreur chargement tickets :', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [filterStatus, search])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Tickets de sécurité
        </h1>

        <Link
          to="/tickets/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Nouveau ticket
        </Link>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Rechercher par titre..."
          className="border rounded-lg px-3 py-2 flex-1 text-sm"
          value={search}
          onChange={event => setSearch(event.target.value)}
        />

        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={filterStatus}
          onChange={event => setFilterStatus(event.target.value)}
        >
          <option value="">Tous les statuts</option>
          <option value="OUVERT">Ouvert</option>
          <option value="EN_COURS">En cours</option>
          <option value="RESOLU">Résolu</option>
          <option value="FERME">Fermé</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-8">Chargement...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Titre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Catégorie</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Priorité</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Statut</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {tickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {ticket.title}
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    {ticket.category || '—'}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge type="priority" value={ticket.priority} />
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge type="status" value={ticket.status} />
                  </td>

                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {ticket.createdAt
                      ? new Date(ticket.createdAt).toLocaleDateString('fr-FR')
                      : '—'}
                  </td>

                  <td className="px-4 py-3">
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {tickets.length === 0 && (
            <p className="text-center py-8 text-gray-400">
              Aucun ticket trouvé
            </p>
          )}
        </div>
      )}
    </div>
  )
}