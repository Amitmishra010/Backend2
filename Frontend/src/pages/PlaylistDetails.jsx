import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PlaylistDetail = () => {
  const API=import.meta.env.VITE_BACKEND_URL
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaylist();
  }, []);

  const fetchPlaylist = async () => {
    try {
      const res = await axios.get(
        `${API}/playlists/${playlistId}`
      );

      setPlaylist(res.data.data[0]); // because aggregation returns array
    } catch (err) {
      console.log(err);
    }
  };

  if (!playlist) return <p className="text-white">Loading...</p>;

  return (
    <div className="text-white">

      {/* Playlist Info */}
      <h1 className="text-2xl font-bold">
        {playlist.name}
      </h1>

      <p className="text-gray-400 mb-4">
        {playlist.description}
      </p>

      {/* Videos List */}
      <div className="space-y-4">

        {playlist.videos.map((video) => (
          <div
            key={video._id}
            onClick={() => navigate(`/video/${video._id}`)}
            className="flex gap-4 bg-gray-800 p-3 rounded cursor-pointer hover:bg-gray-700"
          >
            <img
              src={video.thumbnail?.url}
              alt="thumb"
              className="w-40 rounded"
            />

            <div>
              <h3>{video.title}</h3>
              <p className="text-gray-400 text-sm">
                {video.views} views
              </p>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default PlaylistDetail;