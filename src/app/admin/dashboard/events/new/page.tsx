'use client';

import React from 'react';
import EventForm from '@/components/admin/event-form';
import { createEventAction } from '@/actions/event';

export default function NewEventPage() {
  return (
    <EventForm
      onSave={async (data) => {
        return await createEventAction(data);
      }}
    />
  );
}
