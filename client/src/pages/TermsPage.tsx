import React from 'react';
import { FileText, CheckCircle, AlertTriangle, Scale, Users, Mail } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-3">
          <FileText className="w-3.5 h-3.5 text-emerald-700" />
          <span>TERMS OF SERVICE</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Last Updated: October 2026 • Rules and guidelines governing the OpenHand Indore community platform
        </p>
      </div>

      {/* Content sections */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-sm space-y-8 text-sm leading-relaxed text-slate-700">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-700" />
            1. Platform Purpose & Scope
          </h2>
          <p>
            OpenHand is an open civic and peer coordination utility operating within the city of Indore, Madhya Pradesh. The platform serves to connect local residents, students, verified non-profit shelters, and independent neighborhood service providers directly. OpenHand does not act as an employer, broker, retailer, or financial intermediary.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-700" />
            2. User Obligations & Conduct
          </h2>
          <p>
            By accessing OpenHand, all users agree to adhere to civic community standards:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>Accurate Representations:</strong> All listings for marketplace goods, rental equipment, service trades, and shelter appeals must accurately represent item conditions, availability, and applicable charges.
            </li>
            <li>
              <strong>Prohibited Items:</strong> Users must not list hazardous materials, illegal substances, counterfeit goods, or offensive content. Any listing violating Indian law will be removed immediately.
            </li>
            <li>
              <strong>Direct Settlement:</strong> Rental deposits, sale payments, and technician visit fees are settled directly between parties without platform commissions or escrow guarantees.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-emerald-700" />
            3. Safety & Transaction Disclaimer
          </h2>
          <p>
            OpenHand encourages responsible neighborhood interactions:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Always conduct physical handoffs, item inspections, and gear testing in daylight and secure public venues.</li>
            <li>Verify the condition of rental devices (such as wheelchairs or oxygen monitors) prior to accepting possession.</li>
            <li>Food rescue donations must meet standard food safety and hygiene guidelines; perishable prepared meals should be consumed within recommended timeframes.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-700" />
            4. Limitation of Liability & Jurisdiction
          </h2>
          <p>
            OpenHand is provided on an "as is" and "as available" basis without warranties of any kind. OpenHand volunteers, contributors, and operators shall not be liable for any direct, indirect, incidental, or consequential damages arising from physical exchanges, service contracts, or communications between users. These Terms are governed by the laws of India, and disputes shall be subject to the exclusive jurisdiction of the competent courts in Indore, Madhya Pradesh.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-700" />
            5. Inquiries & Community Support
          </h2>
          <p>
            For community feedback, report submissions, or inquiries regarding these Terms, contact our administration team:
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700">
            Email: contact@openhand.org • Indore, Madhya Pradesh, India
          </div>
        </section>
      </div>
    </div>
  );
};
