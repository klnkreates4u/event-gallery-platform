'use client';

import React, { useState, useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Camera, ShieldCheck, Key, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/providers/toast-provider';
import { updateProfileAction, updatePasswordAction, updateAvatarAction } from '@/actions/profile';
import { useSession } from 'next-auth/react';

const ProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

const PasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Minimum 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ProfileFormData = z.infer<typeof ProfileSchema>;
type PasswordFormData = z.infer<typeof PasswordSchema>;

interface ProfileUser {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  role: string;
}

export default function ProfileClient({ user }: { user: ProfileUser }) {
  const { success, error } = useToast();
  const { update: updateSession } = useSession();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl);
  const [isPending, startTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();
  const [isAvatarPending, startAvatarTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: { name: user.name ?? '', email: user.email },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(PasswordSchema),
  });

  const onProfileSave = (data: ProfileFormData) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);

      const result = await updateProfileAction(formData);

      if (result.success) {
        await updateSession({ name: data.name, email: data.email });
        success('Profile Updated', 'Your name and email have been saved.');
      } else {
        error('Update Failed', result.error ?? 'Something went wrong.');
      }
    });
  };

  const onPasswordChange = (data: PasswordFormData) => {
    startPasswordTransition(async () => {
      const formData = new FormData();
      formData.append('currentPassword', data.currentPassword);
      formData.append('newPassword', data.newPassword);
      formData.append('confirmPassword', data.confirmPassword);

      const result = await updatePasswordAction(formData);

      if (result.success) {
        success('Password Changed', 'Your password has been updated successfully.');
        passwordForm.reset();
      } else {
        error('Password Error', result.error ?? 'Something went wrong.');
      }
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show optimistic preview immediately
    setAvatarPreview(URL.createObjectURL(file));

    startAvatarTransition(async () => {
      const formData = new FormData();
      formData.append('file', file);

      const result = await updateAvatarAction(formData);

      if (result.success) {
        setAvatarPreview(result.url!);
        await updateSession({ image: result.url });
        success('Avatar Updated', 'Your profile picture has been saved.');
      } else {
        setAvatarPreview(user.avatarUrl);
        error('Upload Failed', result.error ?? 'Could not upload the image.');
      }
    });
  };

  const initials = (user.name ?? user.email)
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-editorial text-3xl font-bold text-primary-black dark:text-soft-cream">Profile Settings</h1>
        <p className="text-xs text-muted-gray mt-1">Manage your administrator account and security settings</p>
      </div>

      {/* Avatar */}
      <Card className="p-6 flex items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-velvet-red text-white flex items-center justify-center text-2xl font-bold font-editorial overflow-hidden">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
            {isAvatarPending && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
          <label className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white dark:bg-neutral-800 border border-warm-ivory dark:border-neutral-700 text-muted-gray hover:text-velvet-red cursor-pointer transition-colors shadow-sm">
            <Camera className="w-4 h-4" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={isAvatarPending}
            />
          </label>
        </div>
        <div>
          <h3 className="font-editorial text-xl font-semibold text-primary-black dark:text-soft-cream">
            {user.name ?? 'Admin Account'}
          </h3>
          <p className="text-xs text-muted-gray">{user.email}</p>
          <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-warm-ivory dark:bg-neutral-800 text-[10px] font-semibold text-muted-gray uppercase tracking-wider">
            {user.role}
          </span>
        </div>
      </Card>

      {/* Profile Info Form */}
      <Card className="p-6 space-y-4">
        <h2 className="font-editorial text-lg font-semibold text-primary-black dark:text-soft-cream border-b border-warm-ivory dark:border-neutral-800 pb-3">
          Personal Information
        </h2>
        <form onSubmit={profileForm.handleSubmit(onProfileSave)} className="space-y-4">
          <div>
            <Input
              label="Full Name"
              placeholder="Your full name"
              {...profileForm.register('name')}
            />
            {profileForm.formState.errors.name && (
              <p className="text-xs text-red-500 mt-1">{profileForm.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <Input
              label="Email Address"
              type="email"
              placeholder="you@studio.com"
              {...profileForm.register('email')}
            />
            {profileForm.formState.errors.email && (
              <p className="text-xs text-red-500 mt-1">{profileForm.formState.errors.email.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <Button variant="accent" type="submit" disabled={isPending} className="flex items-center gap-2">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isPending ? 'Saving...' : 'Save Profile'}</span>
            </Button>
          </div>
        </form>
      </Card>

      {/* Password Change */}
      <Card className="p-6 space-y-4">
        <h2 className="font-editorial text-lg font-semibold text-primary-black dark:text-soft-cream border-b border-warm-ivory dark:border-neutral-800 pb-3 flex items-center gap-2">
          <Key className="w-4 h-4 text-velvet-red" /> Change Password
        </h2>
        <form onSubmit={passwordForm.handleSubmit(onPasswordChange)} className="space-y-4">
          <div>
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              {...passwordForm.register('currentPassword')}
            />
            {passwordForm.formState.errors.currentPassword && (
              <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.currentPassword.message}</p>
            )}
          </div>
          <div>
            <Input
              label="New Password"
              type="password"
              placeholder="Minimum 8 characters"
              {...passwordForm.register('newPassword')}
            />
            {passwordForm.formState.errors.newPassword && (
              <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.newPassword.message}</p>
            )}
          </div>
          <div>
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Repeat new password"
              {...passwordForm.register('confirmPassword')}
            />
            {passwordForm.formState.errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" type="submit" disabled={isPasswordPending} className="flex items-center gap-2">
              {isPasswordPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
              <span>{isPasswordPending ? 'Updating...' : 'Change Password'}</span>
            </Button>
          </div>
        </form>
      </Card>

      {/* 2FA Placeholder */}
      <Card className="p-5 border-dashed border-2 border-warm-ivory dark:border-neutral-800">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-soft-cream dark:bg-neutral-800">
            <ShieldCheck className="w-5 h-5 text-muted-gray" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary-black dark:text-soft-cream">Two-Factor Authentication</p>
            <p className="text-xs text-muted-gray mt-0.5">Add an extra layer of security to your account. Available in Module 4.</p>
          </div>
          <Button variant="ghost" size="sm" disabled className="text-xs opacity-50">Enable 2FA</Button>
        </div>
      </Card>
    </div>
  );
}
