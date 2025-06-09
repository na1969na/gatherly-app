"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostFormInputs, postSchema } from "@/lib/schemas/postSchema";
import supabase from "@/lib/db/supabaseClient";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const PostForm = () => {
  const router = useRouter();
  const form = useForm<PostFormInputs>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      description: "",
      max_participants: 1,
    },
  });

  const onSubmit = async (inputData: PostFormInputs) => {
    const { error } = await supabase.from("posts").insert([
      {
        title: inputData.title,
        description: inputData.description,
        max_participants: inputData.max_participants,
      },
    ]);
    if (error) {
      console.error(error);
    } else {
      router.push(`/`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-8">
        What&apos;s your next gathering?
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter post title"
                    {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Description
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter post description"
                    {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="max_participants"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Maximum Participants
                </FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select maximum participants" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
            >
              Create Post
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PostForm;
