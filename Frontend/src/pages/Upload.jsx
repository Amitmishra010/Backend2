import { useState } from "react"
import axios from "axios"
function Upload() {
  const API=import.meta.env.VITE_BACKEND_URL
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [thumbnail, setThumbnail] = useState(null)
  const [videofile, setVideofile] = useState(null)

  async function handleSubmit  (e) {
    e.preventDefault()
    const token=localStorage.getItem("token")
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("thumbnail", thumbnail)
    formData.append("videofile", videofile)

    console.log("Uploading...", formData)

    // later we will send this to backend
    try {
        const res=await axios.post(`${API}/videos/upload`,formData,{headers:{
            Authorization:`Bearer ${token}`
         
            
        }})
        console.log(res.data)
        alert("video uploaded successfully")
    } catch (error) {
        console.log(error)
        alert("upload failed")
    }
  }

  return (

    <div className="flex justify-center p-10">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-lg w-[500px]"
      >

        <h2 className="text-2xl font-bold mb-6">
          Upload Video
        </h2>

        {/* Title */}
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          required
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          rows="4"
        />

        {/* Thumbnail */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">
            Thumbnail
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
        </div>

        {/* Video */}
        <div className="mb-6">
          <label className="block mb-1 font-semibold">
            Video File
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideofile(e.target.files[0])}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-red-600 text-white w-full py-2 rounded hover:bg-red-700"
        >
          Upload Video
        </button>

      </form>

    </div>
  )
}

export default Upload