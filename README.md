# Expense Tracker and Financial Dashboard

A full-stack personal finance management system built using React, Node.js, Express, MySQL, and Sequelize, designed to help users efficiently manage income, expenses, and visualize their financial health through interactive charts and reports.


## Tech Stack


| **Category**        | **Technologies**                            |
|----------------------|---------------------------------------------|
| **Frontend**         | React, Axios, Recharts, Tailwind CSS, PostCSS |
| **Backend**          | Node.js, Express.js                         |
| **Database**         | MySQL, Sequelize ORM                        |
| **Encryption & Auth**| JWT, bcrypt.js                              |


## Features
Features

-  User Authentication – Secure login/signup using JWT
-  Add / Edit / Delete Transactions – Manage income and expenses
-  Categorization – Classify transactions (food, rent, salary, etc.)
-  Dashboard Overview – Total income, expenses, and balance summary
-  Visual Analytics – Charts for monthly trends & category-wise spending
-  Recurring Transactions – Auto-added weekly/monthly recurring entries
-  Report Export – Download data as PDF or Excel
-  Responsive Design – Works across all screen sizes 


## API Endpoints (Express.js)

1. Auth Routes

- POST /api/register → Register user
- POST /api/login → Login and return JWT

2. Transaction Routes

- POST /api/transactions → Add new transaction
- GET /api/transactions → Fetch all transactions (filter supported)

- PUT /api/transactions/:id → Update transaction
- DELETE /api/transactions/:id → Delete transaction

3. Dashboard Routes

- GET /api/dashboard/summary → Income, expense, and balance data
- GET /api/dashboard/charts → Category and monthly chart data

4. Export Routes

- GET /api/export/pdf → Generate PDF report
- GET /api/export/excel → Generate Excel report

![Dashboard1](./Screenshot%202025-10-19%20135816.png)
![dashboard2](./Screenshot%202025-10-19%20140125.png)
![Trans](./Screenshot%202025-10-19%20135851.png)

## Future Enhancements

🔔 Email reminders for recurring expenses

📈 AI-based budget recommendations

🌐 Multi-currency & dark mode support

💳 Bank account integration

## Author 

JainamBheda 
