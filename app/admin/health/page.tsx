"use client";

import { useState } from "react";
import {
  HeartPulse,
  Server,
  Database,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  Mail,
  FileText,
  ExternalLink,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

export default function HealthAndSupportPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const systemHealth = [
    {
      name: "API Server",
      status: "healthy",
      icon: Server,
      uptime: "99.98%",
      responseTime: "45ms",
    },
    {
      name: "Database",
      status: "healthy",
      icon: Database,
      uptime: "99.99%",
      responseTime: "12ms",
    },
    {
      name: "WebSocket Server",
      status: "healthy",
      icon: Activity,
      uptime: "99.95%",
      responseTime: "8ms",
    },
    {
      name: "Storage Service",
      status: "warning",
      icon: Server,
      uptime: "98.50%",
      responseTime: "120ms",
    },
  ];

  const recentIssues = [
    {
      id: 1,
      title: "Slow image upload speeds",
      status: "resolved",
      date: "2 hours ago",
      severity: "medium",
    },
    {
      id: 2,
      title: "Database connection timeout",
      status: "investigating",
      date: "5 hours ago",
      severity: "high",
    },
    {
      id: 3,
      title: "Email notification delays",
      status: "resolved",
      date: "1 day ago",
      severity: "low",
    },
  ];

  const supportResources = [
    {
      title: "Documentation",
      description: "Complete admin guide and API documentation",
      icon: FileText,
      link: "#",
    },
    {
      title: "Contact Support",
      description: "Get help from our support team",
      icon: Mail,
      link: "#",
    },
    {
      title: "FAQ",
      description: "Frequently asked questions and answers",
      icon: HelpCircle,
      link: "#",
    },
    {
      title: "System Status",
      description: "Check real-time system status",
      icon: Activity,
      link: "#",
    },
  ];

  const metrics = [
    { label: "Total Users", value: "12,483", change: "+12%", trend: "up" },
    { label: "Active Listings", value: "3,721", change: "+8%", trend: "up" },
    { label: "Support Tickets", value: "24", change: "-5%", trend: "down" },
    { label: "Avg Response Time", value: "2.3h", change: "-15%", trend: "down" },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <HeartPulse className="w-8 h-8 text-[#9b111e]" />
            Health & Support
          </h1>
          <p className="text-slate-500 mt-1">
            Monitor system health and access support resources
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {metric.label}
              </p>
              <TrendingUp
                className={`w-4 h-4 ${
                  metric.trend === "up" ? "text-green-500" : "text-blue-500"
                }`}
              />
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</p>
            <p
              className={`text-xs font-medium ${
                metric.trend === "up" ? "text-green-600" : "text-blue-600"
              }`}
            >
              {metric.change} from last week
            </p>
          </div>
        ))}
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg border border-slate-200 mb-8">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">System Health Status</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time monitoring of all system components
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemHealth.map((system, idx) => {
              const Icon = system.icon;
              const isHealthy = system.status === "healthy";
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 ${
                    isHealthy
                      ? "border-green-200 bg-green-50"
                      : "border-amber-200 bg-amber-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isHealthy ? "bg-green-100" : "bg-amber-100"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            isHealthy ? "text-green-600" : "text-amber-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{system.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {isHealthy ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          <span
                            className={`text-xs font-medium ${
                              isHealthy ? "text-green-700" : "text-amber-700"
                            }`}
                          >
                            {isHealthy ? "Operational" : "Degraded Performance"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Uptime</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {system.uptime}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Response Time</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {system.responseTime}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Issues */}
      <div className="bg-white rounded-lg border border-slate-200 mb-8">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Recent Issues</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Track and monitor system incidents
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {recentIssues.map((issue) => (
            <div key={issue.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900">{issue.title}</h3>
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded ${
                        issue.severity === "high"
                          ? "bg-red-100 text-red-700"
                          : issue.severity === "medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {issue.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {issue.date}
                    </div>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded ${
                        issue.status === "resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {issue.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support Resources */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Support Resources</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Access documentation and get help
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportResources.map((resource, idx) => {
              const Icon = resource.icon;
              return (
                <a
                  key={idx}
                  href={resource.link}
                  className="group p-4 rounded-lg border border-slate-200 hover:border-[#9b111e] hover:bg-red-50 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-slate-100 group-hover:bg-[#9b111e]/10 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                      <Icon className="w-5 h-5 text-slate-600 group-hover:text-[#9b111e] transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 group-hover:text-[#9b111e] transition-colors">
                          {resource.title}
                        </h3>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#9b111e] transition-colors" />
                      </div>
                      <p className="text-sm text-slate-500">{resource.description}</p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
