import { Post } from "@/types/post";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import supabase from "@/lib/db/supabaseClient";

interface PostDetailProps {
  post: Post | null;
}

const PostDetail = ({ post }: PostDetailProps) => {
  const [station, setStation] = useState("");
  const [message, setMessage] = useState("");
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
      setMessage("参加に失敗しました。もう一度お試しください。");
    } else {
      setCurrentParticipants((prev) => prev + 1);
      setMessage("参加が完了しました！");
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
      setMessage("参加の取り消しに失敗しました。もう一度お試しください。");
    } else {
      setCurrentParticipants((prev) => prev - 1);
      setMessage("参加を取り消しました。");
      setHasJoined(false);
    }
    setIsLoading(false);
  };

  if (!post) return null;

  return (
    <div className="max-w-xl h-[calc(100vh-100px)] p-6 bg-white rounded-2xl overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
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

        {message && (
          <p
            className={`text-sm ${
              message.includes("失敗") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}

        <hr />

        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter your nearest station"
            className="flex-1"
            value={station}
            onChange={(e) => setStation(e.target.value)}
            disabled={isLoading || hasJoined}
          />
          {hasJoined ? (
            <Button
              className="flex-1 rounded-full bg-red-500 hover:bg-red-600"
              onClick={handleLeave}
              disabled={isLoading}
            >
              {isLoading ? "Leaving..." : "Leave"}
            </Button>
          ) : (
            <Button
              className="flex-1 rounded-full"
              onClick={handleJoin}
              disabled={isLoading || !station.trim()}
            >
              {isLoading ? "Joining..." : "Join"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
