'use server';

import { z } from 'zod';
import { auth } from '@/../auth';
import { db } from '@/database/db';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { StorageService } from '@/services/storage';

const ProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
});

const PasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export async function updateProfileAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
  };

  const parsed = ProfileSchema.safeParse(data);
  if (!parsed.success) {
    const msg = Object.values(parsed.error.flatten().fieldErrors).flat().join(', ');
    return { success: false, error: msg };
  }

  // Check if new email is already taken by another user
  if (parsed.data.email !== session.user.email) {
    const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
    if (existing && existing.id !== session.user.id) {
      return { success: false, error: 'That email address is already in use.' };
    }
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name, email: parsed.data.email },
  });

  revalidatePath('/admin/dashboard/profile');
  revalidatePath('/admin/dashboard', 'layout');
  return { success: true };
}

export async function updatePasswordAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  const data = {
    currentPassword: formData.get('currentPassword') as string,
    newPassword: formData.get('newPassword') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  const parsed = PasswordSchema.safeParse(data);
  if (!parsed.success) {
    const msg = Object.values(parsed.error.flatten().fieldErrors).flat().join(', ');
    return { success: false, error: msg };
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user?.passwordHash) return { success: false, error: 'User not found.' };

  const isValid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!isValid) return { success: false, error: 'Current password is incorrect.' };

  const hashed = await bcrypt.hash(parsed.data.newPassword, 12);
  await db.user.update({ where: { id: session.user.id }, data: { passwordHash: hashed } });

  return { success: true };
}

export async function updateAvatarAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  const file = formData.get('file') as File | null;
  if (!file) return { success: false, error: 'No file provided' };

  // Delete old avatar if local
  const currentUser = await db.user.findUnique({ where: { id: session.user.id } });
  if (currentUser?.avatarUrl?.startsWith('/storage/')) {
    await StorageService.deleteFile(currentUser.avatarUrl);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await StorageService.uploadBuffer(buffer, file.name, 'avatars');

  await db.user.update({ where: { id: session.user.id }, data: { avatarUrl: url } });

  revalidatePath('/admin/dashboard/profile');
  revalidatePath('/admin/dashboard', 'layout');
  return { success: true, url };
}
