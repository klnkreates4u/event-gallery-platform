import React from 'react';
import Link from 'next/link';
import {
  Calendar, Eye, Download, HardDrive, TrendingUp, Clock,
  AlertTriangle, ImageIcon, Video, Wifi, Plus, ArrowUpRight,
} from 'lucide-react';
import { MetricCards } from '@/components/admin/metric-cards';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { BarChart } from '@/components/admin/dashboard-charts';
import { getDashboardMetrics, getAnalyticsOverview, getAdminEventList } from '@/services/admin';

export default async function AdminDashboardPage() {
  const [metrics, analytics, allEvents] = await Promise.all([
    getDashboardMetrics(),
    getAnalyticsOverview(),
    getAdminEventList(),
  ]);
  const events = allEvents.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-3xl font-bold text-primary-black dark:text-soft-cream">
            Studio Dashboard
          </h1>
          <p className="text-xs text-muted-gray mt-1">
            Overview of your event galleries, engagement, and media storage.
          </p>
        </div>
        <Link href="/admin/dashboard/events/new">
          <Button variant="accent" className="flex items-center gap-2 self-start md:self-auto">
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </Button>
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <MetricCards metrics={metrics} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Visitors</CardTitle>
            <CardDescription>Gallery views by month</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={analytics.monthlyVisitors.map((d) => ({ label: d.month, value: d.value }))}
              color="#7B1E2B"
              height={140}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Uploads</CardTitle>
            <CardDescription>Photos & videos added per month</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={analytics.monthlyUploads.map((d) => ({ label: d.month, value: d.value }))}
              color="#111111"
              height={140}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Events Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Event Galleries</CardTitle>
              <CardDescription>Latest events with views, downloads, and access mode</CardDescription>
            </div>
            <Link href="/admin/dashboard/events">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <EmptyState
              title="No Events Yet"
              description="Create your first event gallery to start collecting memories."
              action={
                <Link href="/admin/dashboard/events/new">
                  <Button variant="accent" size="sm">Create Event</Button>
                </Link>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead>Media</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event: any) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-button overflow-hidden bg-neutral-900 flex-shrink-0">
                          {event.coverImageUrl && (
                            <img src={event.coverImageUrl} alt={event.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="font-semibold text-sm truncate max-w-[160px]">{event.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-gray">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        event.accessMode === 'PUBLIC'
                          ? 'bg-candy/20 text-cherry'
                          : event.accessMode === 'ACCESS_CODE'
                          ? 'bg-candy/40 text-chocolate'
                          : 'bg-cherry/10 text-cherry'
                      }`}>
                        {event.accessMode === 'ACCESS_CODE' ? 'PIN' : event.accessMode === 'QR_ONLY' ? 'QR' : 'Public'}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">{event._count?.media ?? 0} files</TableCell>
                    <TableCell className="text-xs font-medium">
                      {(event.analytics?.viewsCount ?? 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/gallery/${event.slug}`} target="_blank">
                          <Button variant="ghost" size="sm" className="text-xs px-2">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <Link href={`/admin/dashboard/events/${event.id}/edit`}>
                          <Button variant="ghost" size="sm" className="text-xs px-2">Edit</Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
