"use client";

import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/db/supabaseClient";
import { useState } from "react";

const GoogleSigninButton = () => {
  const [loading, setLoading] = useState(false);

  const handleSignin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            prompt: "select_account",
          },
        },
      });
      if (error) {
        console.error("Error logging in:", error.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignin}
      disabled={loading}
      className="flex items-center gap-3 px-8 py-5 w-[400px] text-md rounded-lg"
    >
      <FaGoogle />
      Continue with Google
    </Button>
  );
};

export default GoogleSigninButton;
