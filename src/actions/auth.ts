'use server';

import { signIn } from '@/../auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function loginAdminAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validation = LoginSchema.safeParse({ email, password });
  if (!validation.success) {
    return { success: false, error: 'Invalid email or password format.' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/admin/dashboard',
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { success: false, error: 'Invalid email or password.' };
        default:
          return { success: false, error: 'Something went wrong.' };
      }
    }
    throw error;
  }
}
