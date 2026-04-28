# 🏢 OWNER — Role Overview

## Role Definition
An **Owner** is a property owner who lists and oversees their real estate assets on the PropEx platform. Owners have full control over their own properties and can assign Managers to handle day-to-day operations. They have a high-level view of their entire property portfolio including financials, tenants, and lease status.

---

## 👤 Who is an Owner?
- Individual property owners listing properties for rent
- Real estate investors managing a portfolio of properties
- Landlords who may self-manage or delegate to Managers
- Housing societies or small real estate firms

---

## 🎯 Primary Goal
List and manage their property portfolio, monitor financial performance, oversee Managers and Tenants, and maintain full visibility over all lease and payment operations.

---

## ✅ What an Owner CAN DO

### 🔐 Account & Authentication
- [x] Register as an Owner during signup
- [x] Login with email and password
- [x] Logout securely
- [x] Update personal profile (name, phone, profile photo, company name)
- [x] Change account password
- [x] Reset password via email

### 🏠 Property Management (Own Properties)
- [x] Add new property listings with full details
- [x] Edit any of their property listings at any time
- [x] Delete their own property listings
- [x] View complete property portfolio in one dashboard
- [x] Mark properties as Active, Inactive, or Under Maintenance
- [x] View occupancy status of all units
- [x] View property performance (vacancy duration, revenue per unit)

### 👔 Manager Assignment
- [x] Assign a registered Manager to one or more of their properties
- [x] Remove/unassign a Manager from a property
- [x] View which Manager is managing which property
- [x] Assign multiple properties to a single Manager

### 👥 Tenant Oversight
- [x] View all tenants across all their properties
- [x] View individual tenant profiles and documents
- [x] Add tenants directly (if self-managing without a Manager)
- [x] Remove/unassign tenants from properties
- [x] View tenant payment behavior and history

### 📄 Lease Agreement Management
- [x] View all lease agreements across all owned properties
- [x] Create, upload, and manage lease documents
- [x] Renew or terminate lease agreements
- [x] Receive lease expiry alerts (30/15/7 days)

### 💰 Financial Management
- [x] View complete payment history across ALL owned properties
- [x] View financial summary dashboard (revenue, dues, expenses, net income)
- [x] Record payments directly (if self-managing)
- [x] Generate and download financial reports (PDF/CSV/Excel)
- [x] View late fee collection records

### 🛠️ Maintenance Oversight
- [x] View all maintenance requests across all properties
- [x] Monitor maintenance status and costs

### 📊 Analytics & Reports (Full Portfolio)
- [x] View overall portfolio occupancy rate
- [x] View monthly and annual revenue charts
- [x] View property-wise performance comparison
- [x] View tenant turnover rate and vacancy analytics
- [x] Download comprehensive portfolio reports

### 🔔 Notifications & Communication
- [x] Receive all automated platform alerts
- [x] Send announcements to tenants of specific properties
- [x] Send messages to assigned Managers
- [x] Configure notification preferences

---

## ❌ What an Owner CANNOT DO

### 🚫 Scope Restrictions
- [ ] View or access other owners' properties or data
- [ ] Manage tenants of properties they do not own
- [ ] Access other owners' financial records or analytics

### 🚫 Platform Administration
- [ ] Access the Admin control panel
- [ ] Delete user accounts from the platform
- [ ] Change another user's role across the platform
- [ ] Modify platform-wide settings or configurations
- [ ] View global platform analytics (all owners combined)
- [ ] Approve or reject new user registrations

---

## 📊 Dashboard Overview

```
Owner Dashboard
├── Portfolio Summary Cards
│   ├── Total Properties
│   ├── Total Active Tenants
│   ├── Monthly Revenue
│   ├── Overdue Dues
│   └── Vacant Properties Count
├── Property Portfolio (All Owned Properties)
├── Manager Overview (Assigned Managers)
├── Tenant Overview (All Tenants)
├── Lease Management (All Leases)
├── Financial Dashboard
│   ├── Revenue Chart (Monthly/Annual)
│   ├── Overdue Summary Table
│   └── Expense Tracker
├── Maintenance Overview
├── Document Center
├── Analytics & Reports
└── Profile & Settings
```

---

## 🔄 Working Flow

The typical operational flow for an **Owner** involves the following steps:

1. **Portfolio Setup**: The Owner registers and adds their properties to the platform with full details and media.
2. **Manager Delegation**: 
   - The Owner identifies properties that need professional management.
   - They search for or invite a **Manager** and assign them to specific properties.
3. **High-Level Oversight**: 
   - The Owner monitors the Manager's activity, such as new tenant onboarding and rent collection.
   - They review the financial dashboard to ensure the portfolio is generating expected revenue.
4. **Maintenance Approval**: 
   - The Owner reviews maintenance costs reported by the Manager.
   - They approve major repairs or upgrades when necessary.
5. **Financial Review**:
   - The Owner periodically generates and downloads comprehensive portfolio reports for tax and planning purposes.
6. **Lease Renewal & Strategy**:
   - The Owner reviews upcoming lease expiries and discusses rental strategy (e.g., rent increases) with their Managers.
7. **Expansion**:
   - The Owner adds new acquisitions to the platform and expands their managed portfolio.

---

## 🔄 Role Relationships

| Relationship    | Direction        | Description                                      |
|-----------------|------------------|--------------------------------------------------|
| Admin → Owner   | Approves/Manages | Admin oversees all Owner accounts                |
| Owner → Manager | Assigns          | Owner assigns Managers to manage properties      |
| Owner → Tenant  | Oversees         | Owner has visibility of all tenants              |

---

## 🗄️ Database Reference

```json
{
  "_id": "ObjectId",
  "name": "Suresh Reddy",
  "email": "suresh@propex.com",
  "role": "owner",
  "phone": "9876543210",
  "company": "Reddy Properties Pvt Ltd",
  "ownedProperties": ["propertyId1", "propertyId2"],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

## 🔐 Key API Endpoints

| Method | Endpoint                             | Description                    |
|--------|--------------------------------------|--------------------------------|
| GET    | `/api/owner/dashboard`               | Portfolio dashboard stats      |
| GET    | `/api/owner/properties`              | List all owned properties      |
| POST   | `/api/properties`                    | Add new property               |
| PUT    | `/api/properties/:id`                | Edit owned property            |
| DELETE | `/api/properties/:id`                | Delete owned property          |
| PUT    | `/api/properties/:id/assign-manager` | Assign manager to property     |
| GET    | `/api/owner/tenants`                 | View all tenants               |
| GET    | `/api/owner/analytics`               | Full portfolio analytics       |
| GET    | `/api/owner/reports`                 | Download financial reports     |

---

*Last Updated: April 2026 | PropEx Platform v1.0*
