import Link from "next/link";
import { House } from "lucide-react";
import { Button } from "./button";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-4 mx-auto">
      {/* Logo */}
      <Link href="/">
        <h1 className="text-2xl font-bold">Gatherly</h1>
      </Link>

      {/* Home */}
      <Link href="/">
        <House className="w-6 h-6" />
      </Link>

      {/* Signin */}
      <Link href="/signin">
        <Button
          variant="outline"
          className="rounded-full bg-gray-200 hover:bg-gray-300"
        >
          Signin
        </Button>
      </Link>

      {/* Post */}
      <Link href="/posts/new">
        <Button
          variant="outline"
          className="rounded-full bg-gray-200 hover:bg-gray-300"
        >
          Post
        </Button>
      </Link>
    </nav>
  );
};

export default Navbar;
