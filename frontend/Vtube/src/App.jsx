import { Routes, Route, BrowserRouter } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import VideoPlayer from "./pages/VideoPlayer"
import Upload from "./pages/Upload"
import Playlists from "./pages/Playlist"
import PlaylistDetail from "./pages/PlaylistDetails"
import ProtectedRoute from "./components/ProtectedRoute"
import Layout from "./components/layout"
import Downloads from "./pages/Downloads"
import History from "./pages/History"
import LikedVideos from "./pages/LikedVideos"
import YourVideos from "./pages/YourVideos"


function App() {
  return (
  
   
    <div className="min-h-screen">
      
      <Navbar />

      <div className="p-6">
        <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/videos/:videoId" element={<VideoPlayer />} />
          <Route path="/upload" element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route path="/playlists" element={<Playlists />} />
         <Route path="/playlist/:playlistId" element={<PlaylistDetail />} />
         <Route path="/liked" element={<LikedVideos />} />
          <Route path="/history" element={<History />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/your-videos" element={<YourVideos />} />
        </Routes>
        </Layout>
      </div>

    </div>
   
  )
}

export default App