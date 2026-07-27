'use server';

import { db } from '@/database/db';
import { auth } from '@/../auth';
import { revalidatePath } from 'next/cache';

export async function updateLegalAction(data: {
  privacyPolicy: string;
  termsOfService: string;
}) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return { success: false, error: 'Unauthorized' };
  }

  await db.organization.update({
    where: { id: session.user.organizationId },
    data: {
      privacyPolicy: data.privacyPolicy || null,
      termsOfService: data.termsOfService || null,
    },
  });

  revalidatePath('/', 'layout');
  revalidatePath('/privacy');
  revalidatePath('/terms');
  return { success: true };
}

export async function getLegalContentAction() {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return { privacyPolicy: '', termsOfService: '' };
  }

  const org = await db.organization.findUnique({
    where: { id: session.user.organizationId },
    select: { privacyPolicy: true, termsOfService: true },
  });

  return {
    privacyPolicy: org?.privacyPolicy ?? '',
    termsOfService: org?.termsOfService ?? '',
  };
}
