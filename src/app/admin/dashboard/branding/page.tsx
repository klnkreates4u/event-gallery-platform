import React from 'react';
import { auth } from '@/../auth';
import { db } from '@/database/db';
import { redirect } from 'next/navigation';
import BrandingForm from '@/components/admin/branding-form';

export default async function BrandingPage() {
  const session = await auth();
  if (!session?.user) redirect('/admin');

  const org = session.user.organizationId
    ? await db.organization.findUnique({ where: { id: session.user.organizationId } })
    : await db.organization.findFirst();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-editorial text-3xl font-bold text-primary-black dark:text-soft-cream">Branding Settings</h1>
        <p className="text-xs text-muted-gray mt-1">Customize your white-label studio identity</p>
      </div>
      <BrandingForm organization={org} />
    </div>
  );
}
