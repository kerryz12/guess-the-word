import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import google from "../../assets/google.svg";
import "./LoginForm.css";

export const iframeHeight = "600px";

export const containerClassName =
  "w-full h-screen flex items-center justify-center px-4";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRedirect = () => {
    window.location.href = `/auth/google`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        console.log(data.user);
        window.location.href = "/";
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <Card className="mx-auto max-w-lg p-6">
        <CardHeader>
          <CardTitle className="text-xl">Sign in</CardTitle>
          <CardDescription className="text-lg">
            Enter your account details below to sign in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-3">
              <Label htmlFor="username" className="text-lg">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-12 text-lg"
              />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-lg">
                  Password
                </Label>
                <a href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-lg"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="grid gap-2">
              <Button type="submit" className="w-full h-12 text-lg">
                Sign in
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 text-lg"
                onClick={handleRedirect}
              >
                <img
                  style={{ marginRight: "0.5rem" }}
                  src={google}
                  width={22}
                />
                Sign in with Google
              </Button>
            </div>
          </form>
          <div className="mt-6 text-center text-lg">
            Don't have an account?{" "}
            <a href="/signup" className="underline">
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
