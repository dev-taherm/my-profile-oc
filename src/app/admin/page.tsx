"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Eye,
  Users,
  Globe,
  Plus,
  BarChart3,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardData {
  totalViews: number;
  uniqueVisitors: number;
  mostPopularPage: string;
  daily: { date: string; views: number; unique: number }[];
  topPages: { path: string; views: number; unique: number }[];
  topReferrers: { source: string; views: number }[];
  browsers: { name: string; count: number }[];
  devices: { name: string; count: number }[];
  countries: { name: string; count: number }[];
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [period, setPeriod] = useState("30d");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics/dashboard?period=${period}`);
        if (!cancelled && res.ok) setData(await res.json());
      } catch {}
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [period]);

  const deviceIcon = (name: string) => {
    if (name === "Mobile") return <Smartphone className="h-4 w-4" />;
    if (name === "Tablet") return <Tablet className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name || "Admin"}
          </p>
        </div>
        <div className="flex gap-3">
          <Button render={<Link href="/admin/projects/new" />}>
            <Plus className="me-2 h-4 w-4" />
            New Project
          </Button>
          <Button variant="outline" render={<Link href="/admin/blog/new" />}>
            <Plus className="me-2 h-4 w-4" />
            New Post
          </Button>
        </div>
      </div>

      {/* Period selector */}
      <div className="mb-6">
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
            <TabsTrigger value="90d">90 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : data?.totalViews ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Visitors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : data?.uniqueVisitors ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Most Popular Page
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold truncate">
              {loading ? "—" : data?.mostPopularPage ?? "-"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily visits chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Daily Visits
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Loading...
            </div>
          ) : data?.daily?.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.daily}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v: string) => v.slice(5)}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip
                    labelFormatter={(v) => String(v)}
                    formatter={(value, name) => [
                      value,
                      name === "views" ? "Views" : "Unique",
                    ]}
                  />
                  <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="unique" fill="hsl(var(--primary) / 0.3)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No data yet
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : data?.topPages?.length ? (
              <div className="space-y-3">
                {data.topPages.map((p) => (
                  <div key={p.path} className="flex items-center justify-between text-sm">
                    <span className="truncate font-mono text-xs">{p.path}</span>
                    <div className="flex gap-3 text-muted-foreground shrink-0 ms-3">
                      <span>{p.views} views</span>
                      <span>{p.unique} unique</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top Referrers</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : data?.topReferrers?.length ? (
              <div className="space-y-3">
                {data.topReferrers.map((r) => (
                  <div key={r.source} className="flex items-center justify-between text-sm">
                    <span className="truncate text-xs">{r.source}</span>
                    <span className="text-muted-foreground shrink-0 ms-3">{r.views}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No referrer data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Browsers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Browsers</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.browsers?.length ? (
              <div className="space-y-2">
                {data.browsers.map((b) => (
                  <div key={b.name} className="flex items-center justify-between text-sm">
                    <span>{b.name}</span>
                    <span className="text-muted-foreground">{b.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No data</p>
            )}
          </CardContent>
        </Card>

        {/* Devices */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Devices</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.devices?.length ? (
              <div className="space-y-2">
                {data.devices.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      {deviceIcon(d.name)}
                      {d.name}
                    </span>
                    <span className="text-muted-foreground">{d.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No data</p>
            )}
          </CardContent>
        </Card>

        {/* Countries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.countries?.length ? (
              <div className="space-y-2">
                {data.countries.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-sm">
                    <span>{c.name}</span>
                    <span className="text-muted-foreground">{c.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No geo data yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
