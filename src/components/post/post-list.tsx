"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/db/supabaseClient";
import PostCard from "./post-card";
import { Post } from "@/types/post";

const PostList = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setPosts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-gray-500">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-gray-500">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="rounded-2xl shadow-lg border h-[calc(100vh-100px)] overflow-hidden">
        <div className="h-full overflow-y-auto">
          {posts.map((post) => (
            <div key={post.id} onClick={() => router.push(`/post/${post.id}`)}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostList;
