"use client";

import { useState } from "react";
import { signUp } from "@/actions/auth.action";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import toast from "react-hot-toast";

export default function SignUpForm() {
  const [role, setRole] = useState<"STUDENT" | "ALUMNI">("STUDENT");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const result = await signUp(formData);
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        window.location.href = '/';
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <Input name="name" placeholder="Full Name" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" required />
          <Input name="institution" placeholder="College/Institution Name" required />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={role === "STUDENT" ? "default" : "outline"}
                onClick={() => setRole("STUDENT")}
                className="flex-1"
              >
                Student
              </Button>
              <Button
                type="button"
                variant={role === "ALUMNI" ? "default" : "outline"}
                onClick={() => setRole("ALUMNI")}
                className="flex-1"
              >
                Alumni
              </Button>
            </div>
          </div>
          
          <input type="hidden" name="role" value={role} />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}