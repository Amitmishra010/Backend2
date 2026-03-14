import { useNavigate,Link } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/authContext"
function Navbar() {
  const {user,logout}=useContext(AuthContext)
  const navigate=useNavigate()
  const handlelogout=()=>{
    logout()
    navigate("/login")
  }
  return (
    <nav className="bg-black text-white px-6 py-3 flex items-center justify-between">

      {/* Logo */}
      <h1 className="text-xl font-bold">
        Vtube
      </h1>

      {/* Search Bar (CENTER) */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search videos..."
          className="w-96 px-4 py-1 rounded-l-md text-white focus:outline-none"
        />
        <button className="bg-gray-700 px-4 rounded-r-md hover:bg-gray-600">
          🔍
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-6">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        {user?(
          <>
        <Link to="/upload">Upload</Link>

        <button onClick={handlelogout}>
          Logout
        </button>
      </>
        ):(
        <>
        <Link to="/login" className="hover:text-gray-300">Login</Link>
        <Link to="/signup" className="hover:text-gray-300">Signup</Link>
      </>
        )}
       
       
      </div>

    </nav>
  )
}

export default Navbar