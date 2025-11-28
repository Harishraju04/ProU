"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";

export default function Myteams() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await axios.get(`${BACKEND_URL}/team/my`, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        });

        setTeams(res.data.teams);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-zinc-950 flex items-center justify-center py-10">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-zinc-400">Loading teams...</p>
        </div>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="w-full bg-zinc-950 text-center py-16">
        <p className="text-zinc-400 text-lg">You are not part of any teams yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-950">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

        <h1 className="text-2xl font-bold text-white mb-6">My Teams</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              onClick={() => router.push(`team/${team.id}`)}
              className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 hover:border-orange-500/40 hover:shadow-xl transition cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-white mb-2">
                {team.name}
              </h2>

              <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                {team.description}
              </p>

              <span
                className={`inline-block px-3 py-1 text-sm rounded-lg ${
                  team.isLead
                    ? "bg-orange-500/20 text-orange-500 border border-orange-500/30"
                    : "bg-zinc-700 text-zinc-300 border border-zinc-600"
                }`}
              >
                {team.isLead ? "Team Lead" : "Member"}
              </span>

              <p className="text-xs text-zinc-500 mt-4 border-t border-zinc-700 pt-4">
                Joined: {new Date(team.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
