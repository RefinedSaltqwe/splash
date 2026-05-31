# 💦 Splash

<p align="center">
  <strong>The Operating System for SaaS Businesses</strong>
</p>

<p align="center">
  Payments, subscriptions, tax compliance, fraud prevention, multi-currency support, failed payment recovery, PayPal integration, and everything else your SaaS needs to grow.
</p>

---

## 🚀 Overview

Splash is an all-in-one platform designed to help SaaS businesses manage subscriptions, payments, customers, and revenue operations from a single dashboard.

Instead of stitching together multiple services, Splash provides everything required to run and scale a software business.

---

## ✨ Features

### 💳 Payments

- Stripe Integration
- Subscription Billing
- One-Time Payments
- Payment Tracking
- Revenue Analytics

### 🔄 Subscription Management

- Recurring Billing
- Subscription Plans
- Upgrades & Downgrades
- Trial Management
- Customer Portals

### 🌍 Global Commerce

- Multi-Currency Support
- International Payments
- Global Tax Compliance
- Regional Pricing

### 🛡 Revenue Protection

- Failed Payment Recovery
- Fraud Prevention
- Customer Verification
- Chargeback Monitoring

### 👥 Customer Management

- Customer Profiles
- Account Management
- Billing History
- Activity Tracking

### 📊 Analytics & Reporting

- Revenue Dashboard
- Subscription Metrics
- Customer Insights
- Growth Tracking

### 📅 Operations

- Calendar & Scheduling
- Team Management
- Task Organization
- Workflow Management

---

## 🏗 Platform Architecture

```text
Customers
    │
    ▼
Authentication (Clerk)
    │
    ▼
Splash Dashboard
    │
    ├── Billing
    ├── Customers
    ├── Subscriptions
    ├── Analytics
    ├── Scheduling
    └── Settings
    │
    ▼
Prisma ORM
    │
    ▼
PostgreSQL
```

---

## 🛠 Tech Stack

### Frontend

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Radix UI
- Framer Motion

### Backend

- Next.js App Router
- Prisma ORM
- PostgreSQL

### Authentication

- Clerk

### Payments

- Stripe
- Stripe Elements

### Realtime

- Pusher

### File Uploads

- UploadThing

### Email

- Resend
- Nodemailer

### State Management

- React Query
- Zustand

---

## 📂 Project Structure

```text
src
│
├── app
│   ├── dashboard
│   ├── billing
│   ├── customers
│   ├── subscriptions
│   ├── analytics
│   ├── settings
│   └── api
│
├── components
│   ├── ui
│   ├── dashboard
│   ├── billing
│   ├── customers
│   └── analytics
│
├── lib
│   ├── prisma
│   ├── stripe
│   ├── clerk
│   ├── pusher
│   └── uploadthing
│
├── prisma
│
└── public
```

---

## 🎯 Who Is Splash For?

Splash is built for:

- SaaS Startups
- Software Companies
- Subscription Businesses
- Indie Hackers
- Founders
- Agencies Managing SaaS Products

Whether you're launching your first product or managing thousands of customers, Splash helps simplify the operational side of running a software business.

---

## 🌟 Core Benefits

- Reduce operational complexity
- Increase subscription revenue
- Recover failed payments
- Manage customers efficiently
- Expand globally with confidence
- Scale without adding more tools

---

## 📄 License

Private Project

Copyright © Splash. All rights reserved.
