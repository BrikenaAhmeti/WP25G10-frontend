"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Search,
  RefreshCw,
  X,
  ExternalLink,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { FlightDto, Board } from "@/types/flight";
import { fetchFlights } from "@/lib/fetchFlights";
import { useToast } from "@/components/ui/toast";

type Focus = "all" | "next60" | "delayed";

function formatTime(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatDateTimeCompact(iso?: string) {
  if (!iso) return { date: "-", time: "-" };
  return { date: formatDate(iso), time: formatTime(iso) };
}

function flightAwareUrl(f: FlightDto) {
  // https://www.flightaware.com/live/flight/flight_code
  const code = (f.flightCode || f.flightNumber || "").replace(/\s+/g, "");
  return `https://www.flightaware.com/live/flight/${encodeURIComponent(code)}`;
}

function pickFocusTime(f: FlightDto, board: Board) {
  // For "next60" filtering: use arrival time if board is arrivals, else departure time
  if (board === "arrivals") return f.arrivalDateTime ?? f.arrivalTime;
  return f.departureDateTime ?? f.departureTime;
}

export function FlightsBoard({ focus }: { focus: Focus }) {
  const { push } = useToast();

  const [board, setBoard] = useState<Board>("arrivals");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<string>("");
  const [delayedOnly, setDelayedOnly] = useState(false);

  const delayedActive = delayedOnly || focus === "delayed";
  const hasAnyFilter = !!search.trim() || !!date || delayedOnly;

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["flights", board, search, date, delayedActive, focus],
    queryFn: () =>
      fetchFlights({
        board,
        search,
        date: date || undefined,
        delayedOnly: delayedActive,
      }),
    staleTime: 10_000,
    refetchInterval: 30_000,
  });

  const raw = useMemo(() => data ?? [], [data]);

  const rows = useMemo(() => {
    if (focus !== "next60") return raw;

    const now = Date.now();
    const to = now + 60 * 60 * 1000;

    return raw.filter((f) => {
      const t = new Date(pickFocusTime(f, board) ?? "").getTime();
      return Number.isFinite(t) && t >= now && t <= to;
    });
  }, [raw, focus, board]);

  function clearAll() {
    setSearch("");
    setDate("");
    setDelayedOnly(false);
  }

  async function onSave(f: FlightDto) {
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flightId: f.id }),
    });

    if (res.status === 401) {
      push({
        type: "info",
        title: "Login required",
        message: "Sign in to save favorites.",
      });
      window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent(
        "/#flights"
      )}`;
      return;
    }

    if (!res.ok) {
      const msg = await res.text().catch(() => "Failed to save favorite");
      push({ type: "error", title: "Couldn’t save", message: msg });
      return;
    }

    push({ type: "success", title: "Saved to favorites", message: f.flightNumber });
  }

  return (
    <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Live Flight Board
          </h2>
          <p className="text-sm text-white/60">
            {isFetching ? "Updating…" : "Arrivals & departures — search and filter."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-2xl border border-white/15 bg-black/20 p-1">
            <button
              onClick={() => setBoard("arrivals")}
              className={`rounded-xl px-4 py-2 text-sm ${board === "arrivals"
                  ? "bg-white text-black"
                  : "text-white/85 hover:bg-white/10"
                }`}
            >
              Arrivals
            </button>

            <button
              onClick={() => setBoard("departures")}
              className={`rounded-xl px-4 py-2 text-sm ${board === "departures"
                  ? "bg-white text-black"
                  : "text-white/85 hover:bg-white/10"
                }`}
            >
              Departures
            </button>
          </div>

          <button
            onClick={() => refetch()}
            className="rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-white hover:bg-white/10"
            title="Refresh"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          </button>

          {hasAnyFilter && (
            <button
              onClick={clearAll}
              className="rounded-2xl border border-white/15 bg-black/20 px-4 py-2 text-sm text-white/85 hover:bg-white/10"
              title="Clear all filters"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 grid gap-2 lg:grid-cols-12">
        <div className="lg:col-span-7 flex items-center gap-2 rounded-2xl border border-white/15 bg-black/20 px-3 py-2">
          <Search size={16} className="text-white/60" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search flight no, origin, destination…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
          />
          {search.trim() && (
            <button
              onClick={() => setSearch("")}
              className="rounded-xl p-2 text-white/60 hover:bg-white/10 hover:text-white"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="lg:col-span-3">
          <div className="relative">
            <Calendar
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-black/20 py-2 pl-10 pr-10 text-sm text-white/90"
            />
            {date && (
              <button
                onClick={() => setDate("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl p-2 text-white/60 hover:bg-white/10 hover:text-white"
                title="Clear date"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDelayedOnly((v) => !v)}
          className={`lg:col-span-2 flex items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-sm transition ${delayedOnly
              ? "border-white/25 bg-white text-black"
              : "border-white/15 bg-black/20 text-white/85 hover:bg-white/10"
            }`}
          title="Show delayed only"
        >
          <span className="flex items-center gap-2">
            <AlertTriangle
              size={16}
              className={delayedOnly ? "text-black" : "text-white/60"}
            />
            Delayed
          </span>

          <span
            className={`h-5 w-9 rounded-full p-0.5 ${delayedOnly ? "bg-black/20" : "bg-white/10"
              }`}
          >
            <span
              className={`block h-4 w-4 rounded-full bg-white transition-transform ${delayedOnly ? "translate-x-4 bg-black" : "translate-x-0 bg-white"
                }`}
            />
          </span>
        </button>
      </div>

      {/* TABLE (scrollable on small screens) */}
      <div className="mt-6 rounded-2xl border border-white/10 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[980px]">
            <div className="grid grid-cols-15 bg-white/5 px-4 py-3 text-xs text-white/60">
              <div className="col-span-2">Dep (date/time)</div>
              <div className="col-span-2">Arr (date/time)</div>
              <div className="col-span-2">Flight</div>
              <div className="col-span-4">Route</div>
              <div className="col-span-2">Gate</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-right">Details</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            <div className="divide-y divide-white/10">
              {isLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-15 px-4 py-4 animate-pulse">
                    <div className="col-span-2 h-4 rounded bg-white/10" />
                    <div className="col-span-2 mx-3 h-4 rounded bg-white/10" />
                    <div className="col-span-2 mx-3 h-4 rounded bg-white/10" />
                    <div className="col-span-4 mx-3 h-4 rounded bg-white/10" />
                    <div className="col-span-2 mx-3 h-4 rounded bg-white/10" />
                    <div className="col-span-1 mx-3 h-4 rounded bg-white/10" />
                    <div className="col-span-1 mx-3 h-4 rounded bg-white/10" />
                    <div className="col-span-1 ml-auto h-8 w-20 rounded bg-white/10" />
                  </div>
                ))}

              {isError && (
                <div className="px-4 py-10 text-center text-sm text-red-300">
                  Failed to load flights. {(error as Error)?.message}
                </div>
              )}

              {!isLoading &&
                !isError &&
                rows.map((f, idx) => {
                  const dep = formatDateTimeCompact(f.departureDateTime ?? f.departureTime);
                  const arr = formatDateTimeCompact(f.arrivalDateTime ?? f.arrivalTime);

                  const route =
                    board === "arrivals"
                      ? `${f.originAirport} → Prishtina`
                      : `Prishtina → ${f.destinationAirport}`;

                  return (
                    <motion.div
                      key={f.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.015 }}
                      className="grid grid-cols-15 items-center px-4 py-4 text-sm"
                    >
                      <div className="col-span-2">
                        <div className="font-mono text-white/90">{dep.time}</div>
                        <div className="text-xs text-white/60">{dep.date}</div>
                      </div>

                      <div className="col-span-2">
                        <div className="font-mono text-white/90">{arr.time}</div>
                        <div className="text-xs text-white/60">{arr.date}</div>
                      </div>

                      <div className="col-span-2">
                        <div className="font-semibold">{f.flightNumber}</div>
                        <div className="text-xs text-white/60">
                          {f.airlineName} ({f.airlineCode})
                        </div>
                      </div>

                      <div className="col-span-4 text-white/80">{route}</div>

                      <div className="col-span-2 text-white/70">
                        {f.gateTerminal ?? "-"}-{f.gateCode ?? "-"}
                      </div>

                      <div className="col-span-1">
                        <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-xs">
                          {f.status}
                        </span>
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <a
                          href={flightAwareUrl(f)}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl border border-white/15 bg-white/5 p-2 text-white hover:bg-white/10"
                          title="Open FlightAware"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <button
                          onClick={() => onSave(f)}
                          className="rounded-xl border border-white/15 bg-white/5 p-2 hover:bg-white/10"
                          title="Save flight"
                        >
                          <Star size={16} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}

              {!isLoading && !isError && !rows.length && (
                <div className="px-4 py-10 text-center text-sm text-white/60">
                  No flights found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}