"use client";

import CreateTeamComponent from "../components/CreateTeamComponent";
import Myteams from "../components/Myteams";
import MyTasks from "../components/MyTasks";
import TeamAnalytics from "../components/TeamAnalytics";
import ProductivityAnalytics from "../components/Productivity";

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full bg-zinc-950 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-10">

        <CreateTeamComponent />
        <Myteams />
        <MyTasks />
        <ProductivityAnalytics></ProductivityAnalytics>
      </div>
    </div>
  );
}
