import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const linkClass = (path) => {
    return pathname.startsWith(path)
      ? 'bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium'
      : 'text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium'
  }

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <span className="font-bold text-gray-800 mr-4">
          🛡️ DevSecOps Platform
        </span>

        <Link to="/dashboard" className={linkClass('/dashboard')}>
          Dashboard
        </Link>

        <Link to="/tickets" className={linkClass('/tickets')}>
          Tickets
        </Link>

        <Link
          to="/tickets/new"
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          + Nouveau
        </Link>
      </div>
    </nav>
  )
}