import Link from "next/link";
import GlareCard from "./GlaredCard";

const MoonerCard = ({ post }) => {
  const getTimeAgo = (dateString) => {
    const postDate = new Date(dateString);
    const now = new Date();
    const difference = now - postDate;

    const minutes = Math.floor(difference / 60000);
    const hours = Math.floor(difference / 3600000);
    const days = Math.floor(difference / 86400000);

    if (days >= 1) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours >= 1) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <Link href="/mooner/[ca]" as={`/mooner/${post.CA}`}>
      <div className="relative text-white bg-[#323233] shadow-md rounded-lg p-6 mb-4 flex flex-col cursor-pointer hover:shadow-lg transition-shadow">
        {post.image && (
          <img
            src={post.image}
            alt={post.postName}
            className="mb-4 w-full h-48 object-cover rounded-lg"
          />
        )}
        <p className="font-semibold">{post.postName}</p>
        <p className="font-semibold">TICKER: ({post.ticker})</p>
        <p className="text-white font-semibold mb-2">{post.description}</p>
        <ul className="list-disc list-inside mb-2">
          {post.links.map((link, index) => (
            <div key={index}>
              <a href={link} className="text-blue-500 hover:underline">
                {link}
              </a>
            </div>
          ))}
        </ul>
        <div className="mt-auto">
          <p className="text-gray-300 text-sm mt-2">
            {getTimeAgo(post.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MoonerCard;
