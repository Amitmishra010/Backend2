import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/authContext"

function Login() {

  const navigate = useNavigate()
  const {login}=useContext(AuthContext)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      const res = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        {
          username,
          password
        }
      )
      console.log(res.data)
      localStorage.setItem("token", res.data.data.accessToken)

      alert("Login successful!")
      login(res.data.data.accessToken)
      navigate("/")

    } catch (error) {
      console.error(error)
      alert("Invalid credentials")
    }
  }

  return (

    <div className="flex justify-center items-center h-screen">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-[400px]"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        <input
          type="username"
          placeholder="Username"
          className="w-full border p-2 mb-4 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-6 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="bg-red-600 text-white w-full py-2 rounded hover:bg-red-700"
        >
          Login
        </button>

      </form>

    </div>
  )
}

export default Login