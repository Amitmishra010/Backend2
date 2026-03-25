import Sidebar from "../components/Sidebar"
import VideoCard from "../components/VideoCard"
import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

function Home() {
  const API=import.meta.env.VITE_BACKEND_URL
  const [videos, setVideos] = useState([])

  useEffect(() => {

    const fetchVideos = async () => {
      try {

        const res = await axios.get(
          `${API}/videos`
        )

        setVideos(res.data.data)

      } catch (error) {
        console.error(error)
      }
    }

    fetchVideos()

  }, [])

  return (

    <div className="p-6 grid grid-cols-4 gap-6">

      {videos.map((video) => (
        <Link to={`/videos/${video._id}`}key={video._id}>
        <div key={video._id} className="bg-gray-900 p-3 rounded">

          <img
            src={video.thumbnail.url}
            alt={video.title}
            className="w-full h-48 object-cover rounded"
          />

          <h2 className="text-white mt-2 font-semibold">
            {video.title}
          </h2>
          <p className="text-gray-500 text-sm">
            {video.views} views • {new Date(video.createdAt).toDateString()}
          </p>

        </div>
</Link>
      ))}

    </div>
  )
}

export default Home