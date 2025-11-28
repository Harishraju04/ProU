"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import TeamAnalytics from "./TeamAnalytics";

type Member = { id: string; name: string; email: string; isLead: boolean };
type Task = {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  dueDate?: string | null;
  assignee?: { id: string; name: string; email: string } | null;
  creator?: { id: string; name: string } | null;
  createdAt: string;
};

export default function TeamDetails({ teamId }: { teamId: string }) {
  const [team, setTeam] = useState<{ id: string; name: string; description?: string } | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string>("");

  async function fetchTeam() {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/team/details/${teamId}`, {
       headers:{
        authorization: localStorage.getItem('token')
       }
      });
      const { team: t, members: m, tasks: ts } = res.data;
      setTeam(t);
      setMembers(m);
      setTasks(ts);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch team details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTeam();
  }, [teamId]);

  function toISOStringLocal(localDatetime: string) {
    if (!localDatetime) return null;
    const d = new Date(localDatetime);
    return d.toISOString();
  }

  async function handleCreateTask() {
    if (!assigneeId) {
      alert("Select an assignee");
      return;
    }
    if (!title.trim()) {
      alert("Title required");
      return;
    }

    try {
      setCreating(true);

      const body = {
        title,
        description,
        priority,
        assigneeId,
        dueDate: toISOStringLocal(dueDate),
      };

      const res = await axios.post(`${BACKEND_URL}/team/${teamId}/task`, body, {
        headers:{
        authorization: localStorage.getItem('token')
       }
      });

      alert("Task created");
      await fetchTeam();

      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setAssigneeId(null);
      setDueDate("");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to create task");
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div className=" bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-zinc-400 font-medium">Loading team...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className=" bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400 text-lg">Team not found</p>
      </div>
    );
  }

  return (
    <div className=" bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-6 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-2">{team.name}</h1>
          {team.description && <p className="text-zinc-400">{team.description}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Members</h2>
            <div className="space-y-3">
              {members.map((m) => (
                <div key={m.id} className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate">{m.name}</div>
                      <div className="text-xs text-zinc-400 truncate">{m.email}</div>
                    </div>
                    <span className={`ml-2 text-xs px-2 py-1 rounded-lg font-medium whitespace-nowrap ${m.isLead ? "bg-orange-500/20 text-orange-500 border border-orange-500/30" : "bg-zinc-700 text-zinc-300 border border-zinc-600"}`}>
                      {m.isLead ? "Lead" : "Member"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Tasks</h2>

            <div className="mb-6 bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-4">Create Task</h3>

              <div className="space-y-4">
                <input
                  placeholder="Task title"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  placeholder="Task description"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select 
                    value={priority} 
                    onChange={(e) => setPriority(e.target.value as any)} 
                    className="px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  >
                    <option value="LOW">Low Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="HIGH">High Priority</option>
                  </select>

                  <select 
                    value={assigneeId ?? ""} 
                    onChange={(e) => setAssigneeId(e.target.value)} 
                    className="px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select assignee</option>
                    {members.map((m) => (
                      <option value={m.id} key={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="datetime-local"
                    className="px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <button
                  className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-lg ${creating ? "bg-zinc-700 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 hover:shadow-orange-500/50"}`}
                  onClick={handleCreateTask}
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create Task"}
                </button>
              </div>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-700">
                  <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-zinc-400">No tasks yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((t) => (
                  <div key={t.id} className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="font-semibold text-white text-lg">{t.title}</div>
                        {t.description && <div className="text-sm text-zinc-400 mt-1">{t.description}</div>}
                      </div>
                      <div className="ml-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${t.priority === "HIGH" ? "bg-red-500/20 text-red-400 border border-red-500/30" : t.priority === "MEDIUM" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "bg-zinc-700 text-zinc-300 border border-zinc-600"}`}>
                          {t.priority}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="text-zinc-400">
                        <span className="text-zinc-500">Assignee:</span>{" "}
                        <span className="text-white">{t.assignee ? t.assignee.name : "Unassigned"}</span>
                      </div>
                      <div className="text-zinc-400">
                        <span className="text-zinc-500">Status:</span>{" "}
                        <span className="text-white">{t.status}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-zinc-700 flex justify-between items-center text-xs text-zinc-500">
                      <span>Created: {new Date(t.createdAt).toLocaleDateString()}</span>
                      {t.dueDate && (
                        <span>Due: {new Date(t.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
         <TeamAnalytics teamId={teamId}></TeamAnalytics>
      </div>
    </div>
  );
}