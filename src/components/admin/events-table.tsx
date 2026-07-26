'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search, ArrowUpRight, Edit2, Trash2, Archive,
  Copy, Eye, SlidersHorizontal, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmModal, ConfirmAction } from '@/components/admin/confirm-modal';
import { useToast } from '@/providers/toast-provider';
import { archiveEventAction, deleteEventAction, duplicateEventAction } from '@/actions/event';

const FILTER_OPTIONS = ['All', 'Public', 'PIN', 'QR Only', 'Archived'];
const PAGE_SIZE = 8;

interface EventsTableProps {
  initialEvents: any[];
}

export default function EventsTable({ initialEvents }: EventsTableProps) {
  const { success, error } = useToast();
  const [events, setEvents] = useState(initialEvents);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    action: ConfirmAction;
    event: any | null;
  }>({ open: false, action: 'delete', event: null });
  const [isLoading, setIsLoading] = useState(false);

  const filtered = events.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.venue || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'All' ||
      (filter === 'Public' && e.accessMode === 'PUBLIC') ||
      (filter === 'PIN' && e.accessMode === 'ACCESS_CODE') ||
      (filter === 'QR Only' && e.accessMode === 'QR_ONLY') ||
      (filter === 'Archived' && e.status === 'ARCHIVED');
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openConfirm = (action: ConfirmAction, event: any) => {
    setConfirmState({ open: true, action, event });
  };

  const handleConfirm = async () => {
    if (!confirmState.event) return;
    setIsLoading(true);
    try {
      if (confirmState.action === 'delete') {
        const res = await deleteEventAction(confirmState.event.id);
        if (res.success) {
          setEvents((prev) => prev.filter((e) => e.id !== confirmState.event!.id));
          success('Event Deleted', `"${confirmState.event.title}" has been removed.`);
        } else {
          error('Delete Failed', res.message);
        }
      } else if (confirmState.action === 'archive') {
        const res = await archiveEventAction(confirmState.event.id);
        if (res.success) {
          setEvents((prev) => prev.map((e) => e.id === confirmState.event!.id ? { ...e, status: 'ARCHIVED' } : e));
          success('Event Archived', `"${confirmState.event.title}" is now archived.`);
        } else {
          error('Archive Failed', res.message);
        }
      } else if (confirmState.action === 'duplicate') {
        const res = await duplicateEventAction(confirmState.event.id);
        res.success ? success('Event Duplicated', `A copy of "${confirmState.event.title}" was created.`) : error('Duplicate Failed', res.message);
      }
    } finally {
      setIsLoading(false);
      setConfirmState({ open: false, action: 'delete', event: null });
    }
  };

  return (
    <>
      {/* Search & Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            icon={<Search className="w-4 h-4 text-muted-gray" />}
            className="bg-white/90 dark:bg-neutral-950/90 text-sm flex-1"
          />
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            <SlidersHorizontal className="w-4 h-4 text-muted-gray flex-shrink-0" />
            {FILTER_OPTIONS.map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === f
                    ? 'bg-primary-black text-white dark:bg-soft-cream dark:text-primary-black'
                    : 'bg-warm-ivory/60 dark:bg-neutral-800 text-muted-gray hover:text-primary-black dark:hover:text-soft-cream'
                }`}
                type="button"
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Events Table */}
      {paged.length === 0 ? (
        <EmptyState
          title="No Events Found"
          description={search ? `No events match "${search}".` : 'Create your first event to get started.'}
          action={
            !search ? (
              <Link href="/admin/dashboard/events/new">
                <Button variant="accent" size="sm">Create Event</Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setSearch('')}>Clear Search</Button>
            )
          }
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Access</TableHead>
                <TableHead>Media</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((event, idx) => (
                <motion.tr
                  key={event.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="hover:bg-warm-ivory/30 dark:hover:bg-neutral-800/50 transition-colors border-b border-warm-ivory/60 dark:border-neutral-800"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-button overflow-hidden bg-neutral-900 flex-shrink-0">
                        {event.coverImageUrl && (
                          <img src={event.coverImageUrl} alt={event.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-primary-black dark:text-soft-cream truncate">{event.title}</p>
                        <p className="text-[11px] text-muted-gray truncate">{event.venue}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-gray whitespace-nowrap">
                    {new Date(event.eventDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-warm-ivory dark:bg-neutral-800 text-muted-gray font-medium">
                      {event.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      event.accessMode === 'PUBLIC' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                      : event.accessMode === 'ACCESS_CODE' ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                      : 'bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300'
                    }`}>
                      {event.accessMode === 'PUBLIC' ? 'Public' : event.accessMode === 'ACCESS_CODE' ? 'PIN' : 'QR'}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-gray whitespace-nowrap">
                    {event._count?.media ?? 0} files
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {(event.analytics?.viewsCount ?? 0).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/gallery/${event.slug}`} target="_blank" title="Preview">
                        <button className="p-1.5 rounded-button text-muted-gray hover:text-velvet-red hover:bg-warm-ivory/50 dark:hover:bg-neutral-800 transition-colors" type="button">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                      <Link href={`/admin/dashboard/events/${event.id}/edit`} title="Edit">
                        <button className="p-1.5 rounded-button text-muted-gray hover:text-primary-black dark:hover:text-soft-cream hover:bg-warm-ivory/50 dark:hover:bg-neutral-800 transition-colors" type="button">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </Link>
                      <button onClick={() => openConfirm('duplicate', event)} title="Duplicate" className="p-1.5 rounded-button text-muted-gray hover:text-primary-black dark:hover:text-soft-cream hover:bg-warm-ivory/50 dark:hover:bg-neutral-800 transition-colors" type="button">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button onClick={() => openConfirm('archive', event)} title="Archive" className="p-1.5 rounded-button text-muted-gray hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors" type="button">
                        <Archive className="w-4 h-4" />
                      </button>
                      <button onClick={() => openConfirm('delete', event)} title="Delete" className="p-1.5 rounded-button text-muted-gray hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors" type="button">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-warm-ivory dark:border-neutral-800">
              <span className="text-xs text-muted-gray">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 rounded-button text-muted-gray hover:text-primary-black dark:hover:text-soft-cream disabled:opacity-40 transition-colors" type="button">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-primary-black dark:text-soft-cream">{page} / {totalPages}</span>
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1.5 rounded-button text-muted-gray hover:text-primary-black dark:hover:text-soft-cream disabled:opacity-40 transition-colors" type="button">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </Card>
      )}

      <ConfirmModal
        isOpen={confirmState.open}
        action={confirmState.action}
        entityTitle={confirmState.event?.title || ''}
        onConfirm={handleConfirm}
        onClose={() => setConfirmState({ open: false, action: 'delete', event: null })}
        isLoading={isLoading}
      />
    </>
  );
}
