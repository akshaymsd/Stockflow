# StockFlow

Mini ERP system for small businesses: products, suppliers, customers, purchases, sales, reports and a dashboard.

Built with Node.js, Express, MySQL and vanilla JavaScript.

## Features
- Product, supplier and customer management (CRUD)
- Purchases that increase stock, using database transactions
- Sales that decrease stock, with stock check and unit price from database
- Reports: low stock list, today's sales, last 7 days sales
- JWT login with admin-only routes (bcrypt password hashing)
- Dashboard with stats, sales chart and product search

## Tech Stack
- **Backend:** Node.js, Express, mysql2
- **Database:** MySQL (transactions, row locking with FOR UPDATE)
- **Auth:** bcrypt, JSON Web Token
- **Frontend:** HTML, CSS, JavaScript (fetch API)

## Setup
1. npm install
2. Create a MySQL database named stockflow and its tables
3. Create a .env file with:
   DB_PASSWORD=your_mysql_password
   JWT_SECRET=your_secret
4. node server.js
5. Open http://localhost:3000/dashboard.html

## API (short)
| Method | Route | Access |
|---|---|---|
| POST | /auth/login | Public |
| GET | /products, /suppliers, /customers | Public |
| POST/PUT/DELETE | /products/:id | Admin |
| POST | /purchases | Logged in |
| POST | /sales | Logged in |
| GET | /reports/... | Public |

## Screenshots
Coming soon.