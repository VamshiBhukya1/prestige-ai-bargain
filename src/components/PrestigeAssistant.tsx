import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Bot,
  ShoppingBag,
  TrendingDown,
  Gift,
  PackageCheck,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Product } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  matchedProducts?: Product[];
  suggestedAction?: 'bargain' | 'shop';
}

interface PrestigeAssistantProps {
  products: Product[];
  onBargainWithAI: (product: Product, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
  onNavigateShop: () => void;
}

export const PrestigeAssistant: React.FC<PrestigeAssistantProps> = ({
  products,
  onBargainWithAI,
  onSelectProduct,
  onNavigateShop,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialWelcomeMessage: Message = {
    id: 'msg-welcome',
    sender: 'bot',
    text: `Hello! 👋 I'm **Prestige AI Assistant**, your corporate gifting & bulk order specialist. How can I assist you today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<Message[]>([initialWelcomeMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const quickActions = [
    { label: 'Browse Products', icon: ShoppingBag, query: 'Show me corporate gifts' },
    { label: 'Bulk Order', icon: PackageCheck, query: 'Can I get a bulk discount?' },
    { label: 'Find a Gift', icon: Gift, query: 'Which product is good for 50 employees?' },
    { label: 'Bargain with AI', icon: TrendingDown, query: 'I want to negotiate for 50 units.' },
  ];

  const handleClearHistory = () => {
    setMessages([
      {
        ...initialWelcomeMessage,
        id: `msg-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const generateAssistantResponse = async (userQuery: string): Promise<{ text: string; matchedProducts?: Product[] }> => {
    const q = userQuery.toLowerCase().trim();

    // 1. Try server API first
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userQuery, history: messages.slice(-4) }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          // Find matching products for rich preview
          let matched: Product[] = [];
          if (data.matchedProductIds && Array.isArray(data.matchedProductIds)) {
            matched = products.filter((p) => data.matchedProductIds.includes(p.id));
          } else {
            matched = findMatchingProducts(q);
          }
          return { text: data.reply, matchedProducts: matched };
        }
      }
    } catch (e) {
      // API unavailable - continue to graceful fallback
    }

    // 2. Intelligent Deterministic Fallback using Live Catalog Data
    return getLocalAssistantReply(userQuery);
  };

  const findMatchingProducts = (q: string): Product[] => {
    return products.filter((p) => {
      const name = p.name.toLowerCase();
      const cat = p.category.toLowerCase();
      const desc = p.description.toLowerCase();
      if (q.includes('laptop bag') || q.includes('bag')) return p.id === 'prod-3';
      if (q.includes('mouse')) return p.id === 'prod-4';
      if (q.includes('bottle') || q.includes('water')) return p.id === 'prod-5';
      if (q.includes('organizer') || q.includes('desk')) return p.id === 'prod-6';
      if (q.includes('pen')) return p.id === 'prod-7';
      if (q.includes('keyboard')) return p.id === 'prod-8';
      if (q.includes('gift box') || q.includes('box')) return p.id === 'prod-1';
      if (q.includes('notebook') || q.includes('journal')) return p.id === 'prod-2';
      return name.split(' ').some((word) => word.length > 3 && q.includes(word)) || cat.includes(q);
    });
  };

  const getLocalAssistantReply = (query: string): { text: string; matchedProducts?: Product[] } => {
    const q = query.toLowerCase().trim();

    // Specific Questions
    if (q.includes('50 employees') || q.includes('50 staff') || q.includes('employee') || q.includes('50 units') || q.includes('50 team')) {
      const recs = products.filter((p) => ['prod-1', 'prod-2', 'prod-5', 'prod-7'].includes(p.id));
      return {
        text: `For **50 employees**, top corporate favorites are the **Executive Notebook Set** (₹750) or **Stainless Steel Executive Bottle** (₹699) for team rewards, or the **Premium Corporate Gift Box** (₹1,850) for premium milestones.

You can negotiate bulk pricing for 50 units directly using the **Bargain with AI** button below!`,
        matchedProducts: recs.slice(0, 3),
      };
    }

    if (q.includes('corporate gift') || q.includes('gift') || q.includes('browse') || q.includes('catalog')) {
      const gifts = products.filter((p) => p.category === 'Corporate Gifts' || p.category === 'Stationery' || p.category === 'Drinkware');
      return {
        text: `We offer premium corporate merchandise including executive luxury gift boxes, handcrafted notebooks, stainless steel tumblers, and brass pen sets.

Here are top recommendations from our live catalog:`,
        matchedProducts: gifts.slice(0, 4),
      };
    }

    if (q.includes('laptop bag') || q.includes('bag price') || q.includes('price of laptop bag')) {
      const bag = products.find((p) => p.id === 'prod-3');
      if (bag) {
        return {
          text: `The **${bag.name}** is priced at **₹${bag.price.toLocaleString()}** per unit (Stock: ${bag.inventory} units available). It features water-resistant ballistic nylon with a 16-inch padded compartment.

Click **Bargain with AI** to request custom bulk pricing or logo customization!`,
          matchedProducts: [bag],
        };
      }
    }

    if (q.includes('price') || q.includes('how much') || q.includes('cost')) {
      const matched = findMatchingProducts(q);
      if (matched.length > 0) {
        const p = matched[0];
        return {
          text: `The **${p.name}** is **₹${p.price.toLocaleString()}** per unit (${p.category}, Inventory: ${p.inventory} available).

Would you like to negotiate a bulk price in our AI Deal Room?`,
          matchedProducts: [p],
        };
      }
    }

    if (q.includes('bulk discount') || q.includes('discount') || q.includes('offer') || q.includes('tier')) {
      return {
        text: `Yes! Prestige provides automatic tier discounts on bulk quantities, capped up to **8% - 10% off** list price with guaranteed merchant pricing floors.

Select any item below to open the **AI Deal Room** and negotiate your custom quantity!`,
        matchedProducts: products.slice(0, 4),
      };
    }

    if (q.includes('bargain') || q.includes('negotiate') || q.includes('deal room')) {
      return {
        text: `Our **AI Deal Room** is ready to negotiate live pricing, free shipping, or custom corporate packaging for your order.

Choose a product below to start an instant negotiation session:`,
        matchedProducts: products.slice(0, 4),
      };
    }

    // Default fallback matching products or general guidance
    const matches = findMatchingProducts(q);
    if (matches.length > 0) {
      return {
        text: `Here are the matching products from our corporate catalog based on your query:`,
        matchedProducts: matches,
      };
    }

    return {
      text: `I can help you discover products, check live pricing, arrange bulk employee orders, or launch an AI price negotiation.

Try asking: *"Which product is good for 50 employees?"*, *"What is the price of the laptop bag?"*, or select an action below:`,
      matchedProducts: products.slice(0, 2),
    };
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || loading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const response = await generateAssistantResponse(textToSend);
      const botMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedProducts: response.matchedProducts,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'bot',
          text: `I am here to assist with catalog items and bulk discounts. Select a product below or try searching for items like notebooks, laptop bags, or bottles.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          matchedProducts: products.slice(0, 2),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#0C2340] hover:bg-[#0C6CF2] text-white p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2.5 border border-blue-400/30 group"
          title="Open Prestige AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <span className="text-xs font-bold hidden sm:inline tracking-wide">Prestige AI Assistant</span>
        </button>
      )}

      {/* Compact Chat Panel Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[560px] max-h-[82vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-[#0C2340] text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm tracking-tight leading-tight flex items-center gap-1.5">
                  Prestige AI Assistant
                  <Sparkles className="w-3 h-3 text-amber-300" />
                </h3>
                <p className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  Corporate Gifting & Bulk Specialist
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Clear chat history"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-4 bg-slate-50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#0C6CF2] text-white rounded-br-none shadow-xs font-medium'
                      : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line text-xs">{msg.text}</p>
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>

                {/* Embedded Product Cards inside Chat */}
                {msg.matchedProducts && msg.matchedProducts.length > 0 && (
                  <div className="w-full mt-2 space-y-2">
                    {msg.matchedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-3 shadow-xs hover:border-blue-300 transition-colors"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0 cursor-pointer"
                          onClick={() => {
                            setIsOpen(false);
                            onSelectProduct(p);
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4
                            onClick={() => {
                              setIsOpen(false);
                              onSelectProduct(p);
                            }}
                            className="font-bold text-xs text-[#0C2340] truncate hover:text-[#0C6CF2] cursor-pointer"
                          >
                            {p.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-extrabold text-xs text-[#0C2340]">₹{p.price.toLocaleString()}</span>
                            <span className="text-[10px] text-slate-400">Stock: {p.inventory}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            onBargainWithAI(p, 50);
                          }}
                          className="px-2.5 py-1.5 bg-[#0C6CF2] hover:bg-[#0957C3] text-white rounded-lg text-[11px] font-bold shrink-0 flex items-center gap-1 transition-colors shadow-xs"
                        >
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>Bargain</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs bg-white border border-slate-200 rounded-2xl rounded-bl-none px-3.5 py-2.5 w-fit shadow-xs">
                <Bot className="w-3.5 h-3.5 text-[#0C6CF2]" />
                <span className="text-[11px] font-medium">Prestige Assistant thinking</span>
                <div className="flex items-center gap-1 ml-1">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 overflow-x-auto flex items-center gap-1.5 no-scrollbar shrink-0">
            {quickActions.map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.label}
                  onClick={() => handleSendMessage(act.query)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-full text-[11px] font-semibold text-slate-700 whitespace-nowrap transition-colors shadow-2xs"
                >
                  <Icon className="w-3 h-3 text-[#0C6CF2]" />
                  <span>{act.label}</span>
                </button>
              );
            })}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, 50 employee gifts, bulk deals..."
              className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C6CF2] focus:border-transparent bg-slate-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 bg-[#0C6CF2] hover:bg-[#0957C3] disabled:opacity-50 text-white rounded-xl transition-colors shrink-0 shadow-xs"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
