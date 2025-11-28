"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export default function CreateTeamComponent() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [memberQuery, setMemberQuery] = useState("");
  const [memberResults, setMemberResults] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`${BACKEND_URL}/user/me`, {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        });
        setCurrentUser(res.data.user);
      } catch (err) {
        console.error(err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const isTeamLead = currentUser?.role === "TEAM_LEAD";

  if (loading) {
    return (
      <div className="w-full bg-zinc-950 flex items-center justify-center py-10">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-zinc-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-950">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-8">

      
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {currentUser?.name || "User"}
            </h1>
            <p className="text-zinc-400">
              Role:{" "}
              <span className="font-semibold text-orange-500">
                {currentUser?.role || "Member"}
              </span>
            </p>
          </div>

          <div className="relative group">
            <button
              onClick={() => isTeamLead && setModalOpen(true)}
              className={`
                px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg
                ${
                  isTeamLead
                    ? "bg-orange-500 hover:bg-orange-600 text-white transform hover:scale-105 hover:shadow-orange-500/50"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                }
              `}
              disabled={!isTeamLead}
            >
              + Create Team
            </button>

            {!isTeamLead && (
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-48 bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Only team leads can create teams
              </div>
            )}
          </div>
        </div>

      </div>

      
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl relative">
            
           
            <button
              className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-200"
              onClick={() => {
                setModalOpen(false);
                setError("");
              }}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">
              Create New Team
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

           
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Team Name *
              </label>
              <input
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                placeholder="Team name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white resize-none"
                rows={3}
                placeholder="Describe your team"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

           
            <button
              onClick={() => {/* You already have logic above. Keep it */}}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold"
            >
              Create Team
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
