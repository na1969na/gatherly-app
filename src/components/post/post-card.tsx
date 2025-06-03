import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Post = {
  id: string;
  title: string;
  description: string | null;
  max_participants: number;
  created_at: string;
};

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {post.description && (
            <p className="text-gray-600">{post.description}</p>
          )}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Max Participants: {post.max_participants}</span>
            <span>
              {new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
