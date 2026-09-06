import React from 'react';
import {
  Workflow,
  Bot,
  Sparkles,
  Zap,
  Store,
  FileCode2,
  TrendingUp,
  ShieldCheck,
  Lock,
  CreditCard,
  PackageCheck,
  History,
  CheckCircle2,
} from 'lucide-react';

export const Architecture: React.FC = () => {
  const components = [
    {
      id: '1',
      name: 'AI Buyer Agent',
      category: 'Client Proxy',
      icon: Bot,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      role: 'Captures high-level customer procurement needs in natural language, represents buyer preferences, and defends the buyer budget ceiling.',
    },
    {
      id: '2',
      name: 'Structured Intent Parser',
      category: 'Language Processing',
      icon: Sparkles,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      role: 'Transforms unstructured prompts into typed models: products, quantities, maximum price tolerance, SLA constraints, and packaging preferences.',
    },
    {
      id: '3',
      name: 'Deal Orchestrator',
      category: 'Coordination Mesh',
      icon: Zap,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      role: 'Manages the state machine (INTENT -> NEGOTIATING -> WAITING_FOR_APPROVAL -> PAYMENT_SUCCESS), controls round caps, and coordinates agent turns.',
    },
    {
      id: '4',
      name: 'AI Merchant Agent',
      category: 'Merchant Representative',
      icon: Store,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      role: 'Interrogates the catalog to craft solutions, identifies bundle pairings, and negotiates terms to optimize gross margin and expected revenue.',
    },
    {
      id: '5',
      name: 'AI-Readable Catalog Engine',
      category: 'Knowledge Graph',
      icon: FileCode2,
      color: 'bg-slate-50 text-slate-800 border-slate-200',
      role: 'Serves structured machine payloads with margin metadata, unit COGS, inventory velocity, bundle compatibility links, and delivery SLAs.',
    },
    {
      id: '6',
      name: 'Revenue Optimization Engine',
      category: 'Yield Maximization',
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      role: 'Calculates dynamic bundle values, scores deals out of 100 with explainable reasons, and trades variable costs rather than slashing prices.',
    },
    {
      id: '7',
      name: 'Policy Guard Safety Layer',
      category: 'Bounded Autonomy',
      icon: ShieldCheck,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      role: 'Strict deterministic validator enforcing 8 financial invariants (max discount cap, floor margin, inventory reserve, round limits). Zero hallucinations allowed.',
    },
    {
      id: '8',
      name: 'Explicit Buyer Approval Gate',
      category: 'Human-in-the-Loop',
      icon: Lock,
      color: 'bg-slate-900 text-white border-slate-900',
      role: 'Mandatory cryptographic barrier preventing autonomous withdrawals. Agents are strictly prohibited from moving funds without explicit human click.',
    },
    {
      id: '9',
      name: 'Razorpay Test Mode Gateway',
      category: 'Payment Infrastructure',
      icon: CreditCard,
      color: 'bg-blue-600 text-white border-blue-700',
      role: 'Generates real Razorpay order tokens, simulates UPI/Card authorization, handles verification signatures, and traps payment failures safely.',
    },
    {
      id: '10',
      name: 'Immutable Audit Service',
      category: 'Compliance & Telemetry',
      icon: History,
      color: 'bg-teal-50 text-teal-800 border-teal-200',
      role: 'Logs every agent dialogue, counter-offer, policy check verdict, approval timestamp, and gateway signature for enterprise compliance.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
          <Workflow className="w-3.5 h-3.5" />
          <span>System Architecture & Component Registry</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          The 10 Subsystems of Agentic Commerce
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          AI Deal Room transforms e-commerce from passive browser search into an autonomous multi-agent transaction mesh
          with rigorous mathematical financial guardrails.
        </p>
      </div>

      {/* Interactive Architectural Pipeline Diagram */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 text-center">
          Transaction Mesh Sequence Diagram
        </h3>

        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex-1 bg-blue-50 border border-blue-200 p-3.5 rounded-xl text-xs">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-blue-700" />
                <span>1. Natural Intent Extraction</span>
              </div>
              <p className="text-blue-800 text-[11px] mt-1">
                Buyer prompt: <em>“5 corporate gift boxes under ₹8,500”</em> → Extracted into typed JSON schema.
              </p>
            </div>
            <span className="text-slate-400 font-bold hidden md:inline">→</span>
            <div className="flex-1 bg-purple-50 border border-purple-200 p-3.5 rounded-xl text-xs">
              <div className="font-bold text-purple-900 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-purple-700" />
                <span>2. Catalog Discovery & Bundling</span>
              </div>
              <p className="text-purple-800 text-[11px] mt-1">
                Merchant agent inspects catalog margins and synthesizes a high-margin bundle (Boxes + Custom Cards).
              </p>
            </div>
          </div>

          <div className="flex justify-center text-slate-400 font-bold">↓</div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex-1 bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>3. Policy Guard Invariant Check</span>
              </div>
              <p className="text-amber-800 text-[11px] mt-1">
                Checks discount &lt;= 8%, merchant margin &gt;= ₹1,000, inventory reserve, round &lt;= 3.
              </p>
            </div>
            <span className="text-slate-400 font-bold hidden md:inline">→</span>
            <div className="flex-1 bg-slate-900 text-white p-3.5 rounded-xl text-xs border border-slate-800">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                <span>4. Mandatory Human Approval Gate</span>
              </div>
              <p className="text-slate-300 text-[11px] mt-1">
                Deal is frozen. Buyer explicitly clicks [Approve & Pay]. Autonomous charges are strictly prohibited.
              </p>
            </div>
          </div>

          <div className="flex justify-center text-slate-400 font-bold">↓</div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex-1 bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <span>5. Razorpay Settlement & Order Service</span>
              </div>
              <p className="text-emerald-800 text-[11px] mt-1">
                Payment verified cryptographically. Order confirmed. Graceful error handling with zero duplicate charges.
              </p>
            </div>
            <span className="text-slate-400 font-bold hidden md:inline">→</span>
            <div className="flex-1 bg-teal-50 border border-teal-200 p-3.5 rounded-xl text-xs">
              <div className="font-bold text-teal-900 flex items-center gap-1.5">
                <History className="w-4 h-4 text-teal-700" />
                <span>6. Immutable Audit Trail Logging</span>
              </div>
              <p className="text-teal-800 text-[11px] mt-1">
                Records timestamps, actor messages, mathematical scores, and execution receipts for financial compliance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Component Registry Detailed Cards */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Detailed Subsystem Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {components.map((comp) => {
            const Icon = comp.icon;
            return (
              <div
                key={comp.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-start gap-4 hover:border-indigo-300 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${comp.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">#{comp.id}</span>
                    <h4 className="text-sm font-bold text-slate-900">{comp.name}</h4>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded">
                      {comp.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{comp.role}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
