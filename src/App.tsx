import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PersonalBanking from "./pages/PersonalBanking";
import BusinessBanking from "./pages/BusinessBanking";
import CorporateBanking from "./pages/CorporateBanking";
import PrivateBanking from "./pages/PrivateBanking";
import OpenAccount from "./pages/OpenAccount";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Leadership from "./pages/Leadership";
import Careers from "./pages/Careers";
import Awards from "./pages/Awards";
import Dashboard from "./pages/Dashboard";
import { ComprehensiveDashboard } from "./components/dashboard/ComprehensiveDashboard";
import { PrivateBankingDashboard } from "./components/dashboard/PrivateBankingDashboard";
import AdminPortal from "./pages/AdminPortal";
import AdminTemplates from "./pages/AdminTemplates";
import Security2FA from "./pages/Security2FA";
import { AIChatbot } from "./components/support/AIChatbot";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import RegistrationFlow from "./pages/RegistrationFlow";

// Personal Banking Pages
import SavingsAccount from "./pages/personal/SavingsAccount";
import CurrentAccount from "./pages/personal/CurrentAccount";
import FixedDeposits from "./pages/personal/FixedDeposits";
import PersonalLoans from "./pages/personal/PersonalLoans";
import CreditCards from "./pages/personal/CreditCards";

// Business Banking Pages
import BusinessAccounts from "./pages/business/BusinessAccounts";
import BusinessLoans from "./pages/business/BusinessLoans";
import TradeFinance from "./pages/business/TradeFinance";
import CashManagement from "./pages/business/CashManagement";

// Digital Banking Pages
import MobileBanking from "./pages/digital/MobileBanking";

// Corporate Banking Pages
import CorporateRisk from "./pages/corporate/Risk";
import CorporateAccounts from "./pages/corporate/Accounts";
import CorporateTreasury from "./pages/corporate/Treasury";
import CorporateInvestment from "./pages/corporate/Investment";

// Private Banking Pages
import PrivateEstate from "./pages/private/Estate";
import PrivateWealth from "./pages/private/Wealth";
import PrivateAdvisory from "./pages/private/Advisory";
import PrivateBankingPage from "./pages/private/Banking";
import Investors from "./pages/investors/Index";
import Media from "./pages/media/Index";
import CSR from "./pages/csr/Index";
import Sustainability from "./pages/sustainability/Index";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminProvider>
          <OnboardingProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/personal" element={<PersonalBanking />} />
              <Route path="/business" element={<BusinessBanking />} />
              <Route path="/corporate" element={<CorporateBanking />} />
              <Route path="/private" element={<PrivateBanking />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/investors" element={<Investors />} />
              <Route path="/media" element={<Media />} />
              <Route path="/csr" element={<CSR />} />
              <Route path="/sustainability" element={<Sustainability />} />
              <Route path="/leadership" element={<Leadership />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/awards" element={<Awards />} />

              <Route path="/open-account" element={<OpenAccount />} />
              <Route path="/register" element={<RegistrationFlow />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/private" element={<PrivateBankingDashboard onLogout={() => window.location.href = "/"} />} />
              <Route path="/admin" element={<AdminPortal />} />
              <Route path="/admin/templates" element={<AdminTemplates />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* Personal Banking Routes */}
              <Route path="/personal/savings" element={<SavingsAccount />} />
              <Route path="/personal/current" element={<CurrentAccount />} />
              <Route path="/personal/fixed-deposits" element={<FixedDeposits />} />
              <Route path="/personal/loans" element={<PersonalLoans />} />
              <Route path="/personal/credit-cards" element={<CreditCards />} />

              {/* Business Banking Routes */}
              <Route path="/business/accounts" element={<BusinessAccounts />} />
              <Route path="/business/loans" element={<BusinessLoans />} />
              <Route path="/business/trade-finance" element={<TradeFinance />} />
              <Route path="/business/cash-management" element={<CashManagement />} />

              {/* Digital Banking Routes */}
              <Route path="/digital" element={<MobileBanking />} />
              <Route path="/digital/mobile" element={<MobileBanking />} />

              {/* Corporate Banking Routes */}
              <Route path="/corporate/risk" element={<CorporateRisk />} />
              <Route path="/corporate/accounts" element={<CorporateAccounts />} />
              <Route path="/corporate/treasury" element={<CorporateTreasury />} />
              <Route path="/corporate/investment" element={<CorporateInvestment />} />

              {/* Private Banking Routes */}
              <Route path="/private/estate" element={<PrivateEstate />} />
              <Route path="/private/wealth" element={<PrivateWealth />} />
              <Route path="/private/advisory" element={<PrivateAdvisory />} />
              <Route path="/private/banking" element={<PrivateBankingPage />} />

              {/* Security */}
              <Route path="/security/2fa" element={<Security2FA />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
            <AIChatbot />
            <OnboardingModal />
          </BrowserRouter>
          </TooltipProvider>
          </OnboardingProvider>
        </AdminProvider>
      </AuthProvider>
    </QueryClientProvider>
);

export default App;
