# 🔑 ADMIN — Role Overview

## Role Definition
The **Admin** is the super-user of the PropEx platform with unrestricted access to all modules, data, and configurations. The Admin is responsible for managing the entire platform — approving users, overseeing all properties and transactions, resolving disputes, and maintaining system health.

---

## 👤 Who is an Admin?
- The PropEx platform owner or system administrator
- A trusted team member responsible for platform operations
- The person managing backend configurations and user roles
- There should be **very few Admin accounts** on the platform

---

## 🎯 Primary Goal
Ensure the platform operates smoothly by managing all users, properties, transactions, and system configurations while maintaining data integrity, security, and compliance.

---

## ✅ What an Admin CAN DO

### 🔐 Account & Authentication
- [x] Login to the dedicated Admin control panel
- [x] Logout securely
- [x] Update own admin profile
- [x] Change password
- [x] Manage other admin accounts (create/deactivate)
- [x] Reset any user's password

### 👥 User Management (All Users)
- [x] View all registered users (Buyers, Tenants, Managers, Owners)
- [x] Search and filter users by name, email, role, or date
- [x] View any individual user's full profile and activity
- [x] **Create new user accounts** manually
- [x] **Edit any user's profile** details
- [x] **Delete or deactivate** any user account
- [x] **Change any user's role** (e.g. Buyer → Tenant, Tenant → Manager)
- [x] Suspend or ban accounts violating platform policies
- [x] Reactivate suspended accounts
- [x] View user registration trends and growth charts

### 🏠 Property Management (All Properties)
- [x] View all properties listed across the platform
- [x] Add, edit, or delete any property listing
- [x] Approve or reject property listings (if moderation is enabled)
- [x] Mark properties as Featured or Verified
- [x] Flag properties for policy violations
- [x] View property performance analytics across all owners

### 👔 Manager & Owner Oversight
- [x] View all Owner accounts and their property portfolios
- [x] View all Manager accounts and their assigned properties
- [x] Assign or remove Managers from any property
- [x] View all manager-tenant interactions
- [x] Resolve disputes between Owners and Managers

### 👥 Tenant Oversight
- [x] View all tenant records across the platform
- [x] View any tenant's lease, payment history, and maintenance requests
- [x] Resolve disputes between tenants and managers/owners
- [x] Manually update tenant status if needed

### 📄 Lease Management (All Leases)
- [x] View all lease agreements across the platform
- [x] Edit or override lease details if required
- [x] Terminate any lease agreement in case of policy violations
- [x] View lease expiry status for all active leases

### 💰 Payment & Financial Oversight
- [x] View all payment records across the entire platform
- [x] View platform-wide revenue summaries:
  - Total rent collected
  - Total overdue dues
  - Monthly/Annual transaction volumes
- [x] Investigate and resolve payment disputes
- [x] Manually update payment records if correction is needed
- [x] View financial health of the platform (if subscription model)

### 🛠️ Maintenance Oversight
- [x] View all maintenance requests across all properties
- [x] Escalate unresolved or critical requests
- [x] Monitor overall maintenance performance metrics

### 🔔 Notification & Communication Management
- [x] Send **system-wide announcements** to all users
- [x] Send targeted notifications to specific users or roles
- [x] Manage notification templates (rent due, lease expiry, etc.)
- [x] Configure email/SMS notification settings
- [x] View all sent notification logs

### 📊 Platform-Wide Analytics & Reports
- [x] View global analytics dashboard:
  - Total registered users (by role)
  - Total properties on platform
  - Overall occupancy rate
  - Platform-wide revenue
  - New registrations per month
  - Active vs inactive listings
- [x] View property performance across all Owners
- [x] View payment trend reports (monthly/quarterly/annual)
- [x] Generate and download any report in PDF/CSV/Excel
- [x] View audit logs of all user and system activity

### ⚙️ Platform Settings & Configuration
- [x] Manage platform-wide settings:
  - Enable/disable user registrations
  - Enable/disable property listing moderation
  - Set platform name, logo, and contact info
- [x] Manage email templates for automated notifications
- [x] Configure late fee rules and payment reminder schedules
- [x] Manage supported property types and amenities lists
- [x] Configure roles and permissions (if dynamic RBAC)
- [x] Monitor server health and API status

### 🔍 Audit & Compliance
- [x] View full audit trail of all user actions
- [x] Track login history for all users
- [x] Monitor failed login attempts and suspicious activity
- [x] Export audit logs for compliance or legal purposes
- [x] Manage data retention policies

### 📁 Document Management
- [x] Access all documents on the platform (leases, ID proofs, agreements)
- [x] Delete inappropriate or invalid documents
- [x] Manage document storage configurations

---

## ❌ What an Admin CANNOT DO

### 🚫 Ethical & Legal Restrictions
- [ ] Impersonate another user without an explicit audit trail
- [ ] Permanently delete financial transaction records (only soft-delete for audit)
- [ ] Access private messages without a valid reported dispute
- [ ] Override legal lease obligations without proper authorization

### 🚫 Technical Boundaries
- [ ] Directly modify the database without going through APIs
- [ ] Bypass 2FA or security protocols set at the infrastructure level
- [ ] Access cloud provider controls (AWS/Azure/GCP) through the platform

---

## 📊 Dashboard Overview

```
Admin Control Panel
├── Platform Overview Cards
│   ├── Total Users (by Role)
│   ├── Total Properties
│   ├── Total Active Leases
│   ├── Platform Revenue
│   └── Open Disputes / Issues
├── User Management
│   ├── All Users Table (Search, Filter, Edit, Delete)
│   ├── Role Management
│   └── Suspended Accounts
├── Property Management
│   ├── All Listings (Approve / Reject / Feature)
│   └── Flagged Properties
├── Lease Management
│   └── All Leases (View / Edit / Terminate)
├── Payment Management
│   ├── All Transactions
│   └── Dispute Resolution
├── Maintenance Oversight
├── Notification Center
│   ├── System Announcements
│   └── Notification Templates
├── Platform Analytics
│   ├── User Growth Charts
│   ├── Revenue Trends
│   └── Occupancy Rate Charts
├── Platform Settings
│   ├── General Settings
│   ├── Email Configuration
│   ├── Fee & Reminder Rules
│   └── Role Permissions
├── Audit Logs
└── Admin Profile & Security
```

---

## 🔄 Working Flow

The typical operational flow for an **Admin** involves the following steps:

1. **System Health Check**: The Admin begins by reviewing the global dashboard to monitor platform activity, new registrations, and revenue trends.
2. **User Moderation**: 
   - The Admin reviews new user registrations.
   - They verify identities and roles (especially for Owners and Managers).
   - They handle role upgrades or account suspensions as needed.
3. **Property Moderation**: 
   - The Admin reviews new property listings to ensure they comply with platform policies.
   - They flag or remove fraudulent or inappropriate listings.
4. **Platform Configuration**:
   - The Admin updates global settings, such as late fee percentages or notification templates.
   - They maintain the list of supported amenities and property types.
5. **Issue Resolution**:
   - The Admin monitors the dispute queue for unresolved payment or lease issues.
   - They act as the final authority in disputes between Owners, Managers, and Tenants.
6. **Communication**:
   - The Admin sends platform-wide announcements for maintenance, updates, or policy changes.
7. **Audit & Analytics**:
   - The Admin periodically reviews audit logs to ensure security and compliance.
   - They generate and export high-level financial reports for platform stakeholders.

---

## 🔄 Role Relationships

| Relationship       | Direction        | Description                                      |
|--------------------|------------------|--------------------------------------------------|
| Admin → All Users  | Full Control     | Admin manages all users and their roles          |
| Admin → Owners     | Oversight        | Admin can view/edit/delete Owner accounts        |
| Admin → Managers   | Oversight        | Admin can manage Manager assignments             |
| Admin → Tenants    | Oversight        | Admin resolves tenant disputes                   |
| Admin → Platform   | Full Control     | Admin controls all system settings               |

---

## 🗄️ Database Reference

```json
{
  "_id": "ObjectId",
  "name": "PropEx Admin",
  "email": "admin@propex.com",
  "password": "hashed_password",
  "role": "admin",
  "phone": "9876543210",
  "permissions": ["all"],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

## 🔐 Key API Endpoints

| Method | Endpoint                          | Description                            |
|--------|-----------------------------------|----------------------------------------|
| GET    | `/api/admin/dashboard`            | Platform-wide stats overview           |
| GET    | `/api/admin/users`                | List all users                         |
| POST   | `/api/admin/users`                | Create a new user manually             |
| PUT    | `/api/admin/users/:id`            | Edit any user's profile or role        |
| DELETE | `/api/admin/users/:id`            | Delete or deactivate a user account    |
| GET    | `/api/admin/properties`           | List all properties                    |
| PUT    | `/api/admin/properties/:id`       | Edit any property                      |
| DELETE | `/api/admin/properties/:id`       | Delete any property                    |
| GET    | `/api/admin/leases`               | View all leases                        |
| GET    | `/api/admin/payments`             | View all payment records               |
| GET    | `/api/admin/analytics`            | Platform-wide analytics                |
| GET    | `/api/admin/audit-logs`           | View full audit logs                   |
| POST   | `/api/admin/notifications/send`   | Send system-wide announcements         |
| GET    | `/api/admin/settings`             | Get platform settings                  |
| PUT    | `/api/admin/settings`             | Update platform settings               |

---

## 🔒 Security Best Practices for Admin

- Admin login should enforce **Two-Factor Authentication (2FA)**
- Admin accounts should have **IP whitelisting** where possible
- All Admin actions must be logged in the **audit trail**
- Admin credentials must use **strong password policy** (min 12 chars, special characters)
- Admin session tokens should have **short expiry** (e.g., 2 hours)
- There should be **minimum Admin accounts** on the platform

---

*Last Updated: April 2026 | PropEx Platform v1.0*
