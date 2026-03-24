const ComingSoon = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-white">

      <h1 className="text-3xl font-bold mb-3">
        {title}
      </h1>

      <p className="text-gray-400 text-lg">
        🚧 This feature is coming soon...
      </p>

      <p className="text-gray-500 mt-2">
        We are working hard to bring this feature 🚀
      </p>

    </div>
  );
};

export default ComingSoon;