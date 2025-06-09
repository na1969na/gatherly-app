import GoogleSigninButton from "@/components/signin/google-siginin-button";

const SigninPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
      <h1 className="text-2xl font-semibold mb-4">Welcome to Gatherly</h1>
      <p className="text-sm text-gray-500 mb-4">
        Sign in to your account to continue.
      </p>
      <div className="flex flex-col items-center justify-center">
        <GoogleSigninButton />
      </div>
    </div>
  );
};

export default SigninPage;
