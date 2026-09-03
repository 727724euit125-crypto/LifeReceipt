import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CommandBar } from './components/CommandBar';
import { ReceiptPanel } from './components/ReceiptPanel';
import { PurchaseDetailModal } from './components/PurchaseDetailModal';
import { HumanApprovalModal } from './components/HumanApprovalModal';
import { AgentStatusBanner } from './components/AgentStatusBanner';
import { ProfileModal } from './components/ProfileModal';
import { ReportAppProblemModal } from './components/ReportAppProblemModal';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';
import { AddToVaultModal } from './components/AddToVaultModal';
import { RemoveFromVaultModal } from './components/RemoveFromVaultModal';

import { LandingPage } from './pages/LandingPage';
import { VaultOverview } from './pages/VaultOverview';
import { PurchaseExplorer } from './pages/PurchaseExplorer';
import { WarrantyRadar } from './pages/WarrantyRadar';
import { ClaimsPage } from './pages/ClaimsPage';
import { AgentActivityPage } from './pages/AgentActivityPage';

import { webMcpAgent } from './services/webMcpAgent';

export function App() {
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname || '/');
  const [commandBarOpen, setCommandBarOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [reportProblemModalOpen, setReportProblemModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [addToVaultModalOpen, setAddToVaultModalOpen] = useState(false);
  const [removeFromVaultModalOpen, setRemoveFromVaultModalOpen] = useState(false);
  const [agentState, setAgentState] = useState(webMcpAgent.getState());

  useEffect(() => {
    return webMcpAgent.subscribe((state) => setAgentState(state));
  }, []);

  // Handle client-side browser navigation / hash updates
  const navigateTo = (route) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectPurchase = (purchase) => {
    webMcpAgent.setSelectedPurchase(purchase);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${
      agentState.theme === 'dark'
        ? 'dark bg-[#16171d] text-[#f3f4f6] selection:bg-[#2d5da1]'
        : 'bg-[#fdfbf7] text-[#2d2d2d] selection:bg-[#fff9c4]'
    }`}>
      
      {/* Global Navbar */}
      <Navbar
        currentRoute={currentRoute}
        navigateTo={navigateTo}
        onOpenCommandBar={() => setCommandBarOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenReportProblem={() => setReportProblemModalOpen(true)}
        onOpenLogout={() => setLogoutModalOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {currentRoute === '/' && (
          <LandingPage navigateTo={navigateTo} onSelectPurchase={handleSelectPurchase} />
        )}

        {currentRoute === '/vault' && (
          <VaultOverview 
            navigateTo={navigateTo} 
            onSelectPurchase={handleSelectPurchase}
            onOpenAddToVault={() => setAddToVaultModalOpen(true)}
            onOpenRemoveFromVault={() => setRemoveFromVaultModalOpen(true)}
          />
        )}

        {currentRoute === '/vault/purchases' && (
          <PurchaseExplorer 
            onSelectPurchase={handleSelectPurchase} 
            onOpenAddToVault={() => setAddToVaultModalOpen(true)}
            onOpenRemoveFromVault={() => setRemoveFromVaultModalOpen(true)}
          />
        )}

        {currentRoute === '/vault/warranty-radar' && (
          <WarrantyRadar onSelectPurchase={handleSelectPurchase} />
        )}

        {currentRoute === '/vault/claims' && (
          <ClaimsPage onSelectPurchase={handleSelectPurchase} />
        )}

        {currentRoute === '/vault/agent-activity' && (
          <AgentActivityPage />
        )}
      </main>

      {/* Global Modals & Overlays */}
      <CommandBar
        isOpen={commandBarOpen}
        onClose={() => setCommandBarOpen(false)}
        navigateTo={navigateTo}
      />

      {/* Unfolding Receipt Panel */}
      {agentState.unfoldedReceipt && (
        <ReceiptPanel
          receiptData={agentState.unfoldedReceipt}
          onClose={() => webMcpAgent.setUnfoldedReceipt(null)}
        />
      )}

      {/* Purchase Detail Modal (FOR PRODUCT/PURCHASE PROBLEMS) */}
      {agentState.selectedPurchase && (
        <PurchaseDetailModal
          purchase={agentState.selectedPurchase}
          onClose={() => webMcpAgent.setSelectedPurchase(null)}
        />
      )}

      {/* Human Approval Required Modal */}
      {agentState.approvalModalClaim && (
        <HumanApprovalModal
          claim={agentState.approvalModalClaim}
          onClose={() => webMcpAgent.setApprovalModalClaim(null)}
        />
      )}

      {/* Add To Vault Modal */}
      <AddToVaultModal
        isOpen={addToVaultModalOpen}
        onClose={() => setAddToVaultModalOpen(false)}
        onSelectPurchase={handleSelectPurchase}
      />

      {/* Remove From Vault Modal */}
      <RemoveFromVaultModal
        isOpen={removeFromVaultModalOpen}
        onClose={() => setRemoveFromVaultModalOpen(false)}
      />

      {/* Settings Modal 1: User Profile */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Settings Modal 2: Report Application Problem */}
      <ReportAppProblemModal
        isOpen={reportProblemModalOpen}
        onClose={() => setReportProblemModalOpen(false)}
      />

      {/* Settings Modal 3: Logout Confirmation */}
      <LogoutConfirmModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        navigateTo={navigateTo}
      />

      {/* Agent Real-Time Execution Notification Banner */}
      <AgentStatusBanner />

      {/* Footer */}
      <footer className="mt-16 border-t-[3px] border-[#2d2d2d] dark:border-white/20 py-8 px-4 bg-[#fff9c4]/40 dark:bg-[#1f2028]/60 font-body">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="font-heading text-2xl font-bold">
              Life<span className="text-[#ff4d4d]">Receipt</span> — Personal Purchase Intelligence
            </div>
            <p className="font-mono text-xs text-[#2d2d2d]/70 dark:text-white/70 mt-0.5">
              Built for the WebMCP Challenge • Your purchases, remembered.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-xs font-bold text-[#2d5da1] dark:text-[#ff4d4d]">
            <button onClick={() => navigateTo('/vault')} className="hover:underline">/vault</button>
            <button onClick={() => navigateTo('/vault/purchases')} className="hover:underline">/purchases</button>
            <button onClick={() => navigateTo('/vault/warranty-radar')} className="hover:underline">/warranty-radar</button>
            <button onClick={() => navigateTo('/vault/claims')} className="hover:underline">/claims</button>
            <button onClick={() => navigateTo('/vault/agent-activity')} className="hover:underline">/agent-activity</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
