# Campus Lost & Found Portal

A full-stack web application where students can report lost or found items, search listings, and submit claims.

## Technologies Used
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Authentication:** JWT (JSON Web Tokens)

## Features
- User registration and login (JWT protected)
- Report lost and found items (with optional image URL)
- Search and filter by keyword, category, location, type, and date sorting
- Claim management (submit, approve, reject)
- User dashboard to manage listings and claims
- Admin dashboard with statistics and full control over items/claims
- **Custom Feature:** Duplicate-item alert based on title and category

## Setup Instructions
1. Clone the repository.
2. Run `npm install`.
3. Create a `.env` file with the following:
