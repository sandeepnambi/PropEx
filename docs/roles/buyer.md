# 🛒 BUYER — Role Overview

## Role Definition
A **Buyer** is a registered user who is actively browsing the PropEx platform to find rental or purchase properties. They have not yet been assigned to any property and do not have an active lease. A Buyer can transition into a **Tenant** once a Manager or Owner assigns them to a property.

---

## 👤 Who is a Buyer?
- First-time visitors who register on the platform
- Users searching for properties to rent or buy
- Users who have not yet signed a lease agreement
- Property seekers comparing multiple listings

---

## 🎯 Primary Goal
Browse and discover properties, contact managers/owners, and shortlist properties of interest.

---

## ✅ What a Buyer CAN DO

### 🔐 Account & Authentication
- [x] Register a new account on PropEx
- [x] Login with email and password
- [x] Logout securely
- [x] Update personal profile (name, phone, profile photo)
- [x] Change account password
- [x] Reset password via email (Forgot Password)

### 🏠 Property Browsing
- [x] Browse all **available property listings**
- [x] Search properties by location, city, or area
- [x] Filter properties by:
  - Price range (min/max rent)
  - Property type (apartment, villa, studio, etc.)
  - Number of bedrooms/bathrooms
  - Amenities (parking, gym, pool, etc.)
  - Availability status
- [x] View detailed property page including:
  - Property images (gallery)
  - Location on map
  - Rent amount and deposit details
  - List of amenities
  - Owner/Manager contact info
- [x] Sort listings (price low-high, newest first, etc.)

### 💾 Saved & Shortlisted Properties
- [x] Save/bookmark favorite properties
- [x] View saved properties list
- [x] Remove properties from saved list

### 📞 Contact & Inquiry
- [x] Send an inquiry/contact message to the property Manager or Owner
- [x] View contact details of property Manager/Owner
- [x] Submit a rental application or interest form

### 🔔 Notifications
- [x] Receive email confirmation on registration
- [x] Receive reply notifications when manager/owner responds to inquiry

---

## ❌ What a Buyer CANNOT DO

### 🚫 Property Management
- [ ] Add, edit, or delete any property listings
- [ ] Change property availability status
- [ ] Upload property images or documents
- [ ] View properties marked as inactive/hidden

### 🚫 Tenant & Lease Access
- [ ] View any lease agreements
- [ ] Create or sign lease agreements
- [ ] Access tenant dashboard or records
- [ ] View other tenants' information

### 🚫 Payment Access
- [ ] Record or log any payments
- [ ] View payment history (no assigned property yet)
- [ ] Generate payment receipts or financial reports

### 🚫 Maintenance
- [ ] Submit maintenance requests (no assigned property)
- [ ] View or manage maintenance tickets

### 🚫 Administration
- [ ] Access Manager, Owner, or Admin dashboards
- [ ] View analytics or platform reports
- [ ] Manage any other user's data or account
- [ ] Send platform-wide notifications
- [ ] Change any user role or permissions

---

## 📊 Dashboard Overview

```
Buyer Dashboard
├── Profile Summary
├── Property Search & Filters
├── Property Listings (Grid/List View)
├── Saved / Bookmarked Properties
├── Inquiry History
└── Notifications
```

---

## 🔄 Working Flow

The typical journey for a **Buyer** involves the following steps:

1. **Discovery**: The Buyer visits the PropEx platform and uses search/filter tools to find properties matching their needs.
2. **Shortlisting**: 
   - The Buyer saves properties they like to their personal shortlist.
   - They compare features, price, and location across multiple listings.
3. **Inquiry**: 
   - The Buyer sends inquiries to the listed Managers or Owners for properties they are interested in.
   - They receive notifications when a response is received.
4. **Site Visit & Negotiation**: 
   - The Buyer coordinates with the Manager/Owner outside the platform (or via messages) for property visits.
   - They negotiate terms, rent, and security deposit.
5. **Onboarding (Transition to Tenant)**:
   - Once a deal is finalized, the Manager or Owner onboards the Buyer as a Tenant.
   - The user's role is updated to **Tenant**, and they gain access to the lease and payment management tools.

---

## 🔄 Role Transition

| From   | To     | Trigger                                      |
|--------|--------|----------------------------------------------|
| Buyer  | Tenant | Manager/Owner assigns them to a property      |

Once assigned, the user's role upgrades to **Tenant** and they gain access to lease, payment, and maintenance features.

---

## 🗄️ Database Reference (Users Collection)

```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "role": "buyer",
  "profilePhoto": "url_to_photo",
  "phone": "9876543210",
  "savedProperties": ["propertyId1", "propertyId2"],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

## 🔐 API Endpoints Accessible by Buyer

| Method | Endpoint                  | Description                     |
|--------|---------------------------|---------------------------------|
| POST   | `/api/auth/register`      | Register new account            |
| POST   | `/api/auth/login`         | Login                           |
| GET    | `/api/properties`         | Get all available properties    |
| GET    | `/api/properties/:id`     | Get single property detail      |
| GET    | `/api/properties/search`  | Search & filter properties      |
| PUT    | `/api/users/profile`      | Update own profile              |
| POST   | `/api/inquiries`          | Send inquiry to manager/owner   |
| POST   | `/api/users/save/:propId` | Save/unsave a property          |

---

*Last Updated: April 2026 | PropEx Platform v1.0*
