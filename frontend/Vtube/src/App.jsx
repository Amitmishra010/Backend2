import { Routes, Route, BrowserRouter } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import VideoPlayer from "./pages/VideoPlayer"
import Upload from "./pages/Upload"
import ProtectedRoute from "./components/ProtectedRoute"


function App() {
  return (
  
   
    <div className="min-h-screen">
      
      <Navbar />

      <div className="p-6">
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
        </Routes>
      </div>

    </div>
   
  )
}

export default App