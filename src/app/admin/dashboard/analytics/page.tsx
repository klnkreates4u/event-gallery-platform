import React from 'react';
import { TrendingUp, Download, Eye, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DonutChart, BarChart } from '@/components/admin/dashboard-charts';
import { getAnalyticsOverview } from '@/services/admin';

export default async function AnalyticsPage() {
  const analytics = await getAnalyticsOverview();

  const deviceData = analytics.deviceTypes.map((d, i) => ({
    label: d.label,
    value: d.value,
    color: ['#7B1E2B', '#111111', '#8C8C8C'][i] || '#EFE7DC',
  }));

  const trafficData = analytics.trafficSources.map((d, i) => ({
    label: d.label,
    value: d.value,
    color: ['#7B1E2B', '#111111', '#8C8C8C', '#EFE7DC'][i] || '#EAEAEA',
  }));


  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-editorial text-3xl font-bold text-primary-black dark:text-soft-cream">Analytics Overview</h1>
        <p className="text-xs text-muted-gray mt-1">Platform-wide engagement metrics and gallery performance</p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-gray">Total Views</span>
            <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="font-editorial text-3xl font-bold text-primary-black dark:text-soft-cream">
            {analytics.totalViews.toLocaleString()}
          </p>
          <p className="text-xs text-muted-gray mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            All time gallery views
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-gray">Total Downloads</span>
            <Download className="w-5 h-5 text-velvet-red" />
          </div>
          <p className="font-editorial text-3xl font-bold text-primary-black dark:text-soft-cream">
            {analytics.totalDownloads.toLocaleString()}
          </p>
          <p className="text-xs text-muted-gray mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            All time downloads
          </p>
        </Card>
      </div>

      {/* Most Viewed Gallery */}
      {analytics.mostViewedGallery && (
        <Card>
          <CardHeader>
            <CardTitle>Most Viewed Gallery</CardTitle>
            <CardDescription>Top-performing event this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 rounded-card bg-soft-cream dark:bg-neutral-800">
              {(analytics.mostViewedGallery as any).coverImageUrl && (
                <img
                  src={(analytics.mostViewedGallery as any).coverImageUrl}
                  alt={(analytics.mostViewedGallery as any).title}
                  className="w-16 h-16 rounded-button object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-editorial text-lg font-bold text-primary-black dark:text-soft-cream truncate">
                  {(analytics.mostViewedGallery as any).title}
                </h4>
                <p className="text-xs text-muted-gray">
                  {new Date((analytics.mostViewedGallery as any).eventDate).toLocaleDateString()} · {(analytics.mostViewedGallery as any).venue}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-velvet-red font-editorial">{analytics.mostDownloadedCount.toLocaleString()}</p>
                <p className="text-[11px] text-muted-gray">downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Visitor Traffic</CardTitle>
            <CardDescription>Gallery page views by month</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={analytics.monthlyVisitors.map((d) => ({ label: d.month, value: d.value }))} color="#7B1E2B" height={160} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
            <CardDescription>Mobile · Desktop · Tablet</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={deviceData} size={120} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>How guests find your galleries</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={trafficData} size={120} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Uploads</CardTitle>
            <CardDescription>Photos & videos added per month</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={analytics.monthlyUploads.map((d) => ({ label: d.month, value: d.value }))} color="#111111" height={160} />
          </CardContent>
        </Card>
      </div>

      {/* Google Analytics Placeholder */}
      <Card className="border-dashed border-2 border-warm-ivory dark:border-neutral-800">
        <div className="p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-soft-cream dark:bg-neutral-800 flex items-center justify-center mx-auto">
            <Globe className="w-6 h-6 text-muted-gray" />
          </div>
          <h4 className="font-editorial text-lg font-semibold text-primary-black dark:text-soft-cream">Google Analytics Integration</h4>
          <p className="text-xs text-muted-gray max-w-sm mx-auto">
            Connect your Google Analytics 4 property to unlock real-time audience insights, bounce rate, and geographic data.
          </p>
        </div>
      </Card>
    </div>
  );
}
