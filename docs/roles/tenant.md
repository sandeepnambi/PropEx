# 🏠 TENANT — Role Overview

## Role Definition
A **Tenant** is a registered user who has been **assigned to a specific property** by a Manager or Owner. They have an active lease agreement and are responsible for paying monthly rent. A Tenant has access to their own lease, payment, and maintenance information only.

---

## 👤 Who is a Tenant?
- Users who have been assigned to a property by a Manager or Owner
- Users with an active or past lease agreement
- Users who pay monthly rent through or tracked by the platform
- Former Buyers who have been onboarded into a property

---

## 🎯 Primary Goal
Track their lease status, view and manage rent payments, submit maintenance requests, and communicate with their property manager.

---

## ✅ What a Tenant CAN DO

### 🔐 Account & Authentication
- [x] Login with email and password
- [x] Logout securely
- [x] Update personal profile (name, phone, profile photo)
- [x] Change account password
- [x] Reset password via email (Forgot Password)

### 🏠 Property Access
- [x] View their **assigned property** details:
  - Property name, address, and images
  - Amenities included
  - Manager/Owner contact information
- [x] View property rules and policies
- [x] Browse other available properties (carry-over from Buyer role)

### 📄 Lease Agreement
- [x] View their active **lease agreement** details:
  - Lease start and end date
  - Monthly rent amount
  - Security deposit information
- [x] Download lease agreement document (PDF)
- [x] View lease renewal status and expiry alerts
- [x] Receive automated notifications before lease expiry (30/15/7 days)

### 💰 Payment Tracking
- [x] View full **payment history** (all months)
- [x] See payment status per month:
  - ✅ Paid
  - ⏳ Pending
  - ❌ Overdue
  - 🔶 Partial
- [x] Download rent receipts for each payment
- [x] Receive rent due reminders via email/SMS
- [x] View total rent paid, pending dues, and late fees

### 🛠️ Maintenance Requests
- [x] Submit a **new maintenance request** with:
  - Issue title and description
  - Priority level (Low / Medium / High)
  - Attach photo of the issue
- [x] Track status of submitted requests:
  - Open → In Progress → Resolved
- [x] View history of all past maintenance requests
- [x] Receive notifications when status is updated

### 🔔 Notifications
- [x] Rent due reminders
- [x] Lease expiry alerts
- [x] Maintenance request status updates
- [x] Announcement messages from Manager/Owner
- [x] View all notifications in notification panel

### 💬 Communication
- [x] Contact their assigned Manager via inquiry/message
- [x] View contact details of Manager and Owner

---

## ❌ What a Tenant CANNOT DO

### 🚫 Property Management
- [ ] Add, edit, or delete any property listings
- [ ] Change property availability or rent amount
- [ ] Upload property images or documents
- [ ] View other tenants' assigned property details

### 🚫 Lease & Payment Management
- [ ] Create, edit, or delete lease agreements
- [ ] Record payments on behalf of themselves or others
- [ ] Edit payment status or amounts
- [ ] View other tenants' payment records

### 🚫 Tenant Management
- [ ] View or access other tenants' profiles or data
- [ ] Assign or remove tenants from properties
- [ ] Approve or reject tenant applications

### 🚫 Administration
- [ ] Access Manager, Owner, or Admin dashboards
- [ ] View platform-wide analytics or reports
- [ ] Manage any other user's data or account
- [ ] Send platform-wide notifications or announcements
- [ ] Change any user role or permissions

---

## 📊 Dashboard Overview

```
Tenant Dashboard
├── Welcome Banner (Property Name + Lease Status)
├── Quick Stats
│   ├── Days Until Lease Expiry
│   ├── Next Rent Due Date
│   └── Outstanding Balance
├── My Property Details
├── Lease Agreement (View + Download)
├── Payment History (Table + Status)
├── Maintenance Requests (Submit + Track)
├── Notifications Panel
└── Profile & Settings
```

---

## 🔄 Working Flow

The typical experience for a **Tenant** involves the following steps:

1. **Activation**: The Tenant's role is activated once a Manager or Owner assigns them to a specific property.
2. **Move-in & Review**: 
   - The Tenant logs in to view their property details and manager contact info.
   - They review and download their digital lease agreement.
3. **Monthly Renting**: 
   - The Tenant receives a notification when rent is due.
   - They pay their rent (via external methods or platform if enabled) and view the updated status in their dashboard.
   - They download rent receipts for their records.
4. **Maintenance Reporting**: 
   - If an issue arises in the property, the Tenant submits a maintenance request with photos.
   - They monitor the progress (Open → In Progress) and receive a notification when it's marked as Resolved.
5. **Lease Monitoring**:
   - The Tenant keeps track of their lease end date.
   - They receive alerts 30, 15, and 7 days before the lease expires to discuss renewal with the Manager.
6. **Move-out/Renewal**:
   - The Tenant coordinates the renewal of the lease or the move-out process.
   - Once the lease ends and they move out, their active status is removed from the property.

---

## 🔄 Role Transition

| From   | To      | Trigger                                              |
|--------|---------|------------------------------------------------------|
| Buyer  | Tenant  | Manager/Owner assigns them to a property             |
| Tenant | (none)  | Lease expires — account remains but becomes inactive |

---

## 🗄️ Database Reference

**Users Collection:**
```json
{
  "_id": "ObjectId",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "hashed_password",
  "role": "tenant",
  "phone": "9876543210",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Tenants Collection:**
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users)",
  "propertyId": "ObjectId (ref: Properties)",
  "leaseStart": "2024-01-01",
  "leaseEnd": "2024-12-31",
  "status": "active"
}
```

**Payments Collection:**
```json
{
  "_id": "ObjectId",
  "tenantId": "ObjectId (ref: Tenants)",
  "amount": 15000,
  "paymentDate": "2024-02-01",
  "status": "paid",
  "month": "February 2024"
}
```

---

## 🔐 API Endpoints Accessible by Tenant

| Method | Endpoint                          | Description                        |
|--------|-----------------------------------|------------------------------------|
| GET    | `/api/tenant/dashboard`           | Get tenant dashboard data          |
| GET    | `/api/tenant/lease`               | View own lease details             |
| GET    | `/api/tenant/payments`            | View own payment history           |
| GET    | `/api/tenant/payments/:id`        | Download single payment receipt    |
| POST   | `/api/maintenance`                | Submit maintenance request         |
| GET    | `/api/maintenance/my`             | View own maintenance requests      |
| GET    | `/api/notifications`              | Get own notifications              |
| PUT    | `/api/users/profile`              | Update own profile                 |

---

*Last Updated: April 2026 | PropEx Platform v1.0*
