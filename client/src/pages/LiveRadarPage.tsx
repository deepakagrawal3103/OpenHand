import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { getSocket } from '../services/socket';
import {
  Radio,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  MapPin,
  ExternalLink,
  Plus,
} from 'lucide-react';

export const LiveRadarPage: React.FC = () => {
  const [liveData, setLiveData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPin, setSelectedPin] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fetchLive = async () => {
    try {
      const data = await api.getLiveData();
      setLiveData(data);
      if (data.requests && data.requests.length > 0) {
        setSelectedPin(data.requests[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLive();

    const socket = getSocket();
    socket.emit('join:live');

    const handleNewRequest = () => {
      fetchLive();
    };

    socket.on('live:request_created', handleNewRequest);
    socket.on('task:updated', handleNewRequest);

    return () => {
      socket.off('live:request_created', handleNewRequest);
      socket.off('task:updated', handleNewRequest);
    };
  }, []);

  // Radar Animation Loop on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(cx, cy) - 40;

      // Draw Grid lines
      ctx.strokeStyle = 'rgba(35, 55, 45, 0.4)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Concentric circles
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (radius / 5) * i, 0, Math.PI * 2);
        ctx.strokeStyle = i === 5 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.12)';
        ctx.stroke();
      }

      // Compass axes
      ctx.beginPath();
      ctx.moveTo(cx, 20);
      ctx.lineTo(cx, h - 20);
      ctx.moveTo(20, cy);
      ctx.lineTo(w - 20, cy);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.15)';
      ctx.stroke();

      // Sweeping Beam
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle, angle + 0.4);
      ctx.closePath();
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
      grad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + radius * Math.cos(angle + 0.4), cy + radius * Math.sin(angle + 0.4));
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Center node (SGSITS Indore coordinates)
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#10B981';
      ctx.fill();

      angle += 0.015;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="bg-[#0D1410] min-h-screen text-white flex flex-col font-sans">
      {/* Top Ticker & Metric Strip */}
      <div className="bg-[#121A15] border-b border-[#23372D] px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-brand text-emerald-300 font-mono text-xs font-bold uppercase rounded">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>INDORE LIVE RADAR</span>
            </div>
            <span className="text-xs font-mono text-white/60 hidden sm:inline">
              ● Grid: 22.7196° N, 75.8577° E
            </span>
          </div>

          {/* Metric Counters */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-emerald-400 font-bold">
                {liveData?.counters?.activeRequests ?? liveData?.requests?.length ?? 0}
              </span>
              <span className="text-white/60 ml-1">Active Requests</span>
            </div>
            <div className="text-white/20">•</div>
            <div>
              <span className="text-emerald-400 font-bold">
                {liveData?.counters?.helpersOnline ?? 0}
              </span>
              <span className="text-white/60 ml-1">Helpers</span>
            </div>
            <div className="text-white/20">•</div>
            <div>
              <span className="text-emerald-400 font-bold">
                {liveData?.counters?.problemsSolved ?? 0}
              </span>
              <span className="text-white/60 ml-1">Resolved</span>
            </div>
            <div className="text-white/20">•</div>
            <div>
              <span className="text-emerald-400 font-bold">₹0</span>
              <span className="text-white/60 ml-1">Fee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Radar Viewport */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        {/* Left: Canvas Interactive Radar Map */}
        <div className="flex-1 relative min-h-[300px] sm:min-h-[420px] lg:min-h-[500px] flex items-center justify-center p-2 sm:p-4">
          <canvas
            ref={canvasRef}
            width={800}
            height={560}
            className="w-full h-full max-h-[420px] sm:max-h-[560px] lg:max-h-[640px] object-contain"
          />

          {/* Overlay Markers according to TRD 12.3:
              red = REPORT/urgent; amber = active; blue = offer; green = resolved */}
          {liveData?.requests?.map((req: any, index: number) => {
            // Place nodes around center for Indore demo map visual
            const offsetAngles = [0.4, 1.8, 3.2, 4.5, 5.7];
            const dists = [90, 150, 120, 180, 110];
            const ang = offsetAngles[index % offsetAngles.length];
            const dist = dists[index % dists.length];

            const isSelected = selectedPin?.id === req.id;

            let markerColor = 'bg-amber-500 border-amber-300';
            if (req.type === 'REPORT' || req.urgency === 'HIGH' || req.urgency === 'CRITICAL') {
              markerColor = 'bg-urgent border-red-300';
            } else if (req.status === 'RESOLVED') {
              markerColor = 'bg-resolved border-emerald-300';
            } else if (req.type === 'GIVE' || req.type === 'SERVICE') {
              markerColor = 'bg-blue-500 border-blue-300';
            }

            return (
              <div
                key={req.id}
                onClick={() => setSelectedPin(req)}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group transition-all"
                style={{
                  top: `calc(50% + ${Math.sin(ang) * dist}px)`,
                  left: `calc(50% + ${Math.cos(ang) * dist}px)`,
                }}
              >
                <div className="relative">
                  <span
                    className={`block w-4 h-4 rounded-full border-2 ${markerColor} ${
                      isSelected ? 'ring-4 ring-emerald-400 scale-125' : ''
                    }`}
                  />
                  {req.type === 'REPORT' && (
                    <span className="absolute -inset-1 rounded-full bg-urgent/40 animate-ping" />
                  )}
                </div>

                {/* Tooltip on Hover */}
                <div className="absolute left-6 top-0 hidden group-hover:block z-30 bg-black/90 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono whitespace-nowrap border border-[#23372D] shadow-lg">
                  <div className="font-bold text-white">{req.title}</div>
                  <div className="text-white/60 text-[10px]">{req.locationText}</div>
                </div>
              </div>
            );
          })}

          {/* Quick Filter Legend in Bottom Left */}
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md p-3 rounded-[6px] border border-[#23372D] text-[11px] font-mono space-y-1.5">
            <div className="text-white/60 uppercase text-[9px]">TRD 12.3 Marker Protocol:</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-urgent" />
              <span>REPORT / Urgent</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Active Dispatches</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>GIVE / SERVICE Offers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-resolved" />
              <span>Verified Resolutions</span>
            </div>
          </div>
        </div>

        {/* Right: Live Activity Stream & Node Inspector Panel */}
        <div className="w-full lg:w-96 bg-[#121A15] border-t lg:border-t-0 lg:border-l border-[#23372D] p-3.5 sm:p-5 pb-20 lg:pb-5 flex flex-col justify-between space-y-4 sm:space-y-6">
          {/* Selected Node Details */}
          {selectedPin && (
            <div className="bg-[#17241D] border border-[#2A4436] rounded-[8px] p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2 py-0.5 bg-brand text-emerald-300 rounded font-bold uppercase">
                  {selectedPin.type}
                </span>
                <span className="text-white/60">{selectedPin.status}</span>
              </div>

              <h4 className="text-sm font-bold text-white">
                {selectedPin.title}
              </h4>

              <div className="text-xs text-white/70 font-mono space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{selectedPin.locationText}</span>
                </div>
                <div>Impact: {selectedPin.affectedCount} individuals</div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <Link
                  to={`/app/matches/${selectedPin.id}`}
                  className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Inspect Matches & Triage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Live Activity Stream */}
          <div className="flex-1 space-y-3 overflow-y-auto">
            <div className="text-xs font-mono uppercase tracking-wider text-white/60 flex items-center justify-between">
              <span>COMMUNITY ACTIVITY FEED</span>
              <span className="text-emerald-400 font-bold">REALTIME</span>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              {liveData?.ticker && liveData.ticker.length > 0 ? (
                liveData.ticker.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="bg-[#17241D]/60 border border-[#23372D] p-2.5 rounded-[6px] space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-emerald-400 font-bold">● {item.location}</span>
                      <span className="text-white/40">{item.timeAgo}</span>
                    </div>
                    <p className="text-white/80 text-[11px] leading-snug">
                      {item.text}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 border border-[#23372D] rounded-[6px] text-white/50 text-center text-xs">
                  No recent activity logged yet.
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-[#23372D] flex items-center gap-2">
            <Link
              to="/app/create"
              className="flex-1 py-2 px-3 text-xs font-bold text-center bg-brand hover:bg-brand-hover text-white rounded-[6px] transition-colors"
            >
              Report Local Incident
            </Link>
            <Link
              to="/explore"
              className="py-2 px-3 text-xs font-semibold bg-[#17241D] hover:bg-[#1E3027] text-white/80 border border-[#2A4436] rounded-[6px]"
            >
              Explore Feed
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
