"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export default function TeamAnalytics({ teamId }: { teamId: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(`${BACKEND_URL}/analytics/team/${teamId}`, {
        headers: { authorization: localStorage.getItem("token") || "" },
      });
      setData(res.data);
    }
    fetchData();
  }, [teamId]);

  if (!data) {
    return (
      <div className="w-full bg-zinc-950 flex items-center justify-center py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-zinc-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-950 mt-10">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">

        <h2 className="text-2xl font-bold text-white mb-6">Team Analytics</h2>

        {/* Basic Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <DarkCard label="Total Tasks" value={data.totalTasks} />
          <DarkCard label="Members" value={data.membersCount} />
          <DarkCard label="Overdue Tasks" value={data.overdue} highlight />
        </div>

        <h3 className="text-xl font-semibold text-white mb-4">
          Task Status Breakdown
        </h3>

        {/* Status Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {data.tasksByStatus.map((t: any) => (
            <DarkCard key={t.status} label={t.status} value={t._count.status} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DarkCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`
        p-6 rounded-2xl border shadow-xl transition-all
        ${
          highlight
            ? "bg-red-500/10 border-red-500/30 text-red-400"
            : "bg-zinc-800 border-zinc-700 text-white"
        }
      `}
    >
      <p className="text-zinc-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
