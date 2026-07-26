'use client';

import React from 'react';
import EventForm from '@/components/admin/event-form';
import { updateEventAction } from '@/actions/event';

interface EditEventClientProps {
  event: any;
}

export default function EditEventClient({ event }: EditEventClientProps) {
  return (
    <EventForm
      initialEvent={event}
      onSave={async (data) => {
        return await updateEventAction(event.id, data);
      }}
    />
  );
}
