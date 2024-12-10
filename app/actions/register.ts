'use server';

import { z } from 'zod';
import { GraphQLClient } from 'graphql-request';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

const client = new GraphQLClient('http://191.101.1.86:1337/graphql', {
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function registerInStrapi(name: string, email: string, password: string) {
  const query = `
    mutation RegisterUser($name: String!, $email: String!, $password: String!) {
      register(input: {username: $name, email: $email, password: $password}) {
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
    name,
    email,
    password
  };

  try {
    const response: { register: { user: { id: string; username: string; email: string }; jwt: string } } = await client.request(query, variables);
    return response.register;
  } catch (error) {
    console.error('GraphQL error:', error);
    throw new Error('Failed to register user');
  }
}

export const RegisterUser = async (formData: RegisterData) => {
  try {
    RegisterSchema.parse(formData);
    console.log('Form data is valid:', formData);
    const result = await registerInStrapi(formData.name, formData.email, formData.password);
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
