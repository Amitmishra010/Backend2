import { useEffect, useState } from "react"
import { useParams,useNavigate } from "react-router-dom"
import PlaylistModel from "../components/playlistModel.jsx"
import axios from "axios"

function VideoPlayer() {

  const { videoId } = useParams()
   const navigate=useNavigate()
  const [video, setVideo] = useState(null);
  const [liked,setLiked]=useState(false);
  const [likesCount,setLikesCount]=useState(0);
  const [comments,setComments]=useState("")
  const [isSubscribed,setIsSubscribed]=useState(false)
  const [subscriberCount,setSubscriberCount]=useState(0);
  const [showPlaylistModel,setShowPlaylistModel]=useState(false);



  useEffect(() => {
    console.log("useeffect running")
    const fetchVideo = async () => {
      console.log("api should run")
      try {
       console.log("inside try block")
        const res = await axios.get(
          `http://localhost:8000/api/v1/videos/${videoId}`
        )
        const data=res.data.data
        console.log("ye raha data:",data);
        setVideo(res.data.data)
        setLiked(data.liked ||false);
        setLikesCount(data.likesCount||0);

      } catch (error) {
        console.error(error)
      }

    }

    fetchVideo()

  }, [videoId])
  
  useEffect(()=>{
  if(video){
    setIsSubscribed(video.owner.isSubscribed)
    setSubscriberCount(video.owner.subscriberCount)
  }
},[video])
if (!video) {
    return <p className="text-white p-6">Loading...</p>
  }
  function formatViews(views){
  if(views >= 1000000) return (views/1000000).toFixed(1) + "M"
  if(views >= 1000) return (views/1000).toFixed(1) + "K"
  return views
}

//like handler
async function handleLikes() {
  const token=localStorage.getItem("token")
  if(!token){
    alert("login karo")
    return;
  }
  const res=await axios.post(`http://localhost:8000/api/v1/likes/${videoId}/like`,{},{
    headers:{
      Authorization:`Bearer ${token}`
    }
  })
 console.log("yahan tak:",res.data)
  if(res.data.liked){
    setLiked(true)
    setLikesCount(likesCount=>likesCount+1)
  }
  else{
    setLiked(false)
    setLikesCount(likesCount=>likesCount-1)
  }
}


//comment handler
async function handleComment() {
  const token=localStorage.getItem("token")
  console.log("ye raha token:",token)
  if(!token){
    alert("Please login first")
    return;
  }
  await axios.post(`http://localhost:8000/api/v1/comments/${videoId}/add`,{content:comments},{
    headers:{
      Authorization:`Bearer ${token}`
    }
  })
  
  setComments("")
  alert("comment added")
  
}

//subscription handler
async function handleSubscription() {
  const token=localStorage.getItem("token")
  if(!token){
    alert("login first")
   navigate("/login")

    return;
  }
  const res=await axios.post(`http://localhost:8000/api/v1/subscriptions/${video.owner._id}`,{},{
    headers:{
      Authorization:`Bearer ${token}`
    }
  })
  console.log("res ka data:",res.data)
  if(res.data.message==="Subscribed successfully"){
    setIsSubscribed(true)
    setSubscriberCount(prev=>prev+1)
  }
  else{
    setIsSubscribed(false)
    setSubscriberCount(prev=>prev-1)
  }
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
      <button
 onClick={handleLikes}
 className={`px-4 py-2 rounded ${
   liked ? "bg-blue-600" : "bg-gray-700"
 }`}
>
 👍 {likesCount}
</button>

<button
  onClick={() => setShowPlaylistModel(true)}
  className="px-4 py-2 bg-green-600 rounded ml-3"
>
  Save to Playlist
</button>
<input
 value={comments}
 onChange={(e)=>setComments(e.target.value)}
 placeholder="Add a comment"
/>

<button onClick={handleComment}>
 Comment
</button>


{/*subscriber section*/}
<div className="flex items-center gap-4 mt-4">

<h3 className="text-white">
  {video.owner.username}
</h3>

<p className="text-gray-400">
  {subscriberCount} subscribers
</p>

<button
 onClick={handleSubscription}
 className={`px-4 py-2 rounded ${
   isSubscribed ? "bg-gray-600" : "bg-red-600"
 }`}
>
 {isSubscribed ? "Subscribed" : "Subscribe"}
</button>


</div>

    {showPlaylistModel && (
  <PlaylistModel
    videoId={video._id}
    onClose={() => setShowPlaylistModel(false)}
  />
)}
    </div>
  )
}

export default VideoPlayer