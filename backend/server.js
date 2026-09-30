// ============================================
// SMART FARMER PROCUREMENT SYSTEM
// BACKEND SERVER
// ============================================

const express = require("express");
const cors = require("cors");
const path = require("path");

// ============================================
// DATABASE
// ============================================

const db = require("./database");

// ============================================
// ROUTES
// ============================================

const farmerRoutes = require("./routes/farmerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const queueRoutes = require("./routes/queueRoutes");
const adminRoutes = require("./routes/adminRoutes");


// ============================================
// ROUTE LOADING CONFIRMATION
// ============================================

console.log("==========================================");
console.log("🌾 SMART FARMER PROCUREMENT SYSTEM");
console.log("==========================================");

console.log("✅ farmerRoutes.js HAS BEEN LOADED");
console.log("✅ bookingRoutes.js HAS BEEN LOADED");
console.log("✅ queueRoutes.js HAS BEEN LOADED");
console.log("✅ adminRoutes.js HAS BEEN LOADED");


// ============================================
// EXPRESS APP
// ============================================

const app = express();

const PORT = 5500;


// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ============================================
// API ROUTES
// ============================================

// Farmer APIs
app.use(
    "/api/farmers",
    farmerRoutes
);

// Booking APIs
app.use(
    "/api/bookings",
    bookingRoutes
);

// Queue APIs
app.use(
    "/api/queue",
    queueRoutes
);

// Admin APIs
app.use(
    "/api/admin",
    adminRoutes
);


// ============================================
// GENERAL API TEST
// ============================================

app.get(
    "/api/test",
    (req, res) => {

        res.json({

            success: true,

            message:
                "Smart Farmer backend is working!"

        });

    }
);


// ============================================
// SERVE FRONTEND
// ============================================

app.use(
    express.static(
        path.join(
            __dirname,
            "../frontend"
        )
    )
);


// ============================================
// HOME PAGE
// ============================================

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "../frontend/index.html"
            )
        );

    }
);


// ============================================
// API 404 HANDLER
// ============================================

app.use(
    (req, res, next) => {

        if (
            req.originalUrl.startsWith("/api/")
        ) {

            return res.status(404).json({

                success: false,

                message:
                    `API endpoint not found: ${req.method} ${req.originalUrl}`

            });

        }

        next();

    }
);


// ============================================
// PAGE 404 HANDLER
// ============================================

app.use(
    (req, res) => {

        res.status(404).send(
            "Page not found."
        );

    }
);


// ============================================
// ERROR HANDLER
// ============================================

app.use(
    (err, req, res, next) => {

        console.error(
            "❌ SERVER ERROR:",
            err.message
        );

        res.status(500).json({

            success: false,

            message:
                "Something went wrong on the server."

        });

    }
);


// ============================================
// START SERVER
// ============================================

app.listen(
    PORT,
    () => {

        console.log("");

        console.log(
            "=========================================="
        );

        console.log(
            "🚀 SERVER STARTED SUCCESSFULLY"
        );

        console.log(
            "=========================================="
        );

        console.log(
            `🌐 Website: http://localhost:${PORT}`
        );

        console.log(
            `👨‍🌾 Farmer API: http://localhost:${PORT}/api/farmers`
        );

        console.log(
            `📅 Booking API: http://localhost:${PORT}/api/bookings`
        );

        console.log(
            `🚜 Queue API: http://localhost:${PORT}/api/queue`
        );

        console.log(
            `👨‍💼 Admin API: http://localhost:${PORT}/api/admin`
        );

        console.log(
            "=========================================="
        );

        console.log("");

    }
);