import { Link } from "react-router-dom"

function VideoCard({ video }) {
  return (
    <Link to={`/video/${video._id}`}>

      <div className="cursor-pointer">

        {/* Thumbnail */}
        <img
          src={video.thumbnail}
          alt="thumbnail"
          className="w-full h-48 object-cover rounded-lg"
        />

        {/* Video Info */}
        <div className="flex mt-3 gap-3">

          {/* Channel Avatar */}
          <img
            src={video.channelAvatar}
            alt="channel"
            className="w-10 h-10 rounded-full"
          />

          <div>
            {/* Title */}
            <h3 className="font-semibold text-sm line-clamp-2">
              {video.title}
            </h3>

            {/* Channel Name */}
            <p className="text-gray-500 text-sm">
              {video.channelName}
            </p>

            {/* Views + Time */}
            <p className="text-gray-500 text-xs">
              {video.views} views • {video.time}
            </p>
          </div>

        </div>

      </div>

    </Link>
  )
}

export default VideoCard