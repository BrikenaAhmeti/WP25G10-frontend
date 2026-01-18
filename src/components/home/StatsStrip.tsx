"use client";

import { motion } from "framer-motion";
import { MapPin, Zap, AlertTriangle, Timer } from "lucide-react";

export function StatsStrip({
  computed,
  isFetching,
}: {
  computed: {
    flightsToday: number;
    delayed: number;
    gates: number;
    arrivals: number;
    departures: number;
    next60: number;
  };
  isFetching: boolean;
}) {
  const cards = [
    {
      label: "Flights today",
      value: computed.flightsToday,
      sub: `${computed.departures} departures · ${computed.arrivals} arrivals`,
      icon: <Zap size={16} className="text-white/60" />,
    },
    {
      label: "Delayed",
      value: computed.delayed,
      sub: `${computed.next60} scheduled in next 60 min`,
      icon: <AlertTriangle size={16} className="text-white/60" />,
    },
    {
      label: "Active gates",
      value: computed.gates,
      sub: isFetching ? "Updating…" : "Live snapshot",
      icon: <MapPin size={16} className="text-white/60" />,
    },
    {
      label: "Next 60 min",
      value: computed.next60,
      sub: "Window focus",
      icon: <Timer size={16} className="text-white/60" />,
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs text-white/60">{c.label}</div>
            {c.icon}
          </div>
          <div className="mt-2 text-3xl font-semibold">{c.value}</div>
          <div className="mt-1 text-xs text-white/60">{c.sub}</div>
        </motion.div>
      ))}
    </div>
  );
}