<div align="center">

# ✨ Prestige AI Deal Room

### Autonomous AI Negotiation for Corporate Commerce

<p>
  <a href="https://prestige-ai-bargain.onrender.com/">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20Prestige-0A66FF?style=for-the-badge" alt="Live Demo">
  </a>
  <img src="https://img.shields.io/badge/React-TypeScript-3178C6?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/AI-Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini">
  <img src="https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
</p>

<p>
  <strong>Built for Razorpay Buildathon 2026</strong>
</p>

</div>

---

## 🚀 Live Demo

**Try the application:**  
https://prestige-ai-bargain.onrender.com/

> Explore the catalog, select a corporate product, open the AI Deal Room, negotiate a bulk price, and continue through checkout.

---

## 🎯 The Problem

Corporate purchasing is different from normal e-commerce.

A customer buying one product can usually purchase at the listed price, but organizations often purchase products in bulk and expect a negotiated price.

This creates a problem for both sides:

- Customers want better bulk pricing.
- Merchants need to protect their margins.
- Manual negotiation is slow.
- Traditional e-commerce checkout is designed around fixed prices.
- A generic chatbot cannot safely negotiate prices without business constraints.

### The question we explored

**What if an AI could negotiate a bulk purchase on behalf of a merchant while still respecting the merchant's pricing rules?**

---

## 💡 Our Solution

### Prestige AI Deal Room

Prestige is an AI-powered corporate commerce experience where customers can negotiate bulk purchases directly with an AI merchant.

Instead of:

```text
Browse → Fixed Price → Checkout

Prestige transforms the experience into:

Browse
   ↓
Select Product
   ↓
Choose Bulk Quantity
   ↓
Bargain with AI
   ↓
AI Counteroffer
   ↓
Deal Accepted
   ↓
Checkout
   ↓
Payment
   ↓
Order Confirmation

The AI acts as a virtual merchant that negotiates with customers in real time while following predefined merchant pricing guardrails.

This enables customers to receive better bulk pricing while allowing merchants to maintain control over discounts and margins.

⭐ Key Features
🤖 AI-Powered Deal Room

Customers can negotiate product prices naturally through a conversational interface.

The AI can:

Understand customer offers
Evaluate bulk quantities
Accept reasonable offers
Generate counteroffers
Reject offers outside merchant limits
Maintain negotiation history
Present the final negotiated price
🛡️ Merchant Pricing Guardrails

The AI does not have unrestricted control over pricing.

Merchants can define rules such as:

Base Price
Minimum Selling Price
Maximum Discount
Bulk Order Threshold

The AI uses these constraints while negotiating to ensure that offers remain commercially viable.

AI proposes. Business rules control.

📦 Bulk Negotiation

Corporate customers can negotiate based on order quantity.

Example:

Product: Premium Corporate Gift Box

Quantity: 50
Listed Price: ₹1,850 / unit

Customer Offer: ₹1,500 / unit

AI Counteroffer: ₹1,650 / unit

Final Deal: ₹1,650 / unit
💬 Negotiation History

Every offer and counteroffer remains visible inside the Deal Room.

Listed Price
     ↓
Customer Offer
     ↓
AI Counteroffer
     ↓
Customer Counteroffer
     ↓
Final Deal

This provides transparency throughout the negotiation.

✨ Deal Explanation

The system provides a simple explanation for the generated offer using business factors such as:

Bulk quantity
Product availability
Discount limits
Merchant pricing rules

This helps customers understand why a particular deal was offered.

🛍️ Corporate Product Catalog

Prestige provides a curated catalog of corporate products suitable for bulk purchasing, including:

Corporate Gift Boxes
Executive Notebook Sets
Premium Laptop Bags
Wireless Accessories
Executive Bottles
Premium Pen Sets
Desk Organizers
Corporate Essentials

Each product can be explored individually and can enter the AI negotiation flow.

💬 Prestige AI Assistant

A dedicated AI assistant helps customers:

Discover products
Find suitable corporate products
Ask product-related questions
Understand bulk purchasing
Start a negotiation
Navigate to the AI Deal Room

The assistant handles general customer assistance, while the Deal Room handles price negotiation.

💳 Checkout & Payment

Once a customer accepts a negotiated deal:

Deal Accepted
      ↓
Order Summary
      ↓
Checkout
      ↓
Payment
      ↓
Order Confirmation

The negotiated price is carried forward into the checkout flow.

🔐 Secure Authentication

Customers can create an account and sign in securely.

The authentication system uses:

Node.js
Express.js
bcrypt
SQLite
Server-side sessions

Passwords are stored as secure bcrypt hashes rather than plain text.

🧠 How It Works

The core idea is to combine conversational AI with deterministic business constraints.

Customer
   ↓
Product + Quantity + Offer
   ↓
AI Deal Room
   ↓
Negotiation Logic
   ↓
Merchant Pricing Rules
   ↓
Accept / Counteroffer / Reject
   ↓
Final Deal
   ↓
Order
   ↓
Checkout & Payment

The AI handles the conversation and generates suitable offers, while merchant-defined rules limit what the AI is allowed to offer.

🏗️ System Architecture
                    ┌─────────────────┐
                    │    Customer     │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ React Frontend  │
                    └────────┬────────┘
                             ↓
              ┌──────────────┼──────────────┐
              ↓              ↓              ↓
        Product Catalog   AI Deal Room   AI Assistant
              │              │              │
              └──────────────┼──────────────┘
                             ↓
                    ┌─────────────────┐
                    │ Express Backend │
                    └────────┬────────┘
                             ↓
                ┌────────────┼────────────┐
                ↓            ↓            ↓
             Gemini     Negotiation    Merchant
                AI          Logic       Rules
                             │
                             ↓
                    ┌─────────────────┐
                    │ SQLite Database │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Order / Checkout│
                    └─────────────────┘
🛠️ Tech Stack
Layer	Technology
Frontend	React + TypeScript
Backend	Node.js + Express.js
AI	Google Gemini
Database	SQLite
Authentication	bcrypt + Express Sessions
Payment	Razorpay Checkout
Deployment	Render
🔄 Complete User Journey
1. Customer opens Prestige
          ↓
2. Browses corporate products
          ↓
3. Selects a product
          ↓
4. Chooses bulk quantity
          ↓
5. Opens "Bargain with AI"
          ↓
6. Makes a price offer
          ↓
7. AI evaluates the offer
          ↓
8. AI accepts, rejects, or counteroffers
          ↓
9. Customer and AI negotiate
          ↓
10. Customer accepts final deal
          ↓
11. Order summary is generated
          ↓
12. Customer proceeds to checkout
          ↓
13. Payment is completed
          ↓
14. Order is confirmed
🔬 Technical Highlights
Constrained AI Negotiation

Instead of allowing the AI to freely generate prices, the negotiation is constrained by merchant-defined pricing rules.

AI Intelligence
      +
Business Constraints
      ↓
Controlled Negotiation

This helps balance customer flexibility with merchant control.

Conversational Commerce

Customers do not need to understand complex pricing interfaces. They can simply communicate their requirement naturally.

End-to-End Commerce Flow

The AI negotiation is connected to the actual shopping journey rather than functioning as an isolated chatbot.

Discovery → Negotiation → Deal → Checkout → Payment
🚧 Challenges & Technical Obstacles
1. Maintaining Negotiation Context

Multiple offers need to be understood as part of the same negotiation.

Solution: Maintain the negotiation history and relevant product/order information throughout the Deal Room session.

2. Protecting Merchant Pricing

A customer should not be able to negotiate an unrealistic price.

Solution: Introduce minimum-price and maximum-discount guardrails that constrain the AI's offers.

3. Connecting AI With Commerce

The negotiated result needs to become a valid order.

Solution: Connect the final accepted deal to the existing order and checkout workflow.

4. Handling AI Failures

AI services can fail or become unavailable.

Solution: Provide a controlled fallback response and prevent the user experience from breaking.

🎬 Demo

The recommended demo flow is:

Open Prestige
      ↓
Choose Corporate Product
      ↓
Select Bulk Quantity
      ↓
Bargain with AI
      ↓
Customer Makes Offer
      ↓
AI Counteroffers
      ↓
Merchant Rules Are Respected
      ↓
Deal Accepted
      ↓
Checkout
      ↓
Payment
      ↓
Order Confirmation
Demo Scenario

50 Premium Corporate Gift Boxes

Listed Price:     ₹1,850 / unit
Customer Offer:   ₹1,500 / unit
AI Counteroffer:  ₹1,650 / unit
Final Deal:       ₹1,650 / unit
📈 Future Scope
Advanced AI negotiation strategies
Customer-specific pricing
Multi-product negotiations
Personalized corporate recommendations
Purchase-history-based offers
Automated procurement workflows
Merchant analytics
Advanced fraud detection
Production-grade database infrastructure
More commerce and payment integrations
⚠️ Hackathon Prototype

Prestige AI Deal Room is developed as a hackathon prototype demonstrating AI-powered conversational negotiation in corporate commerce.

For production-scale deployment, additional work would be required around infrastructure, database scalability, monitoring, security, fraud prevention, and comprehensive testing.

🔗 Project Links
Resource	Link
🌐 Live Demo	https://prestige-ai-bargain.onrender.com/
💻 GitHub	Add your repository URL
🎬 Demo Video	Add your video URL
<div align="center">
✨ Prestige AI Deal Room

From fixed-price commerce to intelligent negotiation.

Built for Razorpay Buildathon 2026

</div> ```
