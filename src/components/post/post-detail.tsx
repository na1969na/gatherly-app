import { Post } from "@/types/post";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import supabase from "@/lib/db/supabaseClient";
import PostDetailMap from "./post-detail-map";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner"
interface PostDetailProps {
  post: Post | null;
}

const PostDetail = ({ post }: PostDetailProps) => {
  const [station, setStation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentParticipants, setCurrentParticipants] = useState(0);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    const fetchParticipants = async () => {
      if (!post) return;

      const { count, error } = await supabase
        .from("participants")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);

      if (!error && count !== null) {
        setCurrentParticipants(count);
      }

      // 現在のユーザーが参加しているか確認
      const { data: userParticipant } = await supabase
        .from("participants")
        .select("station")
        .eq("post_id", post.id)
        .single();

      if (userParticipant) {
        setHasJoined(true);
        setStation(userParticipant.station);
      }
    };

    fetchParticipants();
  }, [post]);

  const handleJoin = async () => {
    if (!post) return;

    setIsLoading(true);
    const { error } = await supabase.from("participants").insert({
      post_id: post.id,
      station,
    });

    if (error) {
      toast.error("Failed to join. Please try again.");
    } else {
      setCurrentParticipants((prev) => prev + 1);
      setHasJoined(true);
    }
    setIsLoading(false);
  };

  const handleLeave = async () => {
    if (!post) return;

    setIsLoading(true);
    const { error } = await supabase
      .from("participants")
      .delete()
      .eq("post_id", post.id)
      .eq("station", station);

    if (error) {
      toast.error("Failed to leave. Please try again.");
    } else {
      setCurrentParticipants((prev) => prev - 1);
      setHasJoined(false);
    }
    setIsLoading(false);
  };

  if (!post) return null;

  return (
    <div className="w-full max-w-xl h-[calc(100vh-100px)] p-6 border shadow-lg rounded-2xl overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="hover:bg-gray-100 rounded-full p-1">
          <ArrowLeft className="w-6 h-6 cursor-pointer" />
        </Link>
        <h2 className="text-2xl font-bold text-center">{post.title}</h2>
        <div className="w-6"></div>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700">{post.description}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Participants</h3>
          <p className="text-gray-700">
            {currentParticipants} / {post.max_participants} participants
          </p>
        </div>

        <hr />

        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter your nearest station"
            value={station}
            onChange={(e) => setStation(e.target.value)}
            disabled={isLoading || hasJoined}
          />
          {hasJoined ? (
            <Button
              className="rounded-full w-24 bg-black hover:bg-gray-800"
              onClick={handleLeave}
              disabled={isLoading}
            >
              {isLoading ? "Leaving..." : "Leave"}
            </Button>
          ) : (
            <Button
              className="rounded-full w-24"
              onClick={handleJoin}
              disabled={isLoading || !station.trim()}
            >
              {isLoading ? "Joining..." : "Join"}
            </Button>
          )}
          {/* <PostDetailMap postId={post.id} /> */}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
