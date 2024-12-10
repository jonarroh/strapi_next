'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginUser } from "@/app/actions/login"; // Import the server action
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      email: (document.getElementById("email") as HTMLInputElement).value,
      password: (document.getElementById("password") as HTMLInputElement).value,
    };

    const result = await LoginUser(formData);

    if (result.success) {
      // Handle successful login logic, e.g., redirect to home page
      console.log("Login successful");
      console.log(result);
      setErrors({});
      setGeneralError(null);
      router.push("/");
    } else {
      if (result.error && result.error.validationErrors) {
        // Handle field-specific validation errors
        const errorMessages: Record<string, string> = {};
        result.error.validationErrors.forEach((err: { field: string | number, message: string }) => {
          errorMessages[err.field] = err.message;
        });
        setErrors(errorMessages);
      }
      if (result.error && result.error.general) {
        // Handle general errors
        setGeneralError(result.error.general);
      }
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form noValidate className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          {generalError && (
            <div className="text-red-500 text-sm mt-2">{generalError}</div>
          )}
          <Button type="submit" className="w-full">
            Login
          </Button>
          <div>
            <Link href={"/account"}>
              Crear cuenta
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
