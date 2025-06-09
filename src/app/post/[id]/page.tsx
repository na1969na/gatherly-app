"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import supabase from "@/lib/db/supabaseClient";
import PostDetail from "@/components/post/post-detail";
import { Post } from "@/types/post";
import PostLoading from "@/components/post/post-loading";

const PostDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) {
          throw error;
        }

        setPost(data);
      } catch (err) {
        console.error("Error fetching post:", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id, router]);

  if (loading) {
    return <PostLoading />;
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-red-500">Post not found</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-100px)] p-4">
      <PostDetail post={post} />
    </div>
  );
};

export default PostDetailPage;
