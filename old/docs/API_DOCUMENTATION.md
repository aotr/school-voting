# API Documentation
## School Voting System - REST API Reference

**Version:** 1.0.0  
**Base URL:** `http://localhost:3000`  
**Content-Type:** `application/json`  

---

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Public Endpoints](#public-endpoints)
4. [Admin Endpoints](#admin-endpoints)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Examples](#examples)

---

## Overview

The School Voting System provides a RESTful API for both voter and administrative operations. The API is served by an Express.js server running on port 3000 within the Electron application.

### API Features
- RESTful endpoint design
- JSON request/response format
- Session-based authentication for admin operations
- CORS enabled for local development
- Comprehensive error responses

---

## Authentication

### Session-Based Authentication

Admin operations require an authenticated session. Sessions are created via the login endpoint and maintained through HTTP-only cookies.

**Cookie Details:**
- Name: `connect.sid`
- HttpOnly: `true` (XSS protection)
- Secure: `false` (development), `true` (production)
- MaxAge: 3,600,000ms (1 hour)
- Path: `/`
- SameSite: `Lax`

**Authentication Flow:**
1. POST to `/api/admin/login` with password
2. Server verifies password and creates session
3. Session ID returned in Set-Cookie header
4. Browser automatically includes cookie in subsequent requests
5. Server validates session for protected endpoints

### Protected Endpoints

The following endpoints require an active admin session:
- `POST /api/admin/login`
- `POST /api/admin/election`
- `POST /api/admin/candidates`
- `POST /api/admin/reset-votes`
- `GET /api/admin/export`
- `POST /api/admin/password`

---

## Public Endpoints

### 1. GET /api/election
**Description:** Retrieve active election and candidates  
**Authentication:** Not required  
**Method:** GET  

**Response:** 200 OK
```json
{
  "election": {
    "id": 1,
    "year": 2026,
    "title": "School Election 2026",
    "votingOpen": true
  },
  "candidates": [
    {
      "id": 1,
      "code": "tuhina-khatun",
      "name": "Tuhina Khatun",
      "tagline": "Clock",
      "symbolPath": "assets/symbols/clock.svg",
      "votes": 15
    },
    {
      "id": 2,
      "code": "jeanifer-mandi",
      "name": "Jeanifer Mandi",
      "tagline": "Galaxy",
      "symbolPath": "assets/symbols/galaxy.svg",
      "votes": 12
    }
  ],
  "totalVotes": 27
}
```

**Error Response:** 500 Internal Server Error
```json
{
  "error": "No active election found",
  "statusCode": 500
}
```

**Example Request:**
```bash
curl http://localhost:3000/api/election
```

---

### 2. POST /api/vote/:candidateId
**Description:** Record a vote for a candidate  
**Authentication:** Not required  
**Method:** POST  
**Parameters:**
- `candidateId` (path parameter, integer): ID of candidate to vote for

**Request Body:**
```json
{}
```

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Vote recorded successfully",
  "totalVotes": 28
}
```

**Error Responses:**

400 Bad Request - Invalid candidate ID:
```json
{
  "error": "Failed to record vote",
  "statusCode": 400
}
```

500 Internal Server Error - Database error:
```json
{
  "error": "Failed to record vote",
  "statusCode": 500
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/vote/1
```

**Example Response (Success):**
```json
{
  "success": true,
  "message": "Vote recorded successfully",
  "totalVotes": 28
}
```

---

### 3. GET /api/results
**Description:** Get voting results and candidate rankings  
**Authentication:** Not required  
**Method:** GET  

**Response:** 200 OK
```json
[
  {
    "candidateId": 1,
    "name": "Tuhina Khatun",
    "code": "tuhina-khatun",
    "votes": 15,
    "percentage": 55.56,
    "rank": 1
  },
  {
    "candidateId": 2,
    "name": "Jeanifer Mandi",
    "code": "jeanifer-mandi",
    "votes": 12,
    "percentage": 44.44,
    "rank": 2
  }
]
```

**Example Request:**
```bash
curl http://localhost:3000/api/results
```

---

## Admin Endpoints

### 4. POST /api/admin/login
**Description:** Authenticate as admin and create session  
**Authentication:** Not required (initial login)  
**Method:** POST  

**Request Body:**
```json
{
  "password": "admin123"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Admin login successful",
  "authenticated": true
}
```

**Error Response:** 401 Unauthorized
```json
{
  "success": false,
  "error": "Invalid password",
  "authenticated": false,
  "statusCode": 401
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "admin123"}'
```

---

### 5. POST /api/admin/logout
**Description:** Logout admin and destroy session  
**Authentication:** Required (admin session)  
**Method:** POST  

**Request Body:**
```json
{}
```

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Admin logged out successfully"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/admin/logout \
  -H "Content-Type: application/json"
```

---

### 6. GET /api/admin/status
**Description:** Check admin session status  
**Authentication:** Not required  
**Method:** GET  

**Response (Authenticated):** 200 OK
```json
{
  "authenticated": true,
  "message": "Admin session active"
}
```

**Response (Not Authenticated):** 200 OK
```json
{
  "authenticated": false,
  "message": "No admin session"
}
```

**Example Request:**
```bash
curl http://localhost:3000/api/admin/status
```

---

### 7. POST /api/admin/election
**Description:** Update election configuration  
**Authentication:** Required  
**Method:** POST  

**Request Body:**
```json
{
  "id": 1,
  "title": "School Election 2026",
  "year": 2026,
  "votingOpen": false
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Election updated successfully",
  "election": {
    "id": 1,
    "title": "School Election 2026",
    "year": 2026,
    "votingOpen": false
  }
}
```

**Error Response:** 400 Bad Request
```json
{
  "error": "Invalid election data",
  "statusCode": 400
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/admin/election \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "title": "School Election 2026",
    "year": 2026,
    "votingOpen": false
  }'
```

---

### 8. POST /api/admin/candidates
**Description:** Manage candidates (create, update, delete)  
**Authentication:** Required  
**Method:** POST  

**Request Body (Create):**
```json
{
  "action": "create",
  "data": {
    "electionId": 1,
    "code": "new-candidate",
    "name": "New Candidate",
    "tagline": "Symbol Name",
    "symbolPath": "assets/symbols/symbol.svg"
  }
}
```

**Request Body (Update):**
```json
{
  "action": "update",
  "data": {
    "id": 1,
    "name": "Updated Name",
    "tagline": "Updated Tagline",
    "symbolPath": "assets/symbols/new-symbol.svg"
  }
}
```

**Request Body (Delete):**
```json
{
  "action": "delete",
  "data": {
    "id": 1
  }
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Candidate created successfully",
  "candidates": [
    {
      "id": 1,
      "code": "tuhina-khatun",
      "name": "Tuhina Khatun",
      "tagline": "Clock",
      "symbolPath": "assets/symbols/clock.svg",
      "votes": 15
    }
  ]
}
```

**Error Response:** 400 Bad Request
```json
{
  "error": "Invalid candidate data",
  "statusCode": 400
}
```

**Example Requests:**
```bash
# Create candidate
curl -X POST http://localhost:3000/api/admin/candidates \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create",
    "data": {
      "electionId": 1,
      "code": "new-candidate",
      "name": "New Candidate",
      "tagline": "Symbol Name",
      "symbolPath": "assets/symbols/symbol.svg"
    }
  }'

# Update candidate
curl -X POST http://localhost:3000/api/admin/candidates \
  -H "Content-Type: application/json" \
  -d '{
    "action": "update",
    "data": {
      "id": 1,
      "name": "Updated Name",
      "tagline": "Updated Tagline"
    }
  }'

# Delete candidate
curl -X POST http://localhost:3000/api/admin/candidates \
  -H "Content-Type: application/json" \
  -d '{
    "action": "delete",
    "data": {"id": 1}
  }'
```

---

### 9. POST /api/admin/reset-votes
**Description:** Reset all votes (clear voting data)  
**Authentication:** Required  
**Method:** POST  

**Request Body:**
```json
{
  "confirmation": true
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "message": "All votes reset successfully",
  "totalVotes": 0
}
```

**Error Response (No Confirmation):** 400 Bad Request
```json
{
  "error": "Reset confirmation required",
  "statusCode": 400
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/admin/reset-votes \
  -H "Content-Type: application/json" \
  -d '{"confirmation": true}'
```

---

### 10. GET /api/admin/export
**Description:** Export voting data as JSON file  
**Authentication:** Required  
**Method:** GET  

**Response:** 200 OK (file download)
**Content-Type:** application/json  
**Headers:**
```
Content-Disposition: attachment; filename="voting-export-2026-05-06.json"
```

**Response Body (JSON):**
```json
{
  "election": {
    "id": 1,
    "year": 2026,
    "title": "School Election 2026",
    "votingOpen": false,
    "createdAt": "2026-05-06T10:00:00Z"
  },
  "candidates": [
    {
      "id": 1,
      "code": "tuhina-khatun",
      "name": "Tuhina Khatun",
      "tagline": "Clock",
      "symbolPath": "assets/symbols/clock.svg",
      "votes": 15
    }
  ],
  "votes": [
    {
      "id": 1,
      "candidateId": 1,
      "votedAt": "2026-05-06T10:05:00Z"
    }
  ],
  "totalVotes": 15,
  "exportedAt": "2026-05-06T11:00:00Z"
}
```

**Example Request:**
```bash
curl http://localhost:3000/api/admin/export \
  --output voting-export.json
```

---

### 11. POST /api/admin/password
**Description:** Change admin password  
**Authentication:** Required  
**Method:** POST  

**Request Body:**
```json
{
  "currentPassword": "admin123",
  "newPassword": "newPassword123"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Response:** 401 Unauthorized
```json
{
  "error": "Current password is incorrect",
  "statusCode": 401
}
```

**Error Response:** 400 Bad Request
```json
{
  "error": "New password does not meet requirements",
  "statusCode": 400
}
```

**Password Requirements:**
- Minimum 8 characters
- Cannot be empty
- Cannot be same as current password

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/admin/password \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "admin123",
    "newPassword": "newPassword123"
  }'
```

---

## Error Handling

### Error Response Format
All error responses follow this standard format:

```json
{
  "error": "Error description",
  "statusCode": 400,
  "timestamp": "2026-05-06T10:30:00Z"
}
```

### Common HTTP Status Codes

| Status | Meaning | Typical Causes |
|--------|---------|---|
| 200 | OK | Successful request |
| 400 | Bad Request | Invalid input, missing fields |
| 401 | Unauthorized | Invalid password, expired session |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Database error, server exception |

### Error Messages

| Error | Status | Description |
|-------|--------|-------------|
| `No active election found` | 500 | No election configured |
| `Failed to record vote` | 400 | Vote not recorded (candidate not found) |
| `Invalid password` | 401 | Admin login failed |
| `Invalid election data` | 400 | Election update failed |
| `Invalid candidate data` | 400 | Candidate operation failed |
| `Reset confirmation required` | 400 | Must confirm reset |

---

## Rate Limiting

Currently, there is **no rate limiting** implemented. Future versions may include:
- Rate limiting per IP address
- Throttling on vote endpoint
- Admin operation logging with limits

---

## CORS Configuration

CORS is enabled for local development:

```javascript
app.use(cors());
```

This allows requests from any origin during development. **For production, this should be restricted:**

```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

## Examples

### Complete Voting Flow

**Step 1: Get Election Info**
```bash
curl http://localhost:3000/api/election
```

**Step 2: Vote for Candidate**
```bash
curl -X POST http://localhost:3000/api/vote/1
```

**Step 3: Check Results**
```bash
curl http://localhost:3000/api/results
```

### Complete Admin Flow

**Step 1: Login**
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "admin123"}'
```

**Step 2: Update Election**
```bash
curl -X POST http://localhost:3000/api/admin/election \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "title": "New Title",
    "year": 2026,
    "votingOpen": false
  }'
```

**Step 3: Get Results**
```bash
curl http://localhost:3000/api/results
```

**Step 4: Export Data**
```bash
curl http://localhost:3000/api/admin/export \
  --output voting-backup.json
```

**Step 5: Logout**
```bash
curl -X POST http://localhost:3000/api/admin/logout
```

---

## Changelog

### Version 1.0.0 (Current)
- Initial API release
- Public voting endpoints
- Admin authentication endpoints
- Candidate management endpoints
- Data export functionality
- Session-based authentication

---

## Document Info

**Last Updated:** May 6, 2026  
**API Version:** 1.0.0  
**Status:** Production Ready  

