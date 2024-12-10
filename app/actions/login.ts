'use server';

import { z } from 'zod';
import { GraphQLClient } from 'graphql-request';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface LoginData {
  email: string;
  password: string;
}

const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

const client = new GraphQLClient('http://191.101.1.86:1337/graphql', {
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function loginInStrapi(email: string, password: string) {
  const query = `
    mutation LoginUser($email: String!, $password: String!) {
      login(input: {identifier: $email, password: $password}) {
        user {
          id
          username
          email
        }
        jwt
      }
    }
  `;

  const variables = {
    email,
    password
  };

  try {
    const response: { login: { user: { id: string; username: string; email: string }; jwt: string } } = await client.request(query, variables);
    return response.login;
  } catch (error) {
    console.error('GraphQL error:', error);
    throw new Error('Failed to log in');
  }
}

export const LoginUser = async (formData: LoginData) => {
  try {
    LoginSchema.parse(formData);
    console.log('Form data is valid:', formData);
    const result = await loginInStrapi(formData.email, formData.password);

    // Store JWT in cookies
    if (result.jwt) {
      (await cookies()).set('token', result.jwt, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production', // Secure cookie in production
        sameSite: 'strict'
      });
    }

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          validationErrors: error.errors.map(err => ({
            field: err.path[0],
            message: err.message
          }))
        }
      };
    } else {
      console.error('An unexpected error occurred:', error);
      return {
        success: false,
        error: {
          general: 'An unexpected error occurred'
        }
      };
    }
  }
};
