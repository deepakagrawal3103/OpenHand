import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { CivicRequest, RequestType } from '../types';
import { RequestCard } from '../components/ui/RequestCard';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  RefreshCw,
  Plus,
  Radio,
  Layers,
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [requests, setRequests] = useState<CivicRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>(searchParams.get('type') || 'ALL');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('ALL');
  const [selectedRadius, setSelectedRadius] = useState<number>(10);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await api.getRequests({
        type: selectedType !== 'ALL' ? selectedType : undefined,
        urgency: selectedUrgency !== 'ALL' ? selectedUrgency : undefined,
        search: searchTerm || undefined,
        lat: 22.7196,
        lng: 75.8577,
        radiusKm: selectedRadius,
      });
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [selectedType, selectedUrgency, selectedRadius]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRequests();
  };

  return (
    <div className="bg-[#F5F2EC] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-line">
          <div>
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-muted">
              CIVIC PROBLEM REGISTRY
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink">
              Explore Indore Requests
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
              Live community needs, surplus items, and assistance requests across Indore.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/live"
              className="px-3.5 py-2 text-xs font-mono font-semibold bg-surface border border-line hover:border-line-dark rounded-[6px] text-ink flex items-center gap-1.5 shadow-clean"
            >
              <Radio className="w-3.5 h-3.5 text-brand" />
              Live Radar Map
            </Link>

            <Link
              to="/app/create"
              className="px-3.5 py-2 text-xs font-semibold bg-brand hover:bg-brand-hover text-white rounded-[6px] flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              New Request
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-surface border border-line rounded-[10px] p-4 mb-6 shadow-clean space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <Search className="w-4 h-4 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search requests by title, keywords or landmark (e.g. Lab 3, solder, Ender 3)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#F5F2EC] border border-line rounded-[6px] focus:outline-none focus:border-brand"
              />
            </form>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
                className="px-3 py-2 text-xs font-mono bg-[#F5F2EC] border border-line rounded-[6px] focus:outline-none"
              >
                <option value="ALL">All Urgencies</option>
                <option value="HIGH">High / Critical</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

              <select
                value={selectedRadius}
                onChange={(e) => setSelectedRadius(Number(e.target.value))}
                className="px-3 py-2 text-xs font-mono bg-[#F5F2EC] border border-line rounded-[6px] focus:outline-none"
              >
                <option value={1}>Within 1 km</option>
                <option value={3}>Within 3 km</option>
                <option value={5}>Within 5 km</option>
                <option value={10}>Within 10 km</option>
                <option value={50}>Indore Metro (50km)</option>
              </select>

              <button
                onClick={fetchRequests}
                className="p-2 bg-[#F5F2EC] border border-line rounded-[6px] text-ink-muted hover:text-ink transition-colors"
                title="Refresh requests"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Typology Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-line text-xs">
            <span className="text-[11px] font-mono text-ink-muted uppercase mr-1">
              Typology:
            </span>
            {['ALL', 'NEED', 'GIVE', 'SERVICE', 'REPORT'].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setSelectedType(t);
                  setSearchParams(t === 'ALL' ? {} : { type: t });
                }}
                className={`px-3 py-1 font-mono text-xs rounded-[4px] border transition-all ${
                  selectedType === t
                    ? 'bg-brand text-white border-brand font-semibold'
                    : 'bg-[#F5F2EC] text-ink-muted border-line hover:text-ink hover:border-line-dark'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Requests Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-surface border border-line rounded-[10px] p-5 h-56 animate-pulse"
              >
                <div className="h-4 bg-[#E3DED4] rounded w-1/3 mb-4" />
                <div className="h-6 bg-[#E3DED4] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[#E3DED4] rounded w-full mb-1" />
                <div className="h-4 bg-[#E3DED4] rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-surface border border-line rounded-[10px] p-12 text-center max-w-lg mx-auto">
            <Layers className="w-10 h-10 text-ink-subtle mx-auto mb-3" />
            <h3 className="text-base font-semibold text-ink">No requests match filters</h3>
            <p className="text-xs text-ink-muted mt-1 mb-4">
              Try widening the radius or resetting the filter options.
            </p>
            <button
              onClick={() => {
                setSelectedType('ALL');
                setSelectedUrgency('ALL');
                setSelectedRadius(50);
                setSearchTerm('');
              }}
              className="px-4 py-2 text-xs font-semibold bg-brand text-white rounded-[6px]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {requests.map((r) => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
