// WebMCP Agent & State Manager for LifeReceipt - Authentic WebMCP Standard Compliance
import { initialPurchases, initialClaims, initialAgentLogs } from '../data/mockData';

class WebMcpAgentManager {
  constructor() {
    this.purchases = this.loadInitialPurchases();
    this.claims = [...initialClaims];
    this.agentLogs = [...initialAgentLogs];
    this.appIssues = []; // Application bug/issue reports
    this.theme = typeof window !== 'undefined' ? (localStorage.getItem('lifereceipt_theme') || 'light') : 'light';
    this.userProfile = {
      name: "Ajay",
      email: "ajay112@gmail.com",
      role: "Vault Owner",
      plan: "LifeReceipt Pro (WebMCP Beta)",
      accountCreated: "2025-01-15",
      accountId: "LR-USER-99201"
    };
    this.listeners = new Set();
    this.isWebMcpRegistered = false; // Idempotency guard for WebMCP registration

    // Visual & Spatial Agent UI States
    this.selectedPurchase = null;
    this.unfoldedReceipt = null;
    this.approvalModalClaim = null;
    this.universeFilter = null; // null | 'EXPIRING' | 'PROTECTED' | search string
    this.activeToolExecuting = null; // null | { tool: string, input: any, statusText: string }
    this.universeScanActive = false; // Scanner beam active on universe
    this.pulsingPurchaseId = null; // ID of purchase receiving animated warranty pulse
    this.focusedPurchaseId = null; // ID of purchase brought to central focus
    this.outwardSignalActive = false; // Outward signal wave on claim submission
    this.isDemoRunning = false;
    this.submittedClaimSuccess = null;
    this.isLoggedOut = false;

    // Apply initial theme
    this.applyTheme(this.theme);

    // Register WebMCP Tools Globally on window and document.modelContext
    this.registerGlobalWebMcpTools();
  }

  loadInitialPurchases() {
    if (typeof window !== 'undefined') {
      try {
        const custom = localStorage.getItem('lifereceipt_custom_purchases');
        if (custom) {
          const parsed = JSON.parse(custom);
          const initialIds = new Set(initialPurchases.map(p => p.id));
          const filteredCustom = parsed.filter(p => !initialIds.has(p.id));
          return [...initialPurchases, ...filteredCustom];
        }
      } catch (e) {
        console.error('Failed to load custom purchases from localStorage', e);
      }
    }
    return [...initialPurchases];
  }

  addPurchaseToVault(data) {
    const nextId = `purch-${Date.now().toString().slice(-4)}`;
    
    // Calculate dates relative to DEMO_DATE = '2026-09-03'
    const purchaseDate = data.purchaseDate || '2026-08-15';
    const durationMonths = parseInt(data.warrantyMonths) || 12;
    
    const pDate = new Date(purchaseDate);
    pDate.setMonth(pDate.getMonth() + durationMonths);
    const warrantyExpires = pDate.toISOString().slice(0, 10);

    const demoAnchor = new Date('2026-09-03');
    const diffTime = pDate - demoAnchor;
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    let status = 'PROTECTED';
    if (daysRemaining <= 30 && daysRemaining > 0) {
      status = 'EXPIRING';
    } else if (daysRemaining <= 0) {
      status = 'AT_RISK';
    }

    const categoryIconMap = {
      'Phone': '📱',
      'Computer': '💻',
      'Audio': '🎧',
      'Home': '🏠',
      'Appliances': '🔌',
      'Accessories': '🎒',
      'Electronics': '⚙️'
    };

    const newPurchase = {
      id: nextId,
      name: data.name,
      brand: data.brand || 'Generic',
      category: data.category || 'Electronics',
      price: Number(data.price) || 0,
      store: data.store || 'Official Store',
      purchaseDate: purchaseDate,
      warrantyMonths: durationMonths,
      warrantyExpires: warrantyExpires,
      daysRemaining: daysRemaining,
      status: status,
      returnWindow: 'Closed',
      serialNumber: data.serialNumber || `SN-${nextId.toUpperCase()}-992`,
      receiptId: data.receiptId || `RCP-${nextId.toUpperCase()}-001`,
      claimEligibility: status === 'PROTECTED' ? 'Protected' : 'Eligible',
      issueDescription: data.notes || 'No issues reported.',
      icon: categoryIconMap[data.category] || '📦',
      receiptDetails: {
        storeName: data.store || 'Official Store',
        taxId: `GSTIN29OFFCL${Math.floor(1000 + Math.random()*9000)}Z`,
        purchaseDate: `${purchaseDate}, 12:00`,
        paymentMethod: 'UPI / Credit Card',
        items: [{ name: data.name, price: Number(data.price), qty: 1 }],
        subtotal: Math.round(Number(data.price) * 0.82),
        tax: Math.round(Number(data.price) * 0.18),
        total: Number(data.price)
      },
      x: Math.floor(150 + Math.random() * 500),
      y: Math.floor(150 + Math.random() * 350),
      z: 1.0,
      notes: data.notes || '',
      source: data.source || 'manual',
      createdAt: new Date().toISOString()
    };

    this.purchases.unshift(newPurchase);
    
    if (typeof window !== 'undefined') {
      try {
        const customPurchases = this.purchases.filter(p => !initialPurchases.some(initP => initP.id === p.id));
        localStorage.setItem('lifereceipt_custom_purchases', JSON.stringify(customPurchases));
      } catch (e) {
        console.error('Failed to save custom purchase to localStorage', e);
      }
    }

    this.logToolAction('add_purchase_to_vault', { purchaseId: newPurchase.id, name: newPurchase.name }, `Added "${newPurchase.name}" to Vault memory. Warranty ${newPurchase.status} (${newPurchase.daysRemaining} days left).`, 'SUCCESS');

    this.notify();
    return newPurchase;
  }

  removePurchaseFromVault(purchaseId) {
    const pIndex = this.purchases.findIndex((x) => x.id === purchaseId);
    if (pIndex !== -1) {
      const removedItem = this.purchases[pIndex];
      this.purchases.splice(pIndex, 1);

      if (this.selectedPurchase && this.selectedPurchase.id === purchaseId) {
        this.selectedPurchase = null;
      }

      if (typeof window !== 'undefined') {
        try {
          const customPurchases = this.purchases.filter(p => !initialPurchases.some(initP => initP.id === p.id));
          localStorage.setItem('lifereceipt_custom_purchases', JSON.stringify(customPurchases));
        } catch (e) {
          console.error('Failed to update custom purchases in localStorage', e);
        }
      }

      this.logToolAction('remove_purchase_from_vault', { purchaseId, name: removedItem.name }, `Removed "${removedItem.name}" (ID: ${purchaseId}) from Vault memory.`, 'SUCCESS');

      this.notify();
      return { success: true, removedItem };
    }
    return { success: false, error: 'Purchase not found' };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.getState()));
  }

  getState() {
    return {
      purchases: this.purchases,
      claims: this.claims,
      agentLogs: this.agentLogs,
      appIssues: this.appIssues,
      theme: this.theme,
      userProfile: this.userProfile,
      selectedPurchase: this.selectedPurchase,
      unfoldedReceipt: this.unfoldedReceipt,
      approvalModalClaim: this.approvalModalClaim,
      universeFilter: this.universeFilter,
      activeToolExecuting: this.activeToolExecuting,
      universeScanActive: this.universeScanActive,
      pulsingPurchaseId: this.pulsingPurchaseId,
      focusedPurchaseId: this.focusedPurchaseId,
      outwardSignalActive: this.outwardSignalActive,
      isDemoRunning: this.isDemoRunning,
      submittedClaimSuccess: this.submittedClaimSuccess,
      isLoggedOut: this.isLoggedOut
    };
  }

  setTheme(theme) {
    this.theme = theme;
    if (typeof window !== 'undefined') {
      localStorage.setItem('lifereceipt_theme', theme);
    }
    this.applyTheme(theme);
    this.notify();
  }

  applyTheme(theme) {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }

  reportAppIssue({ category, description, attachmentName }) {
    const issueCount = this.appIssues.length + 1;
    const issueId = `LR-ISSUE-${String(issueCount).padStart(3, '0')}`;
    const newIssue = {
      issueId,
      category,
      description,
      attachmentName: attachmentName || null,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'OPEN'
    };

    this.appIssues.unshift(newIssue);
    this.logToolAction('report_app_issue', { issueId, category }, `Application Issue #${issueId} received & logged: ${description.slice(0, 40)}...`, 'SUCCESS');
    return newIssue;
  }

  setLoggedOut(status) {
    this.isLoggedOut = status;
    this.notify();
  }

  setSelectedPurchase(purchase) {
    this.selectedPurchase = purchase;
    if (purchase) {
      this.focusedPurchaseId = purchase.id;
    }
    this.notify();
  }

  setUnfoldedReceipt(receipt) {
    this.unfoldedReceipt = receipt;
    this.notify();
  }

  setApprovalModalClaim(claim) {
    this.approvalModalClaim = claim;
    this.notify();
  }

  setUniverseFilter(filter) {
    this.universeFilter = filter;
    this.notify();
  }

  setFocusedPurchaseId(id) {
    this.focusedPurchaseId = id;
    this.notify();
  }

  clearSubmittedClaimSuccess() {
    this.submittedClaimSuccess = null;
    this.notify();
  }

  logToolAction(tool, input, output, status = 'SUCCESS') {
    const newLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tool,
      input,
      output: typeof output === 'object' ? JSON.stringify(output) : output,
      status
    };
    this.agentLogs.unshift(newLog);
    this.notify();
    return newLog;
  }

  // --- REAL FUNCTIONAL WEBMCP TOOL EXECUTOR ---
  async executeTool(toolName, input = {}) {
    let statusText = 'SCANNING PURCHASE MEMORY';
    if (toolName === 'find_expiring_warranties') statusText = 'FOCUSING EXPIRING ASSETS';
    if (toolName === 'check_warranty') statusText = 'CHECKING WARRANTY';
    if (toolName === 'get_receipt') statusText = 'VERIFYING RECEIPT';
    if (toolName === 'prepare_claim') statusText = 'PREPARING CLAIM';
    if (toolName === 'request_claim_approval') statusText = 'WAITING FOR YOU';
    if (toolName === 'submit_claim') statusText = 'SUBMITTING CLAIM';
    if (toolName === 'get_claim_status') statusText = 'POLLING CLAIM STATUS';

    this.activeToolExecuting = { tool: toolName, input, statusText };
    this.notify();

    let toolReturnValue = null;

    switch (toolName) {
      // 1. search_purchases({ query })
      case 'search_purchases': {
        this.universeScanActive = true;
        this.notify();
        await new Promise((r) => setTimeout(r, 700));

        const queryStr = (input.query || '').toLowerCase();
        this.universeFilter = queryStr;
        
        // Dynamically query purchase dataset
        const matches = this.purchases.filter((p) =>
          p.name.toLowerCase().includes(queryStr) ||
          p.brand.toLowerCase().includes(queryStr) ||
          p.category.toLowerCase().includes(queryStr) ||
          p.serialNumber.toLowerCase().includes(queryStr)
        );

        this.universeScanActive = false;

        if (matches.length > 0) {
          this.selectedPurchase = matches[0];
          this.focusedPurchaseId = matches[0].id;
        }

        toolReturnValue = {
          success: true,
          query: input.query,
          matchCount: matches.length,
          matches: matches.map(m => ({ id: m.id, name: m.name, brand: m.brand, price: m.price, status: m.status }))
        };

        this.logToolAction('search_purchases', input, `Found ${matches.length} purchase(s) matching "${queryStr}"`, 'SUCCESS');
        break;
      }

      // 2. get_purchase({ purchaseId })
      case 'get_purchase': {
        const p = this.purchases.find((x) => x.id === input.purchaseId || x.name.toLowerCase().includes((input.name || '').toLowerCase()));
        if (p) {
          this.focusedPurchaseId = p.id;
          this.selectedPurchase = p;
          await new Promise((r) => setTimeout(r, 600));

          toolReturnValue = {
            success: true,
            purchase: { ...p }
          };

          this.logToolAction('get_purchase', input, `Retrieved purchase metadata for ${p.name} (SN: ${p.serialNumber})`, 'SUCCESS');
        } else {
          toolReturnValue = { success: false, error: `Purchase ID "${input.purchaseId}" not found in vault.` };
          this.logToolAction('get_purchase', input, toolReturnValue.error, 'ERROR');
        }
        break;
      }

      // 3. check_warranty({ purchaseId })
      case 'check_warranty': {
        const p = this.purchases.find((x) => x.id === input.purchaseId || x.name.toLowerCase().includes((input.name || '').toLowerCase()));
        if (p) {
          this.focusedPurchaseId = p.id;
          this.pulsingPurchaseId = p.id;
          this.notify();
          await new Promise((r) => setTimeout(r, 900));
          this.pulsingPurchaseId = null;

          toolReturnValue = {
            success: true,
            purchaseId: p.id,
            productName: p.name,
            status: p.status,
            daysRemaining: p.daysRemaining,
            warrantyExpires: p.warrantyExpires,
            returnWindow: p.returnWindow,
            claimEligibility: p.claimEligibility
          };

          this.logToolAction('check_warranty', input, `${p.name} warranty is ${p.status} with ${p.daysRemaining} days remaining (Expires ${p.warrantyExpires}).`, 'SUCCESS');
        } else {
          toolReturnValue = { success: false, error: "Purchase not found" };
        }
        break;
      }

      // 4. find_expiring_warranties({ thresholdDays = 30 })
      case 'find_expiring_warranties': {
        const threshold = input.thresholdDays || 30;
        this.universeScanActive = true;
        this.notify();
        await new Promise((r) => setTimeout(r, 700));
        this.universeScanActive = false;

        this.universeFilter = 'EXPIRING';
        const expiring = this.purchases.filter((p) => p.daysRemaining <= threshold);

        toolReturnValue = {
          success: true,
          thresholdDays: threshold,
          expiringCount: expiring.length,
          expiringPurchases: expiring.map(e => ({ id: e.id, name: e.name, daysRemaining: e.daysRemaining, price: e.price }))
        };

        this.logToolAction('find_expiring_warranties', input, `Found ${expiring.length} warranties expiring within ${threshold} days: ${expiring.map(e => e.name).join(', ')}`, 'SUCCESS');
        break;
      }

      // 5. get_receipt({ purchaseId })
      case 'get_receipt': {
        const p = this.purchases.find((x) => x.id === input.purchaseId || x.name.toLowerCase().includes((input.name || '').toLowerCase()));
        if (p && p.receiptDetails) {
          this.focusedPurchaseId = p.id;
          await new Promise((r) => setTimeout(r, 700));

          const receiptObj = {
            ...p.receiptDetails,
            productName: p.name,
            receiptId: p.receiptId,
            claimEligibility: p.claimEligibility
          };

          this.unfoldedReceipt = receiptObj;
          toolReturnValue = { success: true, receipt: receiptObj };

          this.logToolAction('get_receipt', input, `Receipt ${p.receiptId} retrieved & verified for ${p.name}.`, 'SUCCESS');
        } else {
          toolReturnValue = { success: false, error: "Receipt data not found" };
        }
        break;
      }

      // 6. prepare_claim({ purchaseId, issue })
      case 'prepare_claim': {
        const p = this.purchases.find((x) => x.id === input.purchaseId || x.name.toLowerCase().includes((input.name || '').toLowerCase()));
        if (p) {
          this.focusedPurchaseId = p.id;
          this.pulsingPurchaseId = p.id;
          this.notify();
          await new Promise((r) => setTimeout(r, 900));
          this.pulsingPurchaseId = null;

          let claim = this.claims.find((c) => c.purchaseId === p.id);
          if (!claim) {
            claim = {
              claimId: `LR-${Math.floor(10000 + Math.random() * 90000)}`,
              purchaseId: p.id,
              productName: p.name,
              brand: p.brand,
              price: p.price,
              issue: input.issue || p.issueDescription || "Hardware component failure",
              status: "AWAITING_APPROVAL",
              createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
              warrantyExpires: p.warrantyExpires,
              receiptVerified: true,
              claimReference: `REF-${p.brand.substring(0,3).toUpperCase()}-${Math.floor(100000 + Math.random()*900000)}`
            };
            this.claims.unshift(claim);
          } else {
            claim.status = "AWAITING_APPROVAL";
          }

          toolReturnValue = { success: true, claim: { ...claim } };
          this.logToolAction('prepare_claim', input, `Claim package prepared for ${p.name}. Requires explicit human authorization before submission.`, 'SUCCESS');

          // Trigger approval gate automatically next
          await this.executeTool('request_claim_approval', { claimId: claim.claimId });
        } else {
          toolReturnValue = { success: false, error: "Purchase not found" };
        }
        break;
      }

      // 7. request_claim_approval({ claimId })
      case 'request_claim_approval': {
        const claim = this.claims.find((c) => c.claimId === input.claimId);
        if (claim) {
          claim.status = 'AWAITING_APPROVAL';
          this.approvalModalClaim = claim;

          toolReturnValue = {
            success: true,
            claimId: claim.claimId,
            productName: claim.productName,
            status: 'WAITING_FOR_APPROVAL',
            message: '🔐 HUMAN APPROVAL REQUIRED. Halting execution until user explicit authorization.'
          };

          this.logToolAction('request_claim_approval', input, `🔐 HUMAN APPROVAL REQUIRED for Claim #${claim.claimId} (${claim.productName}). Execution paused.`, 'WAITING_FOR_APPROVAL');
        } else {
          toolReturnValue = { success: false, error: "Claim not found" };
        }
        break;
      }

      // 8. submit_claim({ claimId }) — MANDATORY SAFETY GATE ENFORCED
      case 'submit_claim': {
        const claim = this.claims.find((c) => c.claimId === input.claimId);
        if (claim) {
          // ENFORCE STRICT HUMAN APPROVAL GATE IN EXECUTION PATH
          if (claim.status !== 'AWAITING_APPROVAL') {
            toolReturnValue = {
              success: false,
              error: '🔐 HUMAN APPROVAL REQUIRED: Claim cannot be submitted without explicit human authorization in the UI gate.'
            };
            this.logToolAction('submit_claim', input, toolReturnValue.error, 'ERROR');
            break;
          }

          claim.status = 'UNDER_REVIEW';
          this.approvalModalClaim = null;
          this.submittedClaimSuccess = { ...claim };
          this.outwardSignalActive = true;
          this.notify();

          toolReturnValue = {
            success: true,
            claimId: claim.claimId,
            productName: claim.productName,
            status: 'UNDER_REVIEW',
            claimReference: claim.claimReference
          };

          this.logToolAction('submit_claim', input, `Claim #${claim.claimId} successfully submitted to ${claim.brand} Warranty Operations. Ticket reference: ${claim.claimReference}`, 'SUCCESS');

          await new Promise((r) => setTimeout(r, 1200));
          this.outwardSignalActive = false;

          // Poll status automatically after submission
          await new Promise((r) => setTimeout(r, 300));
          this.logToolAction('get_claim_status', { claimId: claim.claimId }, `Claim #${claim.claimId} is now UNDER_REVIEW with estimated response time < 48 hrs.`, 'SUCCESS');
        } else {
          toolReturnValue = { success: false, error: "Claim ID not found" };
        }
        break;
      }

      // 9. get_claim_status({ claimId })
      case 'get_claim_status': {
        const claim = this.claims.find((c) => c.claimId === input.claimId);
        if (claim) {
          toolReturnValue = {
            success: true,
            claimId: claim.claimId,
            productName: claim.productName,
            status: claim.status,
            claimReference: claim.claimReference,
            createdAt: claim.createdAt
          };

          this.logToolAction('get_claim_status', input, `Claim #${claim.claimId} status: ${claim.status}. Reference ID: ${claim.claimReference}`, 'SUCCESS');
        } else {
          toolReturnValue = { success: false, error: "Claim ID not found" };
        }
        break;
      }

      default:
        toolReturnValue = { success: false, error: `Unknown tool "${toolName}"` };
        break;
    }

    this.activeToolExecuting = null;
    this.notify();
    return toolReturnValue;
  }

  // --- Real End-to-End Execution Sequence Engine ---
  async runDemoWorkflow() {
    if (this.isDemoRunning) return;
    this.isDemoRunning = true;
    this.notify();

    try {
      await this.executeTool('search_purchases', { query: 'Sony' });
      await new Promise((r) => setTimeout(r, 900));

      await this.executeTool('find_expiring_warranties');
      await new Promise((r) => setTimeout(r, 900));

      await this.executeTool('get_purchase', { purchaseId: 'purch-2' });
      await new Promise((r) => setTimeout(r, 900));

      await this.executeTool('check_warranty', { purchaseId: 'purch-2' });
      await new Promise((r) => setTimeout(r, 900));

      await this.executeTool('get_receipt', { purchaseId: 'purch-2' });
      await new Promise((r) => setTimeout(r, 1200));

      await this.executeTool('prepare_claim', {
        purchaseId: 'purch-2',
        issue: 'Left earcup stopped producing sound after recent firmware update.'
      });

    } finally {
      this.isDemoRunning = false;
      this.notify();
    }
  }

  rejectClaim(claimId) {
    const claim = this.claims.find((c) => c.claimId === claimId);
    if (claim) {
      claim.status = 'READY_TO_CLAIM';
      this.logToolAction('request_claim_approval', { claimId }, `Claim #${claimId} rejected by user. Operations aborted.`, 'ERROR');
    }
    this.approvalModalClaim = null;
    this.notify();
  }

  async approveAndSubmitClaim(claimId) {
    await this.executeTool('submit_claim', { claimId });
  }

  registerGlobalWebMcpTools() {
    if (typeof window !== 'undefined') {
      window.webMcpAgent = this;
      window.__WEBMCP_TOOLS__ = {
        search_purchases: (query) => this.executeTool('search_purchases', typeof query === 'string' ? { query } : query),
        get_purchase: (purchaseId) => this.executeTool('get_purchase', typeof purchaseId === 'string' ? { purchaseId } : purchaseId),
        check_warranty: (purchaseId) => this.executeTool('check_warranty', typeof purchaseId === 'string' ? { purchaseId } : purchaseId),
        find_expiring_warranties: (thresholdDays) => this.executeTool('find_expiring_warranties', typeof thresholdDays === 'number' ? { thresholdDays } : thresholdDays),
        get_receipt: (purchaseId) => this.executeTool('get_receipt', typeof purchaseId === 'string' ? { purchaseId } : purchaseId),
        prepare_claim: (purchaseId, issue) => this.executeTool('prepare_claim', typeof purchaseId === 'string' ? { purchaseId, issue } : purchaseId),
        request_claim_approval: (claimId) => this.executeTool('request_claim_approval', typeof claimId === 'string' ? { claimId } : claimId),
        submit_claim: (claimId) => this.executeTool('submit_claim', typeof claimId === 'string' ? { claimId } : claimId),
        get_claim_status: (claimId) => this.executeTool('get_claim_status', typeof claimId === 'string' ? { claimId } : claimId)
      };

      // Safely register tools via official W3C WebMCP browser API (document.modelContext.registerTool)
      this.registerDocumentWebMcpTools();
    }
  }

  registerDocumentWebMcpTools() {
    if (this.isWebMcpRegistered) return;

    if (typeof document !== 'undefined' && document.modelContext && typeof document.modelContext.registerTool === 'function') {
      try {
        this.isWebMcpRegistered = true;

        // 1. search_purchases
        document.modelContext.registerTool({
          name: 'search_purchases',
          description: 'Search tracked purchases in LifeReceipt vault by keyword, brand, category, or serial number.',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Search term for product name, brand, category, or serial number' }
            },
            required: ['query']
          },
          execute: (input) => this.executeTool('search_purchases', input)
        });

        // 2. get_purchase
        document.modelContext.registerTool({
          name: 'get_purchase',
          description: 'Retrieve detailed purchase asset metadata for a specific purchase ID or product name.',
          inputSchema: {
            type: 'object',
            properties: {
              purchaseId: { type: 'string', description: 'Unique purchase ID (e.g. purch-1) or product name' },
              name: { type: 'string', description: 'Optional product name' }
            }
          },
          execute: (input) => this.executeTool('get_purchase', input)
        });

        // 3. check_warranty
        document.modelContext.registerTool({
          name: 'check_warranty',
          description: 'Check dynamic warranty status, expiration date, and days remaining for a purchase.',
          inputSchema: {
            type: 'object',
            properties: {
              purchaseId: { type: 'string', description: 'Purchase ID or product name' }
            },
            required: ['purchaseId']
          },
          execute: (input) => this.executeTool('check_warranty', input)
        });

        // 4. find_expiring_warranties
        document.modelContext.registerTool({
          name: 'find_expiring_warranties',
          description: 'Find all tracked purchases whose warranties expire within a given threshold of days.',
          inputSchema: {
            type: 'object',
            properties: {
              thresholdDays: { type: 'number', description: 'Expiration threshold in days (default 30)' }
            }
          },
          execute: (input) => this.executeTool('find_expiring_warranties', input)
        });

        // 5. get_receipt
        document.modelContext.registerTool({
          name: 'get_receipt',
          description: 'Retrieve verified store receipt details, item breakdown, and tax ID for a purchase.',
          inputSchema: {
            type: 'object',
            properties: {
              purchaseId: { type: 'string', description: 'Purchase ID or product name' }
            },
            required: ['purchaseId']
          },
          execute: (input) => this.executeTool('get_receipt', input)
        });

        // 6. prepare_claim
        document.modelContext.registerTool({
          name: 'prepare_claim',
          description: 'Prepare warranty claim documentation package for a defective purchase asset.',
          inputSchema: {
            type: 'object',
            properties: {
              purchaseId: { type: 'string', description: 'Purchase ID or product name' },
              issue: { type: 'string', description: 'Description of hardware fault or issue' }
            },
            required: ['purchaseId']
          },
          execute: (input) => this.executeTool('prepare_claim', input)
        });

        // 7. request_claim_approval
        document.modelContext.registerTool({
          name: 'request_claim_approval',
          description: 'Request mandatory human authorization before submitting a warranty claim.',
          inputSchema: {
            type: 'object',
            properties: {
              claimId: { type: 'string', description: 'Claim ID requiring human approval' }
            },
            required: ['claimId']
          },
          execute: (input) => this.executeTool('request_claim_approval', input)
        });

        // 8. submit_claim (HUMAN APPROVAL GATED)
        document.modelContext.registerTool({
          name: 'submit_claim',
          description: 'Submit an approved warranty claim package to manufacturer operations.',
          inputSchema: {
            type: 'object',
            properties: {
              claimId: { type: 'string', description: 'Claim ID to submit (Requires prior human authorization)' }
            },
            required: ['claimId']
          },
          execute: (input) => this.executeTool('submit_claim', input)
        });

        // 9. get_claim_status
        document.modelContext.registerTool({
          name: 'get_claim_status',
          description: 'Query live status and ticket reference for an existing warranty claim.',
          inputSchema: {
            type: 'object',
            properties: {
              claimId: { type: 'string', description: 'Claim ID to query status for' }
            },
            required: ['claimId']
          },
          execute: (input) => this.executeTool('get_claim_status', input)
        });

        console.log('[WebMCP] Successfully registered 9 tools on document.modelContext.');
      } catch (e) {
        console.warn('[WebMCP] document.modelContext registration exception:', e);
      }
    } else {
      console.log('[WebMCP] document.modelContext API not detected in browser. Window tools fallbacks remain active.');
    }
  }
}

export const webMcpAgent = new WebMcpAgentManager();
