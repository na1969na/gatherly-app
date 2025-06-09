"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/db/supabaseClient";
import PostCard from "./post-card";
import { Post } from "@/types/post";
import PostLoading from "./post-loading";
import Link from "next/link";
import { Button } from "../ui/button";
import { FaSadTear } from "react-icons/fa";

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
    return <PostLoading />;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-150px)] text-2xl gap-4">
        <FaSadTear className="text-4xl mb-4" />
        <p className="">Sorry, something went wrong.</p>
        <p className="">Please try again later.</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-150px)] gap-8">
        <p className="text-gray-500 text-2xl font-bold">No posts found.</p>
        <Link href="/post/new">
          <Button className="rounded-full px-8 py-5 text-md">
            Let&apos;s Create Post!
          </Button>
        </Link>
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
