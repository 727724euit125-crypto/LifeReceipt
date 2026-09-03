# LifeReceipt

### Your purchases, remembered.

**LifeReceipt** is a WebMCP-powered personal purchase intelligence vault that turns ordinary receipts into living, agent-accessible assets.

Instead of simply storing receipts, LifeReceipt understands what you own, tracks warranty deadlines, identifies claim opportunities, retrieves supporting receipts, prepares claims, and lets an AI agent handle the workflow — while keeping consequential actions behind explicit human approval.

**Live Demo:** https://lifereceipt-yourpurchasesremembered.netlify.app

**Repository:** https://github.com/727724euit125-crypto/LifeReceipt

---

## The Problem

Receipts are usually treated as dead documents.

After buying something, people often forget:

* When they purchased it
* Whether the warranty is still active
* Where the receipt is
* When the warranty expires
* Whether they are eligible for a claim
* What information is required to submit a claim

When something breaks, the user has to manually search through receipts, verify warranty dates, find purchase information, and fill out claim paperwork.

The information already exists — but it is disconnected from the action.

---

## The Idea

LifeReceipt turns every purchase into a **living asset**.

Each purchase can contain:

* Product information
* Purchase date
* Store
* Price
* Warranty period
* Warranty expiration
* Receipt
* Claim eligibility
* Claim status

The user can then interact with these assets through an AI agent using **WebMCP**.

### Purchase → Memory → Intelligence → Action

```text
PURCHASE
   ↓
MEMORY
   ↓
WARRANTY INTELLIGENCE
   ↓
RECEIPT VERIFICATION
   ↓
CLAIM PREPARATION
   ↓
HUMAN APPROVAL
   ↓
CLAIM SUBMISSION
   ↓
CLAIM STATUS
```

---

# Why WebMCP?

Traditional websites are designed primarily for humans clicking buttons.

WebMCP allows a website to expose meaningful capabilities directly to an agent.

For LifeReceipt, this creates a natural human-agent collaboration model.

Instead of an agent trying to navigate arbitrary UI elements, LifeReceipt exposes structured purchase capabilities such as:

```text
search_purchases()
get_purchase()
check_warranty()
find_expiring_warranties()
get_receipt()
prepare_claim()
request_claim_approval()
submit_claim()
get_claim_status()
```

The agent can reason about the user's request and invoke the appropriate tools.

The website becomes an **agent-accessible purchase intelligence layer**, rather than just a collection of pages.

---

# What Humans and Agents Can Do Together

A user can say:

> "Find my Sony headphones, check whether they are still under warranty, retrieve the receipt, and prepare a warranty claim if eligible. Do not submit anything without my explicit approval."

The agent can then:

1. Search the purchase vault
2. Identify the Sony headphones
3. Retrieve purchase information
4. Check warranty status
5. Retrieve the receipt
6. Prepare the claim
7. Request human approval
8. Stop execution

The user remains in control of the consequential action.

After explicit approval:

9. Submit the claim
10. Retrieve the claim status

This creates a clear boundary:

**Agents can investigate and prepare. Humans authorize consequential actions.**

---

# WebMCP Implementation

LifeReceipt uses the native WebMCP registration API:

```javascript
document.modelContext.registerTool({
  name: "search_purchases",
  description: "Search the purchase vault",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string"
      }
    },
    required: ["query"]
  },
  execute: async (input) => {
    return this.executeTool("search_purchases", input);
  }
});
```

The registration layer is implemented in:

```text
src/services/webMcpAgent.js
```

The application registers all nine LifeReceipt tools through the native `document.modelContext.registerTool()` API when the WebMCP environment exposes it.

The implementation does **not** create or polyfill a fake `document.modelContext`.

For ordinary browsers where the native API is unavailable, LifeReceipt can continue operating through its existing application-level tool layer.

---

# Available WebMCP Tools

| Tool                       | Purpose                                        |
| -------------------------- | ---------------------------------------------- |
| `search_purchases`         | Search the purchase vault                      |
| `get_purchase`             | Retrieve detailed purchase information         |
| `check_warranty`           | Check warranty status and remaining time       |
| `find_expiring_warranties` | Find purchases approaching warranty expiration |
| `get_receipt`              | Retrieve the purchase receipt                  |
| `prepare_claim`            | Prepare a warranty claim                       |
| `request_claim_approval`   | Request explicit user authorization            |
| `submit_claim`             | Submit an authorized claim                     |
| `get_claim_status`         | Retrieve current claim status                  |

---

# Human Approval & Safety

LifeReceipt deliberately does not allow an agent to silently submit a claim.

The `submit_claim()` execution path checks that the claim is in the required approval state.

Conceptually:

```text
Agent
  ↓
Prepare Claim
  ↓
Request Approval
  ↓
┌──────────────────────────────┐
│ HUMAN APPROVAL REQUIRED      │
│                              │
│   Approve & Submit            │
└──────────────────────────────┘
  ↓
Submit Claim
```

A direct attempt to submit a claim without the required approval state is rejected.

This makes the boundary explicit:

> **Automation handles the work. The human owns the decision.**

---

# Example Demo

### Scenario

Sony WH-1000XM6 headphones stop working.

The user asks:

> "Find my Sony headphones, check whether they are still under warranty, retrieve the receipt, and prepare a warranty claim if eligible. Do not submit anything without my explicit approval."

### Agent execution

```text
search_purchases()
        ↓
get_purchase()
        ↓
check_warranty()
        ↓
get_receipt()
        ↓
prepare_claim()
        ↓
request_claim_approval()
        ↓
       STOP
        ↓
HUMAN APPROVAL
        ↓
submit_claim()
        ↓
get_claim_status()
```

The claim cannot cross the approval boundary without an explicit user action.

---

# Product Experience

## Spatial Purchase Vault

LifeReceipt presents purchases as living assets rather than rows in a traditional receipt list.

The vault provides a visual overview of:

* Protected purchases
* Expiring warranties
* At-risk purchases
* Purchase value
* Warranty timelines
* Claim opportunities

---

## Warranty Radar

Warranty Radar provides multiple ways to understand upcoming expiration:

* Radar view
* Timeline view
* List view

Purchases approaching expiration receive increased visual urgency.

---

## Agent Activity

The Agent Activity interface exposes the agent's mission as a sequence of meaningful operations.

Example:

```text
01  SEARCHING YOUR VAULT
    search_purchases()

02  PURCHASE FOUND
    get_purchase()

03  WARRANTY VERIFIED
    check_warranty()

04  RECEIPT VERIFIED
    get_receipt()

05  CLAIM PREPARED
    prepare_claim()

06  HUMAN APPROVAL REQUIRED
    request_claim_approval()
```

This makes agent activity understandable rather than opaque.

---

## Claims

The Claims interface shows:

* Claim opportunity
* Product
* Claim value
* Warranty verification
* Receipt verification
* Claim status
* Human approval state
* Submission status

---

# Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   AI Agent /        │
                    │   WebMCP Client     │
                    └──────────┬──────────┘
                               │
                               │ WebMCP
                               ▼
              ┌────────────────────────────────┐
              │ document.modelContext           │
              │ .registerTool(...)              │
              └───────────────┬────────────────┘
                              │
                              ▼
                 ┌────────────────────────┐
                 │ LifeReceipt WebMCP     │
                 │ Tool Registration      │
                 └───────────┬────────────┘
                             │
                             ▼
                 ┌────────────────────────┐
                 │ WebMcpAgentManager     │
                 │                        │
                 │ 9 application tools    │
                 └───────────┬────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        Purchase Data   Warranty Data   Claim Data
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                    Human Approval Gate
                             │
                       Explicit Approval
                             │
                             ▼
                       Claim Submission
```

---

# Technology Stack

* React
* Vite
* JavaScript
* WebMCP
* CSS
* Netlify
* GitHub

---

# Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/727724euit125-crypto/LifeReceipt.git
cd LifeReceipt
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

The production build is generated in:

```text
dist/
```

---

# Project Structure

```text
LifeReceipt/
├── public/
│   ├── _headers
│   └── _redirects
│
├── src/
│   ├── services/
│   │   └── webMcpAgent.js
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── ...
│
├── netlify.toml
├── package.json
├── vite.config.js
└── README.md
```

---

# Deployment

LifeReceipt is deployed on Netlify.

Production URL:

https://lifereceipt-yourpurchasesremembered.netlify.app

The deployment uses:

```toml
[build]
publish = "dist"
command = "npm run build"
```

SPA routing is configured so application routes such as `/vault` resolve correctly.

JavaScript module assets are served with the appropriate JavaScript MIME type.

---

# Testing

The project has been tested for:

* Production Vite build
* WebMCP registration source
* Nine WebMCP tools
* Tool schemas
* Tool execution flow
* Warranty calculation
* Receipt retrieval
* Claim preparation
* Human approval enforcement
* Claim submission
* Claim status retrieval
* Netlify deployment

The Sony headphones workflow provides the primary end-to-end demonstration.

---

# WebMCP Safety Principle

LifeReceipt follows a simple principle:

> **The agent can do the work. The human makes the consequential decision.**

Searching a purchase, checking a warranty, retrieving a receipt, and preparing a claim can be automated.

Submitting the claim requires explicit human authorization.

This makes LifeReceipt useful not only as a purchase tracker, but as a model for **safe agentic workflows on the web**.

---

# Hackathon

Built for the **OpenAI WebMCP Challenge**.

LifeReceipt demonstrates how WebMCP can transform a traditional consumer website into a structured interface that AI agents can understand and operate while preserving meaningful human control.

---

# License

This project is open source under the MIT License.

See `LICENSE` for details.
