import { formatDistance, subDays } from "date-fns";

type Post = {
  id: string;
  title: string;
  description: string | null;
  max_participants: number;
  created_at: string;
  author?: {
    name: string;
    username: string;
  };
};

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const timeAgo = (timestamp: string) => {
    const timeAgo = formatDistance(
      subDays(new Date(), 3),
      new Date(timestamp),
      {
        addSuffix: true,
      }
    );
    return timeAgo;
  };

  return (
    <div className="w-full border-b p-4 cursor-pointer bg-[#f1eff5] hover:bg-[#e8e6eb] transition-colors">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            @{post.author?.username || "user"}
          </span>
          <span className="text-gray-500">{timeAgo(post.created_at)}</span>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">{post.title}</h3>
          {post.description && (
            <p className="text-gray-600">{post.description}</p>
          )}
          <p className="text-sm text-gray-500 font-semibold">
            Max Participants: {post.max_participants}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
