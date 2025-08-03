import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PersonalBanking from "./pages/PersonalBanking";
import BusinessBanking from "./pages/BusinessBanking";
import CorporateBanking from "./pages/CorporateBanking";
import PrivateBanking from "./pages/PrivateBanking";
import OpenAccount from "./pages/OpenAccount";
import About from "./pages/About";
import Contact from "./pages/Contact";

import { ComprehensiveDashboard } from "./components/dashboard/ComprehensiveDashboard";
import { PrivateBankingDashboard } from "./components/dashboard/PrivateBankingDashboard";
import AdminPortal from "./pages/AdminPortal";
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

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminProvider>
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

              <Route path="/open-account" element={<OpenAccount />} />
              <Route path="/register" element={<RegistrationFlow />} />
              <Route path="/dashboard" element={<ComprehensiveDashboard onLogout={() => window.location.href = "/"} />} />
              <Route path="/dashboard/private" element={<PrivateBankingDashboard onLogout={() => window.location.href = "/"} />} />
              <Route path="/admin" element={<AdminPortal />} />
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

              <Route path="*" element={<NotFound />} />
            </Routes>
            <AIChatbot />
          </BrowserRouter>
          </TooltipProvider>
        </AdminProvider>
      </AuthProvider>
    </QueryClientProvider>
);

export default App;
