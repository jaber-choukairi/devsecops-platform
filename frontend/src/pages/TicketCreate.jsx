import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ticketService } from '../services/api'

export default function TicketCreate() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'MOYENNE',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = event => {
    setForm(previousForm => ({
      ...previousForm,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await ticketService.create(form)
      navigate('/tickets')
    } catch (error) {
      console.error(error)
      setError('Erreur lors de la création du ticket.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Nouveau ticket
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre *
          </label>

          <input
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ex : CVE détectée sur image backend"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>

          <textarea
            name="description"
            required
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décris la vulnérabilité ou l'incident..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
            >
              <option value="">Choisir...</option>
              <option value="CVE">CVE</option>
              <option value="OWASP">OWASP</option>
              <option value="INFRA">Infrastructure</option>
              <option value="CODE">Qualité code</option>
              <option value="RESEAU">Réseau</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priorité
            </label>

            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
            >
            <option value="FAIBLE">Faible</option>
            <option value="MOYEN">Moyen</option>
            <option value="ELEVE">Élevé</option>
            <option value="CRITIQUE">Critique</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
          >
            {loading ? 'Création...' : 'Créer le ticket'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/tickets')}
            className="border px-6 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}