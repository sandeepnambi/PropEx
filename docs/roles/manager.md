# 👔 MANAGER — Role Overview

## Role Definition
A **Manager** is a professional user assigned by an **Owner** to manage one or more properties on their behalf. Managers handle day-to-day operations including tenant onboarding, lease creation, payment recording, and maintenance coordination. They are the primary operational point of contact for tenants.

---

## 👤 Who is a Manager?
- Property management professionals employed by Owners
- Real estate agents managing rental properties
- Building supervisors or facility managers
- Users assigned the `manager` role by the Owner or Admin

---

## 🎯 Primary Goal
Efficiently manage assigned properties, maintain tenant relationships, track payments, oversee lease agreements, and handle maintenance operations.

---

## ✅ What a Manager CAN DO

### 🔐 Account & Authentication
- [x] Login with email and password
- [x] Logout securely
- [x] Update personal profile (name, phone, profile photo, bio)
- [x] Change account password
- [x] Reset password via email

### 🏠 Property Management (Assigned Properties Only)
- [x] View all properties assigned to them
- [x] Add new property listings with:
  - Title, description, and type
  - Location, city, and address
  - Monthly rent and security deposit
  - Amenities list
  - Property images (multi-upload)
  - Available/Unavailable status
- [x] Edit existing property details
- [x] Delete property listings (assigned only)
- [x] Mark property as Available or Occupied
- [x] View property occupancy history

### 👥 Tenant Management
- [x] Add new tenants and assign to properties
- [x] View full list of tenants across assigned properties
- [x] View individual tenant profile and details
- [x] Update tenant information (phone, emergency contact, documents)
- [x] Remove/unassign tenant from a property (on lease expiry)
- [x] View tenant history (past properties, payment behavior)
- [x] Upload tenant documents (ID proof, application form)

### 📄 Lease Agreement Management
- [x] Create new lease agreements with:
  - Tenant assignment
  - Property assignment
  - Start date and end date
  - Monthly rent amount
  - Security deposit terms
- [x] Upload signed lease agreement PDF
- [x] View all lease agreements for assigned properties
- [x] Update lease details (before activation)
- [x] Mark lease as Active, Expired, or Terminated
- [x] Renew expiring lease agreements
- [x] Receive automated expiry alerts (30/15/7 days before expiry)
- [x] Send lease renewal reminders to tenants

### 💰 Payment Tracking
- [x] Record monthly rent payments for each tenant
- [x] Set payment status:
  - ✅ Paid
  - ⏳ Pending
  - ❌ Overdue
  - 🔶 Partial
- [x] Apply late fees for overdue payments
- [x] View complete payment history per tenant
- [x] View payment summary across all managed properties:
  - Total collected this month
  - Total overdue amount
  - Total pending amount
- [x] Send payment reminders to tenants (email/SMS)
- [x] Generate and download payment reports (PDF/CSV)
- [x] Issue rent receipts to tenants

### 🛠️ Maintenance Management
- [x] View all maintenance requests from tenants
- [x] Update request status (Open → In Progress → Resolved)
- [x] Assign priority level to requests
- [x] Add resolution notes to requests
- [x] Track repair costs per request
- [x] View maintenance history per property

### 🔔 Notifications & Communication
- [x] Send rent payment reminders to individual tenants
- [x] Send lease renewal reminders
- [x] Broadcast announcements to all tenants of a property
- [x] View all sent and received notifications
- [x] Configure notification preferences (email/SMS)

### 📊 Analytics & Reports (Assigned Properties)
- [x] View occupancy rate per property
- [x] View monthly revenue collected
- [x] View overdue payment summary
- [x] View vacancy duration per unit
- [x] Download financial reports (monthly/annual)
- [x] View maintenance cost summary

### 📁 Document Center
- [x] Upload and manage property documents
- [x] Upload and manage tenant documents
- [x] View all lease agreements in centralized document hub
- [x] Search and filter documents by type, tenant, or date

---

## ❌ What a Manager CANNOT DO

### 🚫 Scope Restrictions
- [ ] Access or manage properties NOT assigned to them
- [ ] View other managers' tenants or payment data
- [ ] Access Owner's personal financial summaries or portfolio
- [ ] Assign themselves to properties (Owner does this)

### 🚫 User Management
- [ ] Delete user accounts from the platform
- [ ] Change user roles (e.g., upgrade Buyer to Tenant directly without Owner)
- [ ] Create or manage Owner accounts
- [ ] Access Admin control panel

### 🚫 Platform Administration
- [ ] Modify platform-wide settings or configurations
- [ ] Access global analytics (all properties across all owners)
- [ ] Approve or reject new Manager accounts
- [ ] Manage billing or subscription for the platform
- [ ] View or modify database configurations

---

## 📊 Dashboard Overview

```
Manager Dashboard
├── KPI Summary Cards
│   ├── Total Managed Properties
│   ├── Total Active Tenants
│   ├── Revenue This Month
│   ├── Overdue Payments Count
│   └── Open Maintenance Requests
├── Properties Panel (Assigned Properties)
├── Tenant Management Panel
├── Lease Management Panel
├── Payment Tracking Panel
├── Maintenance Requests Panel
├── Analytics & Reports
├── Document Center
├── Notifications
└── Profile & Settings
```

---

## 🔄 Working Flow

The typical operational flow for a **Manager** involves the following steps:

1. **Onboarding**: The Manager is assigned to specific properties by an **Owner** or **Admin**.
2. **Property Setup**: The Manager verifies property details, adds/updates images, and sets the current status (Available/Occupied).
3. **Tenant Onboarding**: 
   - A prospective tenant expresses interest.
   - The Manager adds the tenant to the platform (if not already registered).
   - The Manager assigns the tenant to a specific property unit.
4. **Lease Creation**: 
   - The Manager creates a digital lease agreement specifying terms and rent.
   - Both parties review the terms, and the Manager uploads the signed document.
5. **Monthly Operations**:
   - The Manager records rent payments as they are received.
   - The Manager sends reminders for pending or overdue payments.
6. **Maintenance & Support**:
   - The Manager monitors the maintenance queue for new requests.
   - They coordinate repairs and update the request status until resolution.
7. **Lease Termination/Renewal**:
   - As the lease nears expiry, the Manager coordinates with the tenant for renewal or move-out.
   - Upon move-out, the Manager unassigns the tenant and marks the property as Available.

---

## 🔄 Role Relationships

| Relationship | Direction | Description                                     |
|--------------|-----------|-------------------------------------------------|
| Owner → Manager | Assigns | Owner assigns Manager to manage their properties |
| Manager → Tenant | Assigns | Manager onboards Tenants into properties        |
| Manager → Admin | Reports | Admin oversees all Manager activities           |

---

## 🗄️ Database Reference

**Users Collection:**
```json
{
  "_id": "ObjectId",
  "name": "Ravi Kumar",
  "email": "ravi@propex.com",
  "password": "hashed_password",
  "role": "manager",
  "phone": "9876543210",
  "assignedProperties": ["propertyId1", "propertyId2"],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

## 🔐 API Endpoints Accessible by Manager

| Method | Endpoint                             | Description                         |
|--------|--------------------------------------|-------------------------------------|
| GET    | `/api/manager/dashboard`             | Dashboard stats and overview        |
| GET    | `/api/manager/properties`            | List assigned properties            |
| POST   | `/api/properties`                    | Add new property                    |
| PUT    | `/api/properties/:id`                | Edit property                       |
| DELETE | `/api/properties/:id`                | Delete assigned property            |
| GET    | `/api/manager/tenants`               | List all tenants                    |
| POST   | `/api/tenants`                       | Add and assign a tenant             |
| PUT    | `/api/tenants/:id`                   | Update tenant details               |
| GET    | `/api/leases`                        | View all leases                     |
| POST   | `/api/leases`                        | Create new lease                    |
| PUT    | `/api/leases/:id`                    | Update lease                        |
| POST   | `/api/payments`                      | Record payment                      |
| GET    | `/api/payments/property/:id`         | View payments for a property        |
| GET    | `/api/maintenance`                   | View maintenance requests           |
| PUT    | `/api/maintenance/:id`               | Update maintenance status           |
| GET    | `/api/manager/analytics`             | View analytics for assigned props   |
| GET    | `/api/manager/reports`               | Download financial reports          |

---

*Last Updated: April 2026 | PropEx Platform v1.0*
