const PRIORITY_COLORS = {
  CRITIQUE: 'bg-red-100 text-red-700',
  HAUTE: 'bg-orange-100 text-orange-700',
  MOYENNE: 'bg-yellow-100 text-yellow-700',
  FAIBLE: 'bg-green-100 text-green-700',
}

const STATUS_COLORS = {
  OUVERT: 'bg-blue-100 text-blue-700',
  EN_COURS: 'bg-purple-100 text-purple-700',
  RESOLU: 'bg-green-100 text-green-700',
  FERME: 'bg-gray-100 text-gray-600',
}

export default function StatusBadge({ type, value }) {
  const colors = type === 'priority' ? PRIORITY_COLORS : STATUS_COLORS
  const color = colors[value] || 'bg-gray-100 text-gray-600'

  return (
    <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${color}`}>
      {value}
    </span>
  )
}