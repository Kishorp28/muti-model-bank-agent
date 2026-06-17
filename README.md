# 🏦 SBI Financial Inclusion Agent (S-FIA)

> An Agentic AI Banking Assistant designed to improve customer acquisition, financial literacy, digital adoption, and engagement for underserved communities.

[Live Demo](https://muti-model-bank-agent.vercel.app/)
|
[Backend API](https://muti-model-bank-agent.onrender.com)
|
[Project Demo Video](https://youtu.be/fftYry5-rC8)

---

## Problem Statement

Millions of customers struggle with:

- Limited financial literacy
- Difficulty understanding banking products
- Low digital banking adoption
- Lack of personalized financial guidance
- Limited access to banking assistance in rural areas

Banks face challenges in:

- Customer acquisition
- Product adoption
- Engagement retention
- Financial inclusion

S-FIA solves these challenges through an intelligent multi-model AI banking agent.

---

## Solution Overview

S-FIA (SBI Financial Inclusion Agent) is an AI-powered financial assistant that acts as a virtual banking officer.

The system combines:

- Agentic AI Workflows
- LLM-Powered Conversations
- Financial Health Analysis
- Security Monitoring
- Banking Recommendation Engine
- WhatsApp Banking Integration
- Multi-Channel Customer Support

---

## Key Features

### 🎓 Professor S-FIA

AI-powered financial educator capable of:

- Explaining banking concepts
- Teaching financial literacy
- Answering customer questions
- Guiding first-time users

---

### 📊 Financial Health Auditor

Analyzes customer financial data and generates:

- Spending insights
- Savings recommendations
- Risk indicators
- Personalized financial advice

---

### 🔒 Security Intelligence Dashboard

Real-time monitoring for:

- Fraud indicators
- Suspicious activities
- Risk scoring
- Alert generation

---

### 📱 WhatsApp Banking Assistant

Provides banking support through WhatsApp including:

- Customer engagement
- Financial education
- Product recommendations
- Automated assistance

---

### 🏦 Banking Product Recommendation Engine

Suggests:

- Savings accounts
- Loans
- Insurance products
- Investment options

based on customer profiles and financial behavior.

---

## System Architecture

```text
Customer
    │
    ▼
Next.js Frontend
    │
    ▼
FastAPI Backend
    │
 ┌──┼─────────────┐
 │  │             │
 ▼  ▼             ▼

LLM Engine   Financial Analyzer   Security Monitor
 │               │                  │
 └──────┬────────┴──────────┬───────┘
        ▼
 Recommendation Engine
        │
        ▼
 Dashboard & Reports
