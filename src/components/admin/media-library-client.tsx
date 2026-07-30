'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Grid3x3, List, Search, Trash2, ImageIcon, Video, SlidersHorizontal, Film } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/providers/toast-provider';
import { deleteMediaAction, bulkDeleteMediaAction } from '@/actions/media';

type ViewMode = 'grid' | 'list';
type MediaFilter = 'All' | 'Photos' | 'Videos';

interface MediaLibraryClientProps {
  initialMedia: any[];
}

export default function MediaLibraryClient({ initialMedia }: MediaLibraryClientProps) {
  const { success, error } = useToast();
  const [view, setView] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<MediaFilter>('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [media, setMedia] = useState(initialMedia);

  const filtered = media.filter((m) => {
    const matchType = filter === 'All' || (filter === 'Photos' && m.type === 'PHOTO') || (filter === 'Videos' && m.type === 'VIDEO');
    const matchSearch =
      (m.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.event?.title || '').toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selected);
    const res = await bulkDeleteMediaAction(ids);
    if (res.success) {
      setMedia((prev) => prev.filter((m) => !selected.has(m.id)));
      setSelected(new Set());
      success('Media Deleted', res.message);
    } else {
      error('Delete Failed', res.message);
    }
  };

  return (
    <>
      {selected.size > 0 && (
        <div className="flex justify-end">
          <Button variant="accent" size="sm" onClick={handleBulkDelete} className="flex items-center gap-2 text-xs">
            <Trash2 className="w-4 h-4" />
            <span>Delete Selected ({selected.size})</span>
          </Button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <Input
            type="text"
            placeholder="Search media by title or event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4 text-muted-gray" />}
            className="flex-1 bg-white/90 dark:bg-neutral-950/90 text-sm"
          />
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-gray" />
            {(['All', 'Photos', 'Videos'] as MediaFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === f ? 'bg-primary-black text-white dark:bg-soft-cream dark:text-primary-black' : 'bg-warm-ivory/60 dark:bg-neutral-800 text-muted-gray hover:text-primary-black dark:hover:text-soft-cream'
                  }`}
                type="button"
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 p-1 bg-soft-cream dark:bg-neutral-900 border border-border dark:border-neutral-800 rounded-button">
            <button onClick={() => setView('grid')} className={`p-1.5 rounded-button transition-colors ${view === 'grid' ? 'bg-white dark:bg-neutral-800 text-primary-black dark:text-soft-cream shadow-sm' : 'text-muted-gray hover:text-primary-black dark:hover:text-soft-cream'}`} type="button">
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded-button transition-colors ${view === 'list' ? 'bg-white dark:bg-neutral-800 text-primary-black dark:text-soft-cream shadow-sm' : 'text-muted-gray hover:text-primary-black dark:hover:text-soft-cream'}`} type="button">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Media Results */}
      {filtered.length === 0 ? (
        <EmptyState title="No Media Found" description={search ? `No files match "${search}".` : 'Upload media in an event to see it here.'} />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {filtered.map((media, idx) => (
            <motion.div
              key={media.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: idx * 0.03 }}
              onClick={() => toggleSelect(media.id)}
              className={`relative group aspect-square rounded-gallery overflow-hidden cursor-pointer border-2 transition-all ${selected.has(media.id) ? 'border-velvet-red ring-2 ring-velvet-red/40' : 'border-transparent'
                }`}
            >
              <Image
                src={media.thumbnailUrl || media.url}
                alt={media.title || 'Media'}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover group-hover:scale-105 transition-transform duration-400"
              />
              {media.type === 'VIDEO' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center">
                    <Film className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
              )}
              <div className="absolute top-2 left-2">
                <div className={`w-4 h-4 rounded-sm border-2 transition-all ${selected.has(media.id) ? 'bg-velvet-red border-velvet-red' : 'border-white/60 bg-black/30'}`} />
              </div>
              <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] text-white font-semibold truncate">{media.title}</p>
                <p className="text-[9px] text-white/70 truncate">{media.event?.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <input type="checkbox" className="accent-velvet-red w-3.5 h-3.5 cursor-pointer" onChange={(e) => e.target.checked ? setSelected(new Set(filtered.map((m) => m.id))) : setSelected(new Set())} />
                </TableHead>
                <TableHead>File</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <input type="checkbox" checked={selected.has(m.id)} onChange={() => toggleSelect(m.id)} className="accent-velvet-red w-3.5 h-3.5 cursor-pointer" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-button overflow-hidden bg-neutral-900 flex-shrink-0">
                        <Image
                          src={m.thumbnailUrl || m.url}
                          alt={m.title || ''}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs font-semibold text-primary-black dark:text-soft-cream truncate max-w-[160px]">{m.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`flex items-center gap-1 text-[11px] font-semibold ${m.type === 'VIDEO' ? 'text-cherry' : 'text-candy dark:text-candy'}`}>
                      {m.type === 'PHOTO' ? <ImageIcon className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                      {m.type === 'PHOTO' ? 'Photo' : 'Video'}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-gray">{m.event?.title}</TableCell>
                  <TableCell className="text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-warm-ivory dark:bg-neutral-800 text-muted-gray">{m.category}</span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-gray">{new Date(m.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <button
                      className="p-1.5 rounded-button text-muted-gray hover:text-cherry hover:bg-cherry/10 dark:hover:bg-cherry/20 transition-colors"
                      type="button"
                      onClick={async () => {
                        const res = await deleteMediaAction(m.id);
                        if (res.success) {
                          setMedia((prev) => prev.filter((x) => x.id !== m.id));
                          success('Media Deleted', 'File deleted successfully.');
                        } else {
                          error('Delete Failed', res.message);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </>
  );
}
