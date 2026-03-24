import { useEffect,useState } from "react";
import { getUserPlaylists,addVideoToPlaylist,createPlaylist } from "../services/playlistService";


const playlistModel=({videoId,onclose})=>{
    const [playlist,setPlaylist]=useState([])
    const [name,setName]=useState("")
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;
    useEffect(()=>{
        fetchPlaylists();
    },[])
    
    const fetchPlaylists=async ()=>{
        
        const res=await getUserPlaylists(token,userId);
        
        setPlaylist(res.data.data);
    };
    const handleAdd=async (playlistId)=>{
       try {
         const res=await addVideoToPlaylist(token,playlistId,videoId);
         alert(res.data.message);
       } catch (error) {
        console.log("something went wrong while adding:",error)
       }
    };
    const handleCreate=async ()=>{
        if (!name.trim()) {
    alert("Please enter playlist name");
    return;
  }
        try {
            await createPlaylist(token,{name,description:"New playlist"});
           alert("playlist created successfully")
           fetchPlaylists()
        } catch (error) {
            console.log(error)
            alert(error.response?.data?.message || "Something went wrong");
        }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">

  <div className="bg-gray-900 p-6 rounded-lg w-96 shadow-lg">

    {/* Title */}
    <h2 className="text-white text-lg font-semibold mb-4">
      Save to Playlist
    </h2>

    {/* Playlist List */}
    <div className="space-y-3 max-h-60 overflow-y-auto">

      {playlist.map((p) => (
        <div
          key={p._id}
          className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded"
        >
          <span className="text-white">
            {p.name}
          </span>

          <button
            onClick={() => handleAdd(p._id)}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
          >
            Add
          </button>
        </div>
      ))}

    </div>

    {/* Create Section */}
    <div className="mt-5">

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New playlist name"
        className="w-full p-2 rounded bg-gray-800 text-white outline-none"
      />

      <div className="flex justify-end gap-3 mt-4">

        <button
          onClick={handleCreate}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Create
        </button>

        <button
          onClick={onclose}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Close
        </button>

      </div>

    </div>

  </div>
</div>
    );

};
export default playlistModel;