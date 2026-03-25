import Sidebar from "./Sidebar.jsx";


const Layout = ({ children }) => {
  return (
    <div className="flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 bg-black min-h-screen">
        {children}
      </div>

    </div>
  );
};

export default Layout;