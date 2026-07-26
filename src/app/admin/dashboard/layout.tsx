import React from 'react';
import { auth } from '@/../auth';
import AdminLayoutClient from './layout-client';
import { redirect } from 'next/navigation';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin');
  }

  return (
    <AdminLayoutClient user={session.user}>
      {children}
    </AdminLayoutClient>
  );
}
