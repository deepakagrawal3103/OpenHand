import React from 'react';
import { ShieldCheck, Lock, Eye, Bell, Database, Mail } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>DATA PRIVACY & SECURITY</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Last Updated: October 2026 • Applicable to all OpenHand Indore community tools and services
        </p>
      </div>

      {/* Content sections */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-sm space-y-8 text-sm leading-relaxed text-slate-700">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-700" />
            1. Information We Collect
          </h2>
          <p>
            OpenHand operates as an open civic network designed to facilitate neighborhood assistance, direct book/tool exchanges, verified NGO donation drop-offs, and local service coordination in Indore. We collect only information essential to establish direct contact between community members:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>Contact Information:</strong> Full name, telephone number (for WhatsApp alerts and direct phone coordination), and email address.
            </li>
            <li>
              <strong>Location Data:</strong> General locality or neighborhood within Indore (such as Palasia, Vijay Nagar, Bhawarkua, Annapurna) to match nearby requests and minimize travel. Precise GPS coordinates are optional.
            </li>
            <li>
              <strong>Listings & Verification Data:</strong> Information you voluntarily share when listing an item for rent/sale, reporting surplus food for shelter pickup, or requesting skilled maintenance support.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-700" />
            2. How Your Information is Used
          </h2>
          <p>
            Your data is utilized strictly for civic platform functionality:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Connecting neighbors directly with zero intermediary commission or hidden fees.</li>
            <li>Dispatching opt-in WhatsApp alerts when an urgent donation or matching repair ticket is published in your area.</li>
            <li>Verifying authentic shelter wishlists and technician credentials to protect community participants from spam and fraudulent listings.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-700" />
            3. Data Sharing & Third Parties
          </h2>
          <p>
            We adhere to strict privacy standards:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>We do not sell personal data.</strong> Your contact details and activity logs are never monetized, rented, or distributed to advertising networks.
            </li>
            <li>
              <strong>Public Listings:</strong> When you post a listing on the marketplace or donation board, the designated contact name, locality, and item details become visible to platform users to facilitate coordination.
            </li>
            <li>
              <strong>WhatsApp Messaging:</strong> When you initiate a WhatsApp alert or direct chat, communication occurs through WhatsApp's end-to-end encrypted protocol subject to Meta's privacy terms.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-700" />
            4. Your Choices & Data Rights
          </h2>
          <p>
            You maintain complete authority over your platform presence:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>You may toggle off automated WhatsApp notifications at any time from your settings or account dashboard.</li>
            <li>You may edit or remove your listings immediately once an exchange is completed or an item is claimed.</li>
            <li>You may request complete account deletion and associated contact record purging by writing to our team.</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-700" />
            5. Contact Us
          </h2>
          <p>
            For questions concerning this Privacy Policy, civic data practices, or to request removal of a listing, contact the OpenHand civic administration at:
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700">
            Email: contact@openhand.org • Indore, Madhya Pradesh, India
          </div>
        </section>
      </div>
    </div>
  );
};
