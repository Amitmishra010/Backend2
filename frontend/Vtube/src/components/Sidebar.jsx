import { Link } from "react-router-dom"

function Sidebar() {
  return (

    <div className="w-56 bg-white h-screen shadow-md p-4">

      <div className="flex flex-col gap-6">

        <Link to="/" className="hover:bg-gray-200 p-2 rounded">
          🏠 Home
        </Link>

        <Link to="/trending" className="hover:bg-gray-200 p-2 rounded">
          🔥 Trending
        </Link>

        <Link to="/subscriptions" className="hover:bg-gray-200 p-2 rounded">
          📺 Subscriptions
        </Link>

        <Link to="/library" className="hover:bg-gray-200 p-2 rounded">
          📚 Library
        </Link>

      </div>

    </div>

  )
}

export default Sidebar