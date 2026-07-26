import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { getAdminEventList } from '@/services/admin';
import EventsTable from '@/components/admin/events-table';

export default async function EventsPage() {
  const events = await getAdminEventList();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-3xl font-bold text-primary-black dark:text-soft-cream">Events & Galleries</h1>
          <p className="text-xs text-muted-gray mt-1">{events.length} total events • Create, manage, and publish your galleries</p>
        </div>
        <Link href="/admin/dashboard/events/new">
          <Button variant="accent" className="flex items-center gap-2 self-start">
            <Plus className="w-4 h-4" />
            <span>New Event</span>
          </Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <EmptyState
          title="No Events Yet"
          description="Create your first event gallery to get started."
          action={
            <Link href="/admin/dashboard/events/new">
              <Button variant="accent" size="sm">Create Event</Button>
            </Link>
          }
        />
      ) : (
        <EventsTable initialEvents={events} />
      )}
    </div>
  );
}
