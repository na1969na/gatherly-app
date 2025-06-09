import { Skeleton } from "@/components/ui/skeleton"

const PostLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Skeleton className="w-full max-w-xl h-[calc(100vh-100px)]" />
    </div>
  );
};

export default PostLoading;