import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Signup() {
const API=import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()
  const [fullname,setfullname]=useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
const [avatar,setAvatar]=useState(null)
const [coverimage,setcoverimage]=useState(null)
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()

    formData.append("fullname", fullname)
    formData.append("username", username)
    formData.append("email", email)
    formData.append("password", password)
    formData.append("avatar", avatar)
    formData.append("coverimage", coverimage)

    try {

      const res = await axios.post(
        "${API}/users/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )

      alert("Signup successful!")
      navigate("/login")

    } catch (error) {
      console.error(error)
      alert("Signup failed")
    }
  }

  return (

    <div className="flex justify-center items-center min-h-screen">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-[420px]"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-2 mb-3 rounded"
          value={fullname}
          onChange={(e) => setfullname(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 mb-3 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Avatar */}
        <label className="block mb-1 font-semibold">
          Avatar
        </label>
        <input
          type="file"
          accept="image/*"
          className="mb-3"
          onChange={(e) => setAvatar(e.target.files[0])}
        />

        {/* Cover Image */}
        <label className="block mb-1 font-semibold">
          Cover Image
        </label>
        <input
          type="file"
          accept="image/*"
          className="mb-4"
          onChange={(e) => setcoverimage(e.target.files[0])}
        />

        <button
          className="bg-red-600 text-white w-full py-2 rounded hover:bg-red-700"
        >
          Signup
        </button>

      </form>

    </div>
  )
}

export default Signup