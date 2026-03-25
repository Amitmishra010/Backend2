import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Playlists = () => {
    const navigate=useNavigate()
  const [playlists, setPlaylists] = useState([]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    const res = await axios.get(
      `http://localhost:8000/api/v1/playlists/user/${user._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setPlaylists(res.data.data);
  };

  return (
    <div className="text-white">

      <h1 className="text-2xl mb-4">
        Your Playlists
      </h1>

      <div className="grid grid-cols-3 gap-4">

        {playlists.map((p) => (
          <div
  key={p._id}
  onClick={() => navigate(`/playlist/${p._id}`)}
  className="bg-gray-800 p-4 rounded cursor-pointer hover:bg-gray-700"
>
  <h3>{p.name}</h3>
  <p className="text-gray-400 text-sm">
    {p.description}
  </p>
</div>
        ))}

      </div>

    </div>
  );
};

export default Playlists;