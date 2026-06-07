import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ticketService } from '../services/api'
import StatusBadge from '../components/StatusBadge'

export default function TicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadTicket = async () => {
    try {
      const data = await ticketService.getById(id)
      setTicket(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTicket()
  }, [id])

  const handleChangeStatus = async status => {
    const updatedTicket = await ticketService.changeStatus(id, status)
    setTicket(updatedTicket)
  }

  const handleChangePriority = async priority => {
    const updatedTicket = await ticketService.changePriority(id, priority)
    setTicket(updatedTicket)
  }

  const handleDelete = async () => {
    const confirmed = window.confirm('Voulez-vous vraiment supprimer ce ticket ?')

    if (!confirmed) {
      return
    }

    await ticketService.delete(id)
    navigate('/tickets')
  }

  if (loading) {
    return <p className="text-center py-12 text-gray-400">Chargement...</p>
  }

  if (!ticket) {
    return <p className="text-center py-12 text-red-500">Ticket introuvable.</p>
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/tickets" className="text-blue-600 hover:underline text-sm">
        ← Retour aux tickets
      </Link>

      <div className="bg-white rounded-xl shadow p-6 mt-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          {ticket.title}
        </h1>

        <div className="flex gap-2 mb-5">
          <StatusBadge type="priority" value={ticket.priority} />
          <StatusBadge type="status" value={ticket.status} />
        </div>

        <p className="mb-2">
          <strong>Catégorie :</strong> {ticket.category || '—'}
        </p>

        <p className="mb-2">
          <strong>Description :</strong>
        </p>

        <p className="bg-gray-50 rounded-lg p-4 text-gray-700 mb-4">
          {ticket.description}
        </p>

        <p className="text-sm text-gray-500">
          <strong>Date de création :</strong>{' '}
          {ticket.createdAt
            ? new Date(ticket.createdAt).toLocaleString('fr-FR')
            : '—'}
        </p>

        <hr className="my-6" />

        <h3 className="font-semibold mb-2">Changer le statut</h3>

        <div className="flex flex-wrap gap-2 mb-5">
          <button onClick={() => handleChangeStatus('OUVERT')} className="border px-3 py-2 rounded-lg text-sm">
            Ouvert
          </button>

          <button onClick={() => handleChangeStatus('EN_COURS')} className="border px-3 py-2 rounded-lg text-sm">
            En cours
          </button>

          <button onClick={() => handleChangeStatus('RESOLU')} className="border px-3 py-2 rounded-lg text-sm">
            Résolu
          </button>

          <button onClick={() => handleChangeStatus('FERME')} className="border px-3 py-2 rounded-lg text-sm">
            Fermé
          </button>
        </div>

        <h3 className="font-semibold mb-2">Changer la priorité</h3>

        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => handleChangePriority('FAIBLE')} className="border px-3 py-2 rounded-lg text-sm">
            Faible
          </button>

          <button onClick={() => handleChangePriority('MOYENNE')} className="border px-3 py-2 rounded-lg text-sm">
            Moyenne
          </button>

          <button onClick={() => handleChangePriority('HAUTE')} className="border px-3 py-2 rounded-lg text-sm">
            Haute
          </button>

          <button onClick={() => handleChangePriority('CRITIQUE')} className="border px-3 py-2 rounded-lg text-sm">
            Critique
          </button>
        </div>

        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-red-700"
        >
          Supprimer le ticket
        </button>
      </div>
    </div>
  )
}