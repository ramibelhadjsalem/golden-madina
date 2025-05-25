import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { useTranslate } from "@/hooks/use-translate";

interface AdminChartsSectionProps {
  artifacts: any[];
  blogs: any[];
  services: any[];
  bookings: any[];
  portfolios?: any[];
}

const AdminChartsSection = ({
  artifacts,
  blogs,
  services,
  bookings,
  portfolios = []
}: AdminChartsSectionProps) => {
  const { t } = useTranslate();

  // Chart data calculations
  const chartData = useMemo(() => {
    if (!bookings || !artifacts || !blogs || !services) return null;

    // Monthly bookings trend (last 6 months)
    const monthlyBookings = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);

      const monthBookings = bookings.filter((booking: any) => {
        const bookingDate = new Date(booking.created_at);
        return isWithinInterval(bookingDate, { start: monthStart, end: monthEnd });
      }).length;

      monthlyBookings.push({
        month: format(monthDate, 'MMM'),
        bookings: monthBookings,
        revenue: monthBookings * 50 // Assuming average 50 TND per booking
      });
    }

    // Booking status distribution
    const confirmedCount = bookings.filter((booking: Booking) => booking.status === 'confirmed').length;
    const pendingCount = bookings.filter((booking: any) => booking.status === 'pending').length;
    const canceledCount = bookings.filter((booking: any) => booking.status === 'canceled').length;
    const totalBookings = confirmedCount + pendingCount + canceledCount;

    const bookingStatusData = [
      {
        status: 'Confirmed',
        count: confirmedCount,
        percentage: totalBookings > 0 ? Math.round((confirmedCount / totalBookings) * 100) : 0,
        fill: '#22c55e',
        icon: '✓'
      },
      {
        status: 'Pending',
        count: pendingCount,
        percentage: totalBookings > 0 ? Math.round((pendingCount / totalBookings) * 100) : 0,
        fill: '#f59e0b',
        icon: '⏳'
      },
      {
        status: 'Canceled',
        count: canceledCount,
        percentage: totalBookings > 0 ? Math.round((canceledCount / totalBookings) * 100) : 0,
        fill: '#ef4444',
        icon: '✕'
      }
    ];

    // Artifacts by category
    const artifactCategories = artifacts.reduce((acc: any, artifact: any) => {
      const category = artifact.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const artifactCategoryData = Object.entries(artifactCategories).map(([category, count]) => ({
      category,
      count,
      fill: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));

    // Blog posts by month (last 6 months)
    const monthlyBlogs = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);

      const monthBlogs = blogs.filter((blog: any) => {
        const blogDate = new Date(blog.created_at);
        return isWithinInterval(blogDate, { start: monthStart, end: monthEnd });
      }).length;

      monthlyBlogs.push({
        month: format(monthDate, 'MMM'),
        blogs: monthBlogs
      });
    }

    // Services revenue
    const serviceRevenue = services.map((service: any) => {
      const serviceBookings = bookings.filter((booking: any) => booking.service_id === service.id).length;
      return {
        name: service.name?.substring(0, 15) + (service.name?.length > 15 ? '...' : ''),
        revenue: serviceBookings * (service.price || 0),
        bookings: serviceBookings
      };
    }).sort((a: any, b: any) => b.revenue - a.revenue);

    return {
      monthlyBookings,
      bookingStatusData,
      artifactCategoryData,
      monthlyBlogs,
      serviceRevenue
    };
  }, [bookings, artifacts, blogs, services]);

  // Chart configurations
  const chartConfig = {
    bookings: {
      label: "Bookings",
      color: "hsl(var(--chart-1))",
    },
    revenue: {
      label: "Revenue (TND)",
      color: "hsl(var(--chart-2))",
    },
    blogs: {
      label: "Blog Posts",
      color: "hsl(var(--chart-3))",
    },
  };

  if (!chartData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading charts...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          📊 Analytics Dashboard
        </h2>
        <p className="text-muted-foreground mt-2">Real-time insights into your heritage platform</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Bookings Trend - Enhanced */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-lg">Monthly Bookings Trend</CardTitle>
                <p className="text-sm text-muted-foreground">Last 6 months performance</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {chartData.monthlyBookings.reduce((sum: number, item: any) => sum + item.bookings, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Total Bookings</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {chartData.monthlyBookings.reduce((sum: number, item: any) => sum + item.revenue, 0)} TND
                </div>
                <div className="text-xs text-muted-foreground">Total Revenue</div>
              </div>
            </div>
            <ChartContainer config={chartConfig} className="h-64">
              <LineChart data={chartData.monthlyBookings}>
                <defs>
                  <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#bookingsGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Booking Status Distribution - Enhanced */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-950">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-lg">Booking Status Overview</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {chartData.bookingStatusData.reduce((sum: number, item: any) => sum + item.count, 0)} total bookings
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Enhanced Status Cards */}
              <div className="grid grid-cols-1 gap-3">
                {chartData.bookingStatusData.map((status: any, index: number) => {
                  const total = chartData.bookingStatusData.reduce((sum: number, item: any) => sum + item.count, 0);
                  const percentage = total > 0 ? (status.count / total) * 100 : 0;
                  const icons = { 'Confirmed': '✅', 'Pending': '⏳', 'Canceled': '❌' };

                  return (
                    <div key={index} className="relative overflow-hidden bg-white/60 rounded-xl p-4 border border-white/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{icons[status.status as keyof typeof icons]}</div>
                          <div>
                            <div className="font-semibold text-gray-800">{status.status}</div>
                            <div className="text-sm text-gray-600">{status.count} bookings</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{ color: status.fill }}>
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: status.fill
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modern Donut Chart */}
              <div className="relative">
                <ChartContainer config={chartConfig} className="h-48">
                  <PieChart>
                    <Pie
                      data={chartData.bookingStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="status"
                    >
                      {chartData.bookingStatusData.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill}
                          stroke={entry.fill}
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ChartContainer>
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {chartData.bookingStatusData.reduce((sum: number, item: any) => sum + item.count, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Artifacts by Category - Enhanced */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v0m14-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v2m14 0h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-14 0H3a2 2 0 01-2-2v-6a2 2 0 012-2h2" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-lg">Heritage Collection</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {chartData.artifactCategoryData.reduce((sum: number, item: any) => sum + item.count, 0)} artifacts across categories
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Category Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-3 bg-white/50 rounded-lg">
                  <div className="text-xl font-bold text-amber-600">
                    {chartData.artifactCategoryData.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Categories</div>
                </div>
                <div className="text-center p-3 bg-white/50 rounded-lg">
                  <div className="text-xl font-bold text-orange-600">
                    {Math.max(...chartData.artifactCategoryData.map((item: any) => item.count))}
                  </div>
                  <div className="text-xs text-muted-foreground">Largest Category</div>
                </div>
              </div>

              <ChartContainer config={chartConfig} className="h-64">
                <BarChart data={chartData.artifactCategoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="artifactGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="url(#artifactGradient)"
                    radius={[4, 4, 0, 0]}
                    stroke="#f59e0b"
                    strokeWidth={1}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Blog Posts Trend - Enhanced */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-950">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-lg">Content Publishing</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {chartData.monthlyBlogs.reduce((sum: number, item: any) => sum + item.blogs, 0)} posts in last 6 months
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Blog Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-3 bg-white/50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">
                    {Math.round(chartData.monthlyBlogs.reduce((sum: number, item: any) => sum + item.blogs, 0) / 6)}
                  </div>
                  <div className="text-xs text-muted-foreground">Avg/Month</div>
                </div>
                <div className="text-center p-3 bg-white/50 rounded-lg">
                  <div className="text-xl font-bold text-pink-600">
                    {Math.max(...chartData.monthlyBlogs.map((item: any) => item.blogs))}
                  </div>
                  <div className="text-xs text-muted-foreground">Peak Month</div>
                </div>
              </div>

              <ChartContainer config={chartConfig} className="h-64">
                <AreaChart data={chartData.monthlyBlogs}>
                  <defs>
                    <linearGradient id="blogGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="blogs"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fill="url(#blogGradient)"
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: '#8b5cf6', strokeWidth: 2, fill: '#ffffff' }}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Services Revenue - Enhanced */}
        <Card className="lg:col-span-2 border-0 shadow-lg bg-gradient-to-br from-rose-50 to-red-100 dark:from-rose-950 dark:to-red-950">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-lg">Revenue by Service</CardTitle>
                  <p className="text-sm text-muted-foreground">Performance across all services</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-rose-600">
                  {chartData.serviceRevenue.reduce((sum: number, item: any) => sum + item.revenue, 0)} TND
                </div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Top Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {chartData.serviceRevenue.slice(0, 3).map((service: any, index: number) => {
                  const colors = ['bg-rose-500', 'bg-orange-500', 'bg-amber-500'];
                  const textColors = ['text-rose-600', 'text-orange-600', 'text-amber-600'];
                  const medals = ['🥇', '🥈', '🥉'];

                  return (
                    <div key={index} className="bg-white/60 rounded-xl p-4 border border-white/20">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl">{medals[index]}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 text-sm">{service.name}</div>
                          <div className="text-xs text-gray-600">{service.bookings} bookings</div>
                        </div>
                      </div>
                      <div className={`text-xl font-bold ${textColors[index]}`}>
                        {service.revenue} TND
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${colors[index]} transition-all duration-1000 ease-out`}
                          style={{
                            width: `${(service.revenue / Math.max(...chartData.serviceRevenue.map((s: any) => s.revenue))) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Enhanced Bar Chart */}
              <ChartContainer config={chartConfig} className="h-80">
                <BarChart data={chartData.serviceRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    label={{ value: 'Revenue (TND)', angle: -90, position: 'insideLeft' }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="url(#revenueGradient)"
                    radius={[6, 6, 0, 0]}
                    stroke="#f43f5e"
                    strokeWidth={1}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminChartsSection;
