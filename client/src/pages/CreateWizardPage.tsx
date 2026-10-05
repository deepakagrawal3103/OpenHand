import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RequestType, UrgencyLevel } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Layers,
  Cpu,
  Wrench,
  AlertTriangle,
  Sparkles,
  MapPin,
  CheckCircle2,
  Radio,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const CreateWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();

  // Wizard Step: 1 = Type, 2 = Details & AI, 3 = Location, 4 = Review, 5 = Success
  const [step, setStep] = useState<number>(1);

  // Form State
  const [type, setType] = useState<RequestType>('REPORT');
  const [description, setDescription] = useState<string>('Lab 3 PCs won\'t boot and 14 students are waiting before practicals.');
  const [title, setTitle] = useState<string>("Lab 3 PCs won't boot");
  const [locationText, setLocationText] = useState<string>('College Lab 3, SGSITS CS Wing, Indore');
  const [lat, setLat] = useState<number>(22.7196);
  const [lng, setLng] = useState<number>(75.8577);
  const [urgency, setUrgency] = useState<UrgencyLevel>('HIGH');
  const [category, setCategory] = useState<string>('COMPUTER_HARDWARE');
  const [affectedCount, setAffectedCount] = useState<number>(14);
  const [summary, setSummary] = useState<string>('14 students blocked by hardware failure.');
  const [keywords, setKeywords] = useState<string[]>(['PC', 'boot', 'lab 3', 'hardware']);

  // AI State
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiConfidence, setAiConfidence] = useState<number>(0.93);
  const [duplicateWarning, setDuplicateWarning] = useState<any>(null);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

  // Initialize from router state if coming from landing page quick submit
  useEffect(() => {
    if (location.state) {
      if (location.state.type) setType(location.state.type);
      if (location.state.initialText) {
        setDescription(location.state.initialText);
        setTitle(location.state.initialText.slice(0, 45));
        setStep(2);
      }
      if (location.state.locationText) setLocationText(location.state.locationText);
      if (location.state.urgency) setUrgency(location.state.urgency);
    }
  }, [location.state]);

  // Trigger live AI understanding when entering step 2 or modifying description
  const runAiAnalysis = async (text: string) => {
    if (!text || text.length < 10) return;
    setAiLoading(true);
    try {
      const result = await api.understandRequest(text);
      setCategory(result.category);
      setUrgency(result.urgency);
      setAffectedCount(result.affectedCount);
      setSummary(result.summary);
      setKeywords(result.keywords);
      setAiConfidence(result.confidence);

      // Check duplicates
      const dup = await api.checkDuplicate({
        title,
        description: text,
        category: result.category,
        type,
        lat,
        lng,
      });
      setDuplicateWarning(dup.isDuplicateWarning ? dup : null);
    } catch (err) {
      console.warn('AI analysis fallback', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleNextFromDetails = async () => {
    await runAiAnalysis(description);
    setStep(3);
  };

  const handlePublish = async () => {
    // If not authenticated, automatically log in as canonical requester Priya
    if (!user) {
      await login('priya@college.edu', 'password123');
    }

    try {
      const created = await api.createRequest({
        type,
        title,
        description,
        category,
        urgency,
        lat,
        lng,
        locationText,
        affectedCount,
        autoPublish: true,
        aiData: {
          category,
          urgency,
          affectedCount,
          keywords,
          summary,
          confidence: aiConfidence,
        },
      });

      setCreatedRequestId(created.id);
      setStep(5);
    } catch (err: any) {
      alert(`Error publishing request: ${err.message}`);
    }
  };

  // Landmark presets in Indore
  const indoreLandmarks = [
    { label: 'College Lab 3, SGSITS CS Wing', lat: 22.7196, lng: 75.8577 },
    { label: 'ECE Innovation Hub, Bhawarkua', lat: 22.7240, lng: 75.8620 },
    { label: 'Indore Makers Club, Old Palasia', lat: 22.7160, lng: 75.8540 },
    { label: 'Geeta Bhawan Robotics Cell', lat: 22.7220, lng: 75.8700 },
    { label: 'Vijay Nagar Square Innovation Lab', lat: 22.7533, lng: 75.8937 },
  ];

  return (
    <div className="bg-[#F5F2EC] min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4">
        {/* Wizard Stepper Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-2">
            <span>STEP {step} OF 5</span>
            <span className="font-semibold text-brand">
              {step === 1 && 'Select Request Type'}
              {step === 2 && 'Describe in Plain Language'}
              {step === 3 && 'Pin Location'}
              {step === 4 && 'Review & Categorization'}
              {step === 5 && 'Connecting Nearby Helpers'}
            </span>
          </div>

          <div className="w-full bg-[#E3DED4] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-brand h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: TYPE SELECTION */}
        {step === 1 && (
          <div className="bg-surface border border-line rounded-[10px] p-6 shadow-clean space-y-6">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
                STEP 1: WHAT DO YOU NEED?
              </div>
              <h2 className="text-xl font-bold text-ink">
                What kind of help or request is this?
              </h2>
              <p className="text-xs text-ink-muted mt-1">
                Choose the best category so we can connect you with the right neighbors.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* REPORT */}
              <div
                onClick={() => setType('REPORT')}
                className={`p-4 rounded-[8px] border cursor-pointer transition-all ${
                  type === 'REPORT'
                    ? 'border-urgent bg-urgent-light/40 ring-1 ring-urgent'
                    : 'border-line bg-[#FAF8F5] hover:border-line-dark'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-[6px] bg-urgent-light text-urgent flex items-center justify-center font-bold">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase text-urgent">
                    REPORT
                  </span>
                </div>
                <h4 className="text-sm font-bold text-ink">Broken Asset / Incident</h4>
                <p className="text-xs text-ink-muted mt-1">
                  Lab PCs, power outages, damaged workshop equipment, or campus infrastructure blockers.
                </p>
              </div>

              {/* NEED */}
              <div
                onClick={() => setType('NEED')}
                className={`p-4 rounded-[8px] border cursor-pointer transition-all ${
                  type === 'NEED'
                    ? 'border-brand bg-brand-light ring-1 ring-brand'
                    : 'border-line bg-[#FAF8F5] hover:border-line-dark'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-[6px] bg-[#EAF2ED] text-brand flex items-center justify-center font-bold">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase text-brand">
                    NEED
                  </span>
                </div>
                <h4 className="text-sm font-bold text-ink">Borrow Tools / Equipment</h4>
                <p className="text-xs text-ink-muted mt-1">
                  Multimeters, soldering irons, wire strippers, sensors, or scientific tools.
                </p>
              </div>

              {/* GIVE */}
              <div
                onClick={() => setType('GIVE')}
                className={`p-4 rounded-[8px] border cursor-pointer transition-all ${
                  type === 'GIVE'
                    ? 'border-brand bg-brand-light ring-1 ring-brand'
                    : 'border-line bg-[#FAF8F5] hover:border-line-dark'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-[6px] bg-[#EAF2ED] text-brand flex items-center justify-center font-bold">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase text-brand">
                    GIVE
                  </span>
                </div>
                <h4 className="text-sm font-bold text-ink">Surplus / Extra Parts</h4>
                <p className="text-xs text-ink-muted mt-1">
                  Spare coin cells, jumpers, spare development boards, or surplus workshop stock.
                </p>
              </div>

              {/* SERVICE */}
              <div
                onClick={() => setType('SERVICE')}
                className={`p-4 rounded-[8px] border cursor-pointer transition-all ${
                  type === 'SERVICE'
                    ? 'border-brand bg-brand-light ring-1 ring-brand'
                    : 'border-line bg-[#FAF8F5] hover:border-line-dark'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-[6px] bg-[#EAF2ED] text-brand flex items-center justify-center font-bold">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase text-brand">
                    SERVICE
                  </span>
                </div>
                <h4 className="text-sm font-bold text-ink">Volunteer Skill</h4>
                <p className="text-xs text-ink-muted mt-1">
                  Hardware diagnosis, 3D printer calibration, OS installs, or soldering clinic.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-line flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-brand hover:bg-brand-hover rounded-[6px] flex items-center gap-2"
              >
                <span>Continue to Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DETAILS & NATURAL LANGUAGE AI PARSING */}
        {step === 2 && (
          <div className="bg-surface border border-line rounded-[10px] p-6 shadow-clean space-y-6">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
                STEP 2: REQUEST DETAILS
              </div>
              <h2 className="text-xl font-bold text-ink">
                Describe what happened in plain words
              </h2>
              <p className="text-xs text-ink-muted mt-1">
                OpenHand automatically suggests the best category and urgency level to alert nearby responders.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-ink-muted uppercase mb-1">
                Title / Headline
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary under 8 words"
                className="w-full px-3 py-2 text-sm bg-[#F5F2EC] border border-line rounded-[6px] focus:outline-none focus:border-brand mb-4 font-semibold"
                required
              />

              <label className="block text-xs font-mono font-medium text-ink-muted uppercase mb-1">
                Detailed Incident Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what is broken, what error code is showing, or who is impacted..."
                className="w-full p-3 text-xs bg-[#F5F2EC] border border-line rounded-[6px] focus:outline-none focus:border-brand leading-relaxed"
                required
              />
            </div>

            {/* Demo Scenario Auto-Fill Button */}
            <div className="flex items-center justify-between text-xs font-mono bg-[#FAF8F5] p-3 rounded-[6px] border border-line">
              <span className="text-ink-muted">Want to try a demo case?</span>
              <button
                type="button"
                onClick={() => {
                  setTitle("Lab 3 PCs won't boot");
                  setDescription("Multiple workstations in College Lab 3 fail to turn on before morning practicals. Fans spin briefly and shut off immediately. 14 students are waiting.");
                  runAiAnalysis("Multiple workstations in College Lab 3 fail to turn on before morning practicals. Fans spin briefly and shut off immediately. 14 students are waiting.");
                }}
                className="text-brand font-semibold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand" />
                Fill Demo Case (Lab 3 PCs)
              </button>
            </div>

            {/* Live AI Analysis Trigger & Feedback */}
            <div className="p-4 bg-brand-light/70 border border-brand/20 rounded-[8px] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-brand text-white font-mono text-[9px] uppercase rounded-[3px] font-bold">
                    SMART TRIAGE
                  </span>
                  <span className="text-xs font-bold text-brand">
                    Live Extracted Triage Preview
                  </span>
                </div>
                {aiLoading && (
                  <span className="text-xs font-mono text-brand animate-pulse">
                    Extracting...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-1">
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block">Suggested Category</span>
                  <span className="font-bold text-ink">{category}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block">Urgency Rating</span>
                  <span className="font-bold text-urgent">{urgency}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block">Affected Impact</span>
                  <span className="font-bold text-ink">{affectedCount} individuals</span>
                </div>
              </div>
            </div>

            {/* Duplicate warning notification if detected */}
            {duplicateWarning && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-[6px] flex items-start gap-2.5 text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Advisory Duplicate Notice: </span>
                  <span>{duplicateWarning.reason}</span>
                  <span className="block text-[11px] text-amber-700 mt-0.5">
                    You can still continue if your request is distinct.
                  </span>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-line flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-semibold text-ink-muted hover:text-ink flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
              <button
                onClick={handleNextFromDetails}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-brand hover:bg-brand-hover rounded-[6px] flex items-center gap-2"
              >
                <span>Continue to Location</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LOCATION SELECTION */}
        {step === 3 && (
          <div className="bg-surface border border-line rounded-[10px] p-6 shadow-clean space-y-6">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
                STEP 3: PICKUP / ISSUE LOCATION
              </div>
              <h2 className="text-xl font-bold text-ink">
                Where in Indore is this located?
              </h2>
              <p className="text-xs text-ink-muted mt-1">
                Helpers will be alerted based on proximity in your locality (~1-2 km radius).
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-ink-muted uppercase mb-1">
                Readable Landmark / Room / Lab
              </label>
              <input
                type="text"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                placeholder="e.g. College Lab 3, SGSITS CS Wing, Indore"
                className="w-full px-3 py-2 text-xs bg-[#F5F2EC] border border-line rounded-[6px] focus:outline-none focus:border-brand"
                required
              />
            </div>

            {/* Indore Landmark Quick Presets */}
            <div>
              <label className="block text-xs font-mono font-medium text-ink-muted uppercase mb-2">
                Quick Indore Landmark Presets
              </label>
              <div className="space-y-2">
                {indoreLandmarks.map((lm) => (
                  <button
                    key={lm.label}
                    type="button"
                    onClick={() => {
                      setLocationText(lm.label);
                      setLat(lm.lat);
                      setLng(lm.lng);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-[6px] text-xs font-mono border flex items-center justify-between transition-all ${
                      locationText === lm.label
                        ? 'bg-brand text-white border-brand font-semibold'
                        : 'bg-[#FAF8F5] border-line hover:border-line-dark text-ink'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      {lm.label}
                    </span>
                    <span className="text-[10px] opacity-80">
                      {lm.lat.toFixed(4)}, {lm.lng.toFixed(4)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-line flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-semibold text-ink-muted hover:text-ink flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-brand hover:bg-brand-hover rounded-[6px] flex items-center gap-2"
              >
                <span>Continue to Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: EDITABLE REVIEW */}
        {step === 4 && (
          <div className="bg-surface border border-line rounded-[10px] p-6 shadow-clean space-y-6">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand" />
                <span>STEP 4: VERIFY DETAILS BEFORE PUBLISHING</span>
              </div>
              <h2 className="text-xl font-bold text-ink">
                Review & Confirm Details
              </h2>
              <p className="text-xs text-ink-muted mt-1">
                Please review the details below. You can change any field before your request is posted.
              </p>
            </div>

            <div className="space-y-4 bg-[#FAF8F5] border border-line rounded-[8px] p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-ink-muted uppercase mb-1">
                    Category Tag
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-line rounded-[6px] font-semibold"
                  >
                    <option value="COMPUTER_HARDWARE">COMPUTER_HARDWARE</option>
                    <option value="ELECTRICAL">ELECTRICAL</option>
                    <option value="TOOLS">TOOLS</option>
                    <option value="NETWORKING">NETWORKING</option>
                    <option value="LOGISTICS">LOGISTICS</option>
                    <option value="GENERAL">GENERAL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-ink-muted uppercase mb-1">
                    Urgency Rating
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                    className="w-full px-3 py-2 text-xs bg-white border border-line rounded-[6px] font-semibold"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-ink-muted uppercase mb-1">
                  Blocked / Affected Count
                </label>
                <input
                  type="number"
                  value={affectedCount}
                  onChange={(e) => setAffectedCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white border border-line rounded-[6px]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-ink-muted uppercase mb-1">
                  Summary (Shown to Responders)
                </label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-line rounded-[6px]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-ink-muted uppercase mb-1">
                  Extracted Keywords
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-white border border-line rounded text-[11px] font-mono text-ink"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-line flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 text-xs font-semibold text-ink-muted hover:text-ink flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
              <button
                onClick={handlePublish}
                className="px-6 py-2.5 text-xs font-bold text-white bg-brand hover:bg-brand-hover rounded-[6px] flex items-center gap-2 shadow-sm"
              >
                <Radio className="w-4 h-4" />
                <span>Confirm & Publish Request</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS & NOTIFICATION */}
        {step === 5 && (
          <div className="bg-surface border border-line rounded-[10px] p-8 shadow-clean text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-brand mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-9 h-9 text-brand" />
            </div>

            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-brand">
                REQUEST PUBLISHED SUCCESSFULLY
              </div>
              <h2 className="text-2xl font-bold text-ink mt-1">
                Your Request is Live in Indore!
              </h2>
              <p className="text-xs text-ink-muted mt-1 max-w-md mx-auto">
                Notifying nearby volunteers, students & technicians in your area...
              </p>
            </div>

            {/* Notification alert block */}
            <div className="bg-[#121A15] text-emerald-400 p-4 rounded-[8px] font-mono text-xs border border-[#23372D] max-w-md mx-auto space-y-1.5 text-left">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Alerting nearby verified helpers in your locality...</span>
              </div>
              <div className="text-emerald-300/80">
                Matched nearby volunteer: Aarav Patel (0.8 km away)
              </div>
              <div className="text-emerald-300/60 text-[10px]">
                Location: {locationText || 'Indore'}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              {createdRequestId && (
                <button
                  onClick={() => navigate(`/app/matches/${createdRequestId}`)}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-brand hover:bg-brand-hover rounded-[6px] shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Inspect 92% Helper Match</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => navigate('/explore')}
                className="px-5 py-2.5 text-xs font-semibold text-ink bg-[#F5F2EC] hover:bg-white border border-line rounded-[6px]"
              >
                Return to Explore Feed
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
