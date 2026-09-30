# 🌾 Smart Farmer Procurement System

### Simplifying Agricultural Procurement Through Digital Technology

The **Smart Farmer Procurement System** is a web-based platform designed to simplify agricultural procurement by digitizing the process of slot booking, farmer registration, queue management, crop quality verification, weighing, procurement tracking, and payment status management.

The system aims to reduce waiting time, improve transparency, organize procurement center operations, and provide farmers and administrators with a centralized platform to manage procurement activities.

---

## 🚩 Problem Statement

Traditional agricultural procurement processes can involve long queues, inefficient scheduling, manual recordkeeping, and limited visibility into procurement and payment status.

Our solution provides a centralized digital platform that helps farmers book procurement slots and enables administrators to manage bookings, queues, quality checks, procurement records, and payment information efficiently.

## 💡 Key Features

### 👨‍🌾 Farmer Module

* Farmer registration and login.
* Procurement slot booking.
* Booking confirmation and token details.
* Booking and queue status tracking.
* Procurement and payment status visibility.

### 🗓️ Slot Booking Management

* Digital booking management.
* Slot availability and booking records.
* Organized allocation of procurement appointments.
* Prevention of duplicate active bookings, where enforced by the application.

### 🚦 Queue Management

* Token-based queue organization.
* Farmer arrival and check-in management.
* Queue status updates.
* Better visibility into procurement center operations.

### ⚖️ Quality and Procurement Management

* Crop quality and moisture information recording.
* Weighing and procurement record management.
* Procurement progress tracking.
* Centralized storage of procurement information.

### 💳 Payment Tracking

* Payment amount and status records.
* Visibility into payment progress.
* Digital procurement records for reference.

### 🛡️ Admin Dashboard

* Administrator login.
* Farmer and booking management.
* Queue and procurement status updates.
* Quality, weighing, and payment record management.

---

## 🛠️ Technology Stack

| Layer                       | Technology                |
| --------------------------- | ------------------------- |
| Frontend                    | HTML, CSS, JavaScript     |
| Backend                     | Node.js                   |
| API Framework               | Express.js                |
| Database                    | SQLite                    |
| Client–Server Communication | Fetch API, REST endpoints |
| Session / Client-Side Data  | Browser localStorage      |
| Development Environment     | Visual Studio Code        |
| Version Control             | Git and GitHub            |

---

## 🏗️ System Architecture

```text
        Farmer / Administrator
                  |
                  v
         Frontend Web Interface
          HTML, CSS, JavaScript
                  |
                  v
             Fetch API
                  |
                  v
         Node.js + Express.js
                  |
                  v
             API Routes
    +-------------+-------------+
    |             |             |
 Farmer Routes Booking Routes Queue Routes
    |             |             |
    +-------------+-------------+
                  |
                  v
             SQLite Database
                  |
                  v
       Procurement Records,
       Quality and Payments
```

The frontend communicates with the backend through API requests. The backend handles application logic and database operations, while SQLite stores the application's persistent records.

---

## 🗄️ Database Design

The database contains core tables for the following entities:

* **Farmers** — farmer details and registration information.
* **Bookings** — procurement slot and booking information.
* **Quality** — crop quality and moisture records.
* **Procurement** — weighing and procurement details.
* **Payments** — payment amount and status information.
* **Notifications** — notification records.
* **Admins** — administrator account information.

Queue information is managed using booking and token records in the current prototype.

The SQLite database file is created automatically by the database initialization code when configured to do so.

---

## 📁 Project Structure

```text
smart-farmer-procurement/
│
├── backend/
│   ├── server.js
│   ├── database.js
│   └── routes/
│       ├── farmerRoutes.js
│       ├── bookingRoutes.js
│       ├── queueRoutes.js
│       └── adminRoutes.js
│
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── css/
│   └── js/
│
├── database/
│   └── farmer.db          # Generated database file
│
├── .gitignore
├── package.json
└── README.md
```

*The structure above illustrates the intended organization. Keep the filenames and folders aligned with your actual project files.*

---

## 🚀 Getting Started

### Prerequisites

Install the following before running the project:

* [Node.js](https://nodejs.org/)
* npm (included with Node.js)
* [Git](https://git-scm.com/)
* [Visual Studio Code](https://code.visualstudio.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/tmurari2007-crypto/smart-farmer-procurement.git
```

### 2. Open the Project

```bash
cd smart-farmer-procurement
```

Open this folder in Visual Studio Code.

### 3. Install Dependencies

Navigate to the backend folder:

```bash
cd backend
npm install
```

Ensure the required dependencies, including Express, CORS, and SQLite3, are listed in the backend's `package.json`.

### 4. Start the Backend Server

```bash
node server.js
```

The development server is expected to run at:

**http://localhost:5500**

Open the frontend using the serving method configured in your project. If Express serves the frontend directory, access the appropriate HTML page through the local server.

---

## 🔄 Procurement Workflow

1. **Registration:** The farmer registers or logs in.
2. **Slot Booking:** The farmer selects an available procurement slot.
3. **Confirmation:** The booking and token details are generated or displayed.
4. **Arrival:** The administrator records the farmer's arrival.
5. **Queue Management:** The farmer's procurement status is updated.
6. **Quality Verification:** Crop quality and moisture information is recorded.
7. **Weighing:** Procurement weight details are entered.
8. **Procurement:** Procurement records are updated.
9. **Payment Tracking:** Payment details and status are recorded.
10. **Record Review:** Farmers and administrators review available procurement information.

The exact workflow depends on the modules implemented in the current version.

---

## 🔐 Security Notes

* Do not commit database files containing real farmer information.
* Keep credentials, API keys, and other secrets out of the repository.
* Use environment variables for sensitive configuration.
* Replace demo credentials with secure authentication before production deployment.
* The prototype should be reviewed for authentication, authorization, validation, and database security before real-world use.

---

## 🔮 Future Enhancements

Potential future improvements include:

* AI-based queue time prediction.
* Intelligent procurement slot allocation.
* Multilingual support for Telugu, Hindi, and English.
* Voice-based assistance for farmers.
* SMS and voice notifications.
* Live procurement center analytics.
* Government payment system integration.
* Real-time vehicle tracking and route optimization.
* Cloud deployment and improved security.

These are proposed enhancements and should not be considered implemented unless they are available in the running application.

---

## 🎯 Project Objective

Our objective is to make agricultural procurement more organized, transparent, and accessible by providing farmers and procurement center administrators with a simple digital platform.

The system establishes a foundation for improving procurement workflows through automation, centralized records, and future intelligent features.

---

## 👨‍💻 Development

**Project:** Smart Farmer Procurement System
**Domain:** Agriculture Technology / Digital Procurement
**Type:** Web Application Prototype
**Development Environment:** Visual Studio Code

---

## 📜 License

This project is developed as an educational and hackathon prototype. A formal open-source license can be added if the project is intended for public reuse.
