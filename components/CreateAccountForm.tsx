"use client";

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
import { RegisterUser } from "@/app/actions/register";

export function CreateAccountForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      name: (document.getElementById("username") as HTMLInputElement).value,
      email: (document.getElementById("email") as HTMLInputElement).value,
      password: (document.getElementById("password") as HTMLInputElement).value,
    };

    const result = await RegisterUser(formData);

    if (result.success) {
      // Handle successful registration logic here
      console.log("Registration successful");
      console.log(result.data);
      setErrors({});
      setGeneralError(null);
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
        <CardTitle className="text-2xl">Crear cuenta</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" placeholder="m" required />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
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
            Create account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
