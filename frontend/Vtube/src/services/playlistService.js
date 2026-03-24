import axios from "axios";
const API=import.meta.env.VITE_BACKEND_URL;

export const getUserPlaylists=async (token,userId)=>{
    return axios.get(`${API}/playlists/user/${userId}`,{
        headers:{Authorization:`Bearer ${token}`}
    });
};
export const createPlaylist=async (token,data)=>{
    return axios.post(`${API}/playlists`,data,{
        headers:{Authorization:`Bearer ${token}`}
    });
};
export const addVideoToPlaylist=async (token,playlistId,videoId)=>{
return axios.patch(`${API}/playlists/${playlistId}/add/${videoId}`,{},{
    headers:{Authorization:`Bearer ${token}`}
});
};
