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
import "./SignupForm.css";

export const containerClassName =
  "w-full h-screen flex items-center justify-center px-4";

const FormField = ({
  label,
  name,
  type,
  placeholder,
  description,
  value,
  onChange,
}: any) => (
  <div className="grid gap-2">
    <Label htmlFor={name} className="text-lg">
      {label}
    </Label>
    <Input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      required
      className="h-12 text-lg"
      value={value}
      onChange={onChange}
    />
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

function SignupForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    displayName: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Signup failed");
      }

      await response.json();
      setSuccess("Signup successful! You can now log in.");
      setFormData({ username: "", email: "", displayName: "", password: "" });
    } catch (error) {
      setError("An error occurred during signup");
    }
  };

  const handleRedirect = () => {
    window.location.href = `/auth/google`;
  };

  return (
    <div className="signup-container">
      <Card className="mx-auto max-w-lg p-6">
        <CardHeader>
          <CardTitle className="text-xl">Sign up</CardTitle>
          <CardDescription className="text-lg">
            Create your account by filling out the information below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <FormField
              label="Username"
              name="username"
              type="text"
              placeholder=""
              description="This will be your unique identifier on the platform."
              value={formData.username}
              onChange={handleChange}
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="email@example.com"
              description="We'll use this email for account-related communications."
              value={formData.email}
              onChange={handleChange}
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              placeholder=""
              description="Use a strong password with at least 8 characters, including numbers and symbols."
              value={formData.password}
              onChange={handleChange}
            />

            <div className="grid gap-2">
              <Button type="submit" className="w-full h-12 text-lg">
                Sign up
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
                Sign up with Google
              </Button>
            </div>
          </form>
          <div className="mt-6 text-center text-lg">
            Already have an account?{" "}
            <a href="/login" className="underline">
              Log in
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignupForm;
