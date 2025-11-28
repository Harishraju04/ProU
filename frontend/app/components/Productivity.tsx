"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export default function ProductivityAnalytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(`${BACKEND_URL}/analytics/productivity/me`, {
        headers: { authorization: localStorage.getItem("token") || "" },
      });
      setData(res.data);
    }
    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="w-full bg-zinc-950 flex items-center justify-center py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-zinc-400">Loading productivity analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-950 mt-10">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">

        <h2 className="text-2xl font-bold text-white mb-6">Your Productivity</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <DarkCard
            label="Completed (Last 7 Days)"
            value={data.completedLast7Days}
          />
          <DarkCard
            label="Total Completed"
            value={data.totalCompleted}
          />
          <DarkCard
            label="Avg Completion Time (hrs)"
            value={(data.averageCompletionTimeMs / (1000 * 60 * 60)).toFixed(1)}
          />
        </div>
      </div>
    </div>
  );
}

function DarkCard({ label, value }: any) {
  return (
    <div className="p-6 bg-zinc-800 border border-zinc-700 rounded-2xl shadow-xl">
      <p className="text-zinc-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
