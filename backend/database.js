// ============================================
// SMART FARMER PROCUREMENT SYSTEM
// SQLITE DATABASE
// ============================================

const sqlite3 = require("sqlite3").verbose();
const path = require("path");


// ============================================
// DATABASE PATH
// ============================================

const dbPath = path.join(
    __dirname,
    "../database/farmer.db"
);


// ============================================
// CONNECT TO DATABASE
// ============================================

const db = new sqlite3.Database(
    dbPath,
    (err) => {

        if (err) {

            console.error(
                "❌ Database connection failed:",
                err.message
            );

        } else {

            console.log(
                "✅ SQLite database connected"
            );

        }

    }
);


// ============================================
// CREATE TABLES
// ============================================

db.serialize(() => {


    // ========================================
    // FARMERS TABLE
    // ========================================

    db.run(`
        CREATE TABLE IF NOT EXISTS farmers (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            mobile TEXT UNIQUE NOT NULL,

            village TEXT,

            district TEXT,

            state TEXT,

            farmer_id TEXT,

            language TEXT,

            created_at DATETIME
                DEFAULT CURRENT_TIMESTAMP

        )
    `);


    // ========================================
    // BOOKINGS TABLE
    // ========================================

    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            booking_id TEXT UNIQUE NOT NULL,

            farmer_id INTEGER,

            crop TEXT NOT NULL,

            variety TEXT,

            weight REAL,

            quintals REAL,

            centre TEXT,

            date TEXT,

            time TEXT,

            vehicle TEXT,

            vehicle_number TEXT,

            token TEXT,

            status TEXT DEFAULT 'Confirmed',

            created_at DATETIME
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (farmer_id)
                REFERENCES farmers(id)

        )
    `);


    // ========================================
    // QUALITY TABLE
    // ========================================

    db.run(`
        CREATE TABLE IF NOT EXISTS quality (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            booking_id TEXT,

            moisture REAL,

            foreign_matter REAL,

            damaged_grains REAL,

            grade TEXT,

            created_at DATETIME
                DEFAULT CURRENT_TIMESTAMP

        )
    `);


    // ========================================
    // PROCUREMENT TABLE
    // ========================================

    db.run(`
        CREATE TABLE IF NOT EXISTS procurement (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            booking_id TEXT,

            net_weight REAL,

            rate REAL,

            total_amount REAL,

            status TEXT DEFAULT 'Pending',

            created_at DATETIME
                DEFAULT CURRENT_TIMESTAMP

        )
    `);


    // ========================================
    // PAYMENTS TABLE
    // ========================================

    db.run(`
        CREATE TABLE IF NOT EXISTS payments (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            booking_id TEXT,

            amount REAL,

            payment_status TEXT
                DEFAULT 'Processing',

            payment_date TEXT,

            created_at DATETIME
                DEFAULT CURRENT_TIMESTAMP

        )
    `);


    // ========================================
    // NOTIFICATIONS TABLE
    // ========================================

    db.run(`
        CREATE TABLE IF NOT EXISTS notifications (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            farmer_id INTEGER,

            title TEXT,

            message TEXT,

            is_read INTEGER DEFAULT 0,

            created_at DATETIME
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (farmer_id)
                REFERENCES farmers(id)

        )
    `);


    // ========================================
    // ADMINS TABLE
    // ========================================

    db.run(`
        CREATE TABLE IF NOT EXISTS admins (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            username TEXT UNIQUE NOT NULL,

            password TEXT NOT NULL,

            name TEXT NOT NULL,

            centre TEXT,

            created_at DATETIME
                DEFAULT CURRENT_TIMESTAMP

        )
    `);


    // ========================================
    // DEFAULT ADMIN ACCOUNT
    // ========================================

    db.run(`

        INSERT OR IGNORE INTO admins

        (
            id,
            username,
            password,
            name,
            centre
        )

        VALUES

        (
            1,
            'admin',
            'admin123',
            'Procurement Administrator',
            'Main Procurement Centre'
        )

    `);


    // ========================================
    // DATABASE READY
    // ========================================

    console.log(
        "✅ Database tables ready"
    );

});


// ============================================
// EXPORT DATABASE
// ============================================

module.exports = db;