import Link from "next/link";
import PostList from "@/components/post/post-list";

export default function Home() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Welcome to My App</h1>
      <Link href="/posts/new">
        Create a New Post
      </Link>
      <PostList />
    </main>
  );
}
