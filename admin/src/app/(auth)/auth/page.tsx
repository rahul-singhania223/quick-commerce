import AuthForm from "./components/authForm";

export default function Authpage() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="border p-6 rounded-lg shadow max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold">Hello, Prince!</h1>
          <p className="text-muted-foreground">Login to manage everything here.</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
