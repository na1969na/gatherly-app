"use client";

import Link from "next/link";
import { Button } from "./button";
import { useEffect } from "react";
import supabase from "@/lib/db/supabaseClient";
import useUserStore from "@/stores/useUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (!error && data.user) {
        const user = {
          id: data.user.id,
          name: data.user.user_metadata.full_name,
          avatar_url: data.user.user_metadata.avatar_url,
        };
        useUserStore.setState({ user });
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const user = {
            id: session.user.id,
            name: session.user.user_metadata.full_name,
          };
          useUserStore.setState({ user });
        } else {
          useUserStore.setState({ user: null });
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="flex justify-between items-center px-8 py-4 mx-auto">
      {/* Logo */}
      <Link href="/">
        <h1 className="text-2xl font-bold cursor-pointer">Gatherly</h1>
      </Link>

      {user ? (
        <div className="flex items-center gap-4">
          <Link href="/post/new">
            <Button className="rounded-full font-semibold px-6">Post</Button>
          </Link>
          <Popover>
            <PopoverTrigger asChild>
              <Avatar className="cursor-pointer h-10 w-10">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setUser(null);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <>
          {/* Signin */}
          <Link href="/signin">
            <Button className="rounded-full font-semibold">Signin</Button>
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
