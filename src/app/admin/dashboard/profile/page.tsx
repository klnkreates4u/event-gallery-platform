import React from 'react';
import { auth } from '@/../auth';
import { db } from '@/database/db';
import { redirect } from 'next/navigation';
import ProfileClient from './profile-client';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/admin');

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, avatarUrl: true, role: true },
  });

  if (!user) redirect('/admin');

  return <ProfileClient user={user} />;
}
