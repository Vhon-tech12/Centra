"use client";

import React from "react";

const CustomToolbar = (toolbar: any) => {
  const goToBack = () => toolbar.onNavigate("PREV");
  const goToNext = () => toolbar.onNavigate("NEXT");
  const goToToday = () => toolbar.onNavigate("TODAY");

  return (
    <div className="flex items-center justify-between px-2 mb-3">
      <div className="flex items-center gap-2">
        <button
          onClick={goToToday}
          className="px-3 py-1.5 text-sm rounded-lg bg-[#1b1f29] border border-white/10 hover:bg-[#222736]"
        >
          Today
        </button>
        <button
          onClick={goToBack}
          className="px-3 py-1.5 text-sm rounded-lg bg-[#1b1f29] border border-white/10 hover:bg-[#222736]"
        >
          ‹
        </button>
        <button
          onClick={goToNext}
          className="px-3 py-1.5 text-sm rounded-lg bg-[#1b1f29] border border-white/10 hover:bg-[#222736]"
        >
          ›
        </button>

        <h2 className="ml-3 text-lg font-semibold">{toolbar.label}</h2>
      </div>

      <div className="flex gap-2">
        {["month", "week", "day"].map((view) => (
          <button
            key={view}
            onClick={() => toolbar.onView(view)}
            className={`px-3 py-1.5 text-sm rounded-lg capitalize ${
              toolbar.view === view
                ? "bg-blue-500"
                : "bg-[#1b1f29] border border-white/10 hover:bg-[#222736]"
            }`}
          >
            {view}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomToolbar;
