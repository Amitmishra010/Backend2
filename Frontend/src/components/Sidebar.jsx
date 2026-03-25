import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menu = [
    { name: "Home", path: "/" },
    { name: "Subscriptions", path: "/subscriptions" },
    { name: "Playlists", path: "/playlists" },
    { name: "Liked Videos", path: "/liked" },
  { name: "History", path: "/history" },
  { name: "Downloads", path: "/downloads" },
  { name: "Your Videos", path: "/your-videos" },
  ];

  return (
    <div className="w-60 bg-gray-900 text-white h-screen p-4">

      <h2 className="text-xl font-bold mb-6">
        VTUBE
      </h2>

      <div className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`block px-4 py-2 rounded ${
              location.pathname === item.path
                ? "bg-gray-700"
                : "hover:bg-gray-800"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

    </div>
  );
};

export default Sidebar;