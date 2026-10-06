import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocalityProvider } from './context/LocalityContext';
import { Navbar } from './components/ui/Navbar';
import { MobileBottomNav } from './components/ui/MobileBottomNav';
import { Footer } from './components/ui/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { OnboardingRolePage } from './pages/OnboardingRolePage';
import { OnboardingSkillsPage } from './pages/OnboardingSkillsPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateWizardPage } from './pages/CreateWizardPage';
import { RequestDetailPage } from './pages/RequestDetailPage';
import { MatchesPage } from './pages/MatchesPage';
import { TrackingTimelinePage } from './pages/TrackingTimelinePage';
import { VerificationPage } from './pages/VerificationPage';
import { TaskChatPage } from './pages/TaskChatPage';
import { HelperCockpitPage } from './pages/HelperCockpitPage';
import { HelperTaskPage } from './pages/HelperTaskPage';
import { HelperProofUploadPage } from './pages/HelperProofUploadPage';
import { LiveRadarPage } from './pages/LiveRadarPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { DonationPage } from './pages/DonationPage';
import { ServicesPage } from './pages/ServicesPage';
import { CreateIdPage } from './pages/CreateIdPage';
import { MyMatchesPage } from './pages/MyMatchesPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LocalityProvider>
          <div className="flex flex-col min-h-screen bg-[#F5F2EC] text-[#1A1916]">
            <Navbar />
            <main className="flex-1 pb-20 md:pb-0">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/donate" element={<DonationPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/create-id" element={<CreateIdPage />} />
                <Route path="/my-matches" element={<MyMatchesPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/live" element={<LiveRadarPage />} />

                {/* Onboarding Routes */}
                <Route path="/onboarding/role" element={<OnboardingRolePage />} />
                <Route path="/onboarding/skills" element={<OnboardingSkillsPage />} />

                {/* User / Requester Routes */}
                <Route path="/app" element={<DashboardPage />} />
                <Route path="/app/create" element={<CreateWizardPage />} />
                <Route path="/app/create/details" element={<CreateWizardPage />} />
                <Route path="/app/create/location" element={<CreateWizardPage />} />
                <Route path="/app/create/review" element={<CreateWizardPage />} />
                <Route path="/app/create/success" element={<CreateWizardPage />} />
                <Route path="/app/explore/map" element={<LiveRadarPage />} />
                <Route path="/app/request/:id" element={<RequestDetailPage />} />
                <Route path="/app/matches/:id" element={<MatchesPage />} />
                <Route path="/app/requests/:id" element={<TrackingTimelinePage />} />
                <Route path="/app/requests/:id/verify" element={<VerificationPage />} />
                <Route path="/app/messages/:id" element={<TaskChatPage />} />

                {/* Legal & Compliance Routes */}
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />

                {/* Helper Routes */}
                <Route path="/helper" element={<HelperCockpitPage />} />
                <Route path="/helper/tasks/:id" element={<HelperTaskPage />} />
                <Route path="/helper/tasks/:id/proof" element={<HelperProofUploadPage />} />

                {/* Fallback 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <MobileBottomNav />
          </div>
        </LocalityProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
