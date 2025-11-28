"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export default function MyTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  async function fetchTasks() {
    try {
      const res = await axios.get(`${BACKEND_URL}/task/my`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      });
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function updateStatus(taskId: string, newStatus: string) {
    setUpdating(taskId);

    try {
      await axios.put(
        `${BACKEND_URL}/task/${taskId}/status`,
        { status: newStatus },
        {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        }
      );

      // Refresh tasks after update
      fetchTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  }

  if (loading) {
    return (
      <div className="w-full bg-zinc-950 flex items-center justify-center py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-zinc-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="w-full bg-zinc-950 py-10 text-center">
        <p className="text-zinc-400 text-lg">No tasks assigned to you yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-950">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mt-10">
        <h1 className="text-2xl font-bold text-white mb-6">My Tasks</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 shadow hover:shadow-xl transition-all"
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                {task.title}
              </h3>

              <p className="text-zinc-400 text-sm mb-4 line-clamp-3">
                {task.description}
              </p>

              {/* Current Status */}
              <p className="text-zinc-400 text-sm mb-2">Status:</p>

              <select
                className="w-full bg-zinc-900 border border-zinc-700 text-zinc-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                value={task.status}
                disabled={updating === task.id}
                onChange={(e) => updateStatus(task.id, e.target.value)}
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>

              {/* Footer */}
              <p className="text-xs text-zinc-500 mt-4 border-t border-zinc-700 pt-4">
                Assigned on: {new Date(task.createdAt).toLocaleDateString()}
              </p>

              {task.startedAt && (
                <p className="text-xs text-orange-400 mt-1">
                  Started: {new Date(task.startedAt).toLocaleString()}
                </p>
              )}

              {task.completedAt && (
                <p className="text-xs text-green-400 mt-1">
                  Completed: {new Date(task.completedAt).toLocaleString()}
                </p>
              )}

              {updating === task.id && (
                <p className="text-orange-400 text-xs mt-3">Updating...</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
