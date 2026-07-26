import React from 'react';
import { db } from '@/database/db';
import { auth } from '@/../auth';
import { redirect } from 'next/navigation';
import EditEventClient from './edit-client';

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect('/admin');

  const { id } = await params;

  const event = await db.event.findUnique({
    where: { id },
    include: {
      media: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!event || event.organizationId !== session.user.organizationId) {
    redirect('/admin/dashboard/events');
  }

  // Map to plain objects so it passes safely to client component
  const plainEvent = JSON.parse(JSON.stringify(event));

  return <EditEventClient event={plainEvent} />;
}
