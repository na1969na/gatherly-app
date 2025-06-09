import { formatDistance, subDays } from "date-fns";
import { useEffect, useState } from "react";
import supabase from "@/lib/db/supabaseClient";

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

type PostCardProps = {
  post: Post;
};

const PostCard = ({ post }: PostCardProps) => {
  const [currentParticipants, setCurrentParticipants] = useState(0);

  useEffect(() => {
    const fetchParticipants = async () => {
      const { count, error } = await supabase
        .from("participants")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);

      if (!error && count !== null) {
        setCurrentParticipants(count);
      }
    };

    fetchParticipants();
  }, [post.id]);

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
    <div className="w-full max-w-xl border-b p-4 cursor-pointer hover:bg-gray-50 transition-colors">
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
            {currentParticipants} participants
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
