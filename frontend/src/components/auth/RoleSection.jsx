import React from "react";

function RoleCard({ title, subtitle, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer border rounded-xl p-4 text-center transition ${
        selected
          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-600/30"
          : "border-app hover:border-blue-400 dark:hover:border-blue-500 bg-surface"
      }`}
    >
      <p className="font-medium text-primary">{title}</p>
      <p className="text-secondary text-sm">{subtitle}</p>
    </div>
  );
}

export default function RoleSection({ role, setRole }) {
  return (
    <div>
      <p className="text-sm font-medium mb-2 text-primary">I want to</p>
      <div className="grid grid-cols-2 gap-4">
        <RoleCard
          title="Find Jobs"
          subtitle="Job Seeker"
          selected={role === "seeker"}
          onClick={() => setRole("seeker")}
        />
        <RoleCard
          title="Hire Talent"
          subtitle="Recruiter"
          selected={role === "recruiter"}
          onClick={() => setRole("recruiter")}
        />
      </div>
    </div>
  );
}
