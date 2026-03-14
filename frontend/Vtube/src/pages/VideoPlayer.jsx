import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

function VideoPlayer() {

  const { videoId } = useParams()
  const [video, setVideo] = useState(null)

  useEffect(() => {
    console.log("useeffect running")
    const fetchVideo = async () => {
      console.log("api should run")
      try {
       console.log("inside try block")
        const res = await axios.get(
          `http://localhost:8000/api/v1/videos/${videoId}`
        )
        
        setVideo(res.data.data)

      } catch (error) {
        console.error(error)
      }

    }

    fetchVideo()

  }, [videoId])


  if (!video) {
    return <p className="text-white p-6">Loading...</p>
  }
  function formatViews(views){
  if(views >= 1000000) return (views/1000000).toFixed(1) + "M"
  if(views >= 1000) return (views/1000).toFixed(1) + "K"
  return views
}
  return (
    <div className="p-6">

      <video
        src={video?.videofile?.url}
        controls
        className="w-full max-w-4xl rounded"
      />

      <h1 className="text-white text-2xl mt-4">
        {video.title}
      </h1>
      <p>{formatViews(video.views)} views</p>
      <p className="text-gray-400 mt-2">
        {video.description}
      </p>

    </div>
  )
}

export default VideoPlayer