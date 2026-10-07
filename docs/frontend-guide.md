# Frontend Integration Guide: AI SMS Wrapper

This guide outlines the backend APIs and expected frontend UI flow to integrate the AI SMS Wrapper into the Next.js `apps/web` frontend.

---

## 1. Authentication
All endpoints are protected by the `AtGuard` (Access Token Guard). 
Ensure the user is authenticated via the existing JWT auth system, and attach the token as a Bearer token in the `Authorization` header.

```typescript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // Next.js should handle this via cookies/session
};
```

---

## 2. API Endpoints

### A. Create SMS Template
**Endpoint:** `POST /api/sms/templates`
Creates a new SMS template. The backend AI (System 2 mock) will enhance the content.

**Request:**
```json
{
  "name": "Overdue Payment Notice",
  "content": "Dear {name}, your payment of {amount} is overdue."
}
```
**Response:**
```json
{
  "id": 1,
  "name": "Overdue Payment Notice",
  "content": "Dear {name}, your payment of {amount} is overdue. Please pay to avoid penalties.",
  "isApproved": false,
  "userId": 4
}
```

### B. Evaluate Template (Compliance / Anti-Spam)
**Endpoint:** `POST /api/sms/templates/:id/evaluate`
Runs the template through System 1 (Laya mock) to check for spam/compliance before it can be used in a campaign.

**Response:**
```json
{
  "id": 1,
  "layaScore": 0.1,
  "isApproved": true
}
```
*Note: `isApproved` MUST be `true` to proceed to the Campaign creation.*

### C. Generate Presigned URL for CSV Upload
**Endpoint:** `POST /api/sms/presigned-url`
Instead of uploading massive CSVs directly to the NestJS server, you upload them securely to AWS S3.

**Request:**
```json
{
  "filename": "contacts.csv",
  "contentType": "text/csv"
}
```
**Response:**
```json
{
  "url": "https://test-bucket.s3.amazonaws.com/csv-uploads/uuid-contacts.csv?X-Amz-Signature=...",
  "key": "csv-uploads/uuid-contacts.csv",
  "fullUrl": "https://test-bucket.s3.amazonaws.com/csv-uploads/uuid-contacts.csv"
}
```

### D. Create & Enqueue Campaign
**Endpoint:** `POST /api/sms/campaigns`
Initiates the SMS broadcast. It downloads the uploaded CSV, parses it, interpolates the template variables (e.g., `{name}`), and enqueues jobs into BullMQ.

**Request:**
```json
{
  "name": "October Overdue Campaign",
  "templateId": 1,
  "csvUrl": "https://test-bucket.s3.amazonaws.com/csv-uploads/uuid-contacts.csv"
}
```
**Response:**
```json
{
  "id": 5,
  "name": "October Overdue Campaign",
  "status": "DRAFT",
  "templateId": 1,
  "userId": 4
}
```

---

## 3. Recommended Frontend Flow

### Step 1: Template Drafting UI
1. Display a form with `Template Name` and `Template Content` text areas.
2. Instruct the user that they can use `{variable}` syntax which must match the column headers in their CSV (e.g., `{phone}`, `{name}`).
3. Call `POST /api/sms/templates`.

### Step 2: Compliance Check
1. Show the generated AI-enhanced template to the user.
2. Provide an "Evaluate Compliance" button.
3. Call `POST /api/sms/templates/:id/evaluate`.
4. If `isApproved` is false, show a red error badge and block the user from proceeding. If true, show a green success badge.

### Step 3: CSV Upload (Client-to-S3)
1. Display a file input `accept=".csv"`.
2. When a file is selected:
   - Call `POST /api/sms/presigned-url` to get the `url` and `fullUrl`.
   - Perform a native `fetch(url, { method: 'PUT', body: file })` directly from the browser. 
3. **CRITICAL:** Ensure the CSV contains a `phone`, `phoneNumber`, or `phone_number` column.

### Step 4: Launch Campaign
1. After the S3 upload finishes (status 200), reveal the "Launch Campaign" button.
2. Send the `templateId`, Campaign `name`, and the `fullUrl` from the presigned URL response to `POST /api/sms/campaigns`.
3. Redirect the user to a Success/Dashboard page to monitor the queue status.

---

## 4. Reference Code
A boilerplate Next.js implementation of this exact flow has been scaffolded at:
`apps/web/src/app/[locale]/(app)/sms-campaign/page.tsx`

Frontend developers can review this file for a working example of the S3 Presigned URL upload and API integrations.
