// ============================================
// SMART FARMER PROCUREMENT SYSTEM
// FARMER ROUTES
// ============================================

const express = require("express");

const router = express.Router();

const db = require("../database");


// ============================================
// TEST FARMER ROUTE
// ============================================

router.get("/test", (req, res) => {

    res.json({

        success: true,

        message:
            "Farmer routes are working!"

    });

});


// ============================================
// GET ALL FARMERS
// ============================================

router.get("/", (req, res) => {

    const sql = `

        SELECT *

        FROM farmers

        ORDER BY id DESC

    `;

    db.all(
        sql,
        [],
        (err, rows) => {

            if (err) {

                console.error(
                    "Error getting farmers:",
                    err.message
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Unable to retrieve farmers."

                });

            }

            res.json({

                success: true,

                farmers: rows

            });

        }

    );

});


// ============================================
// REGISTER FARMER
// ============================================

router.post(
    "/register",
    (req, res) => {

        const {

            name,

            mobile,

            village,

            district,

            state,

            farmer_id,

            language

        } = req.body;


        if (!name || !mobile) {

            return res.status(400).json({

                success: false,

                message:
                    "Name and mobile number are required."

            });

        }


        const sql = `

            INSERT INTO farmers

            (

                name,

                mobile,

                village,

                district,

                state,

                farmer_id,

                language

            )

            VALUES (?, ?, ?, ?, ?, ?, ?)

        `;


        db.run(

            sql,

            [

                name,

                mobile,

                village || "",

                district || "",

                state || "",

                farmer_id || "",

                language || "English"

            ],

            function(err) {

                if (err) {

                    console.error(
                        "Registration error:",
                        err.message
                    );


                    if (
                        err.message
                            .toLowerCase()
                            .includes("unique")
                    ) {

                        return res.status(409).json({

                            success: false,

                            message:
                                "This mobile number is already registered."

                        });

                    }


                    return res.status(500).json({

                        success: false,

                        message:
                            "Failed to register farmer."

                    });

                }


                res.status(201).json({

                    success: true,

                    message:
                        "Farmer registered successfully.",

                    farmer: {

                        id:
                            this.lastID,

                        name:
                            name,

                        mobile:
                            mobile,

                        village:
                            village || "",

                        district:
                            district || "",

                        state:
                            state || "",

                        farmer_id:
                            farmer_id || "",

                        language:
                            language || "English"

                    }

                });

            }

        );

    }

);


// ============================================
// FARMER LOGIN
// ============================================

router.post(
    "/login",
    (req, res) => {

        const {

            mobile,

            farmer_id

        } = req.body;


        if (!mobile || !farmer_id) {

            return res.status(400).json({

                success: false,

                message:
                    "Mobile number and Farmer ID are required."

            });

        }


        const sql = `

            SELECT *

            FROM farmers

            WHERE mobile = ?

            AND farmer_id = ?

        `;


        db.get(

            sql,

            [
                mobile,
                farmer_id
            ],

            (err, farmer) => {

                if (err) {

                    console.error(
                        "Login error:",
                        err.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Unable to process login."

                    });

                }


                if (!farmer) {

                    return res.status(401).json({

                        success: false,

                        message:
                            "Invalid mobile number or Farmer ID."

                    });

                }


                console.log(
                    `✅ Farmer logged in: ${farmer.name}`
                );


                res.json({

                    success: true,

                    message:
                        "Login successful.",

                    farmer:
                        farmer

                });

            }

        );

    }

);


// ============================================
// GET LATEST BOOKING
// ============================================

router.get(
    "/:id/booking",
    (req, res) => {

        const farmerId =
            req.params.id;


        const sql = `

            SELECT *

            FROM bookings

            WHERE farmer_id = ?

            ORDER BY id DESC

            LIMIT 1

        `;


        db.get(

            sql,

            [farmerId],

            (err, booking) => {

                if (err) {

                    console.error(
                        "Booking error:",
                        err.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Unable to retrieve booking."

                    });

                }


                if (!booking) {

                    return res.json({

                        success: false,

                        booking: null,

                        message:
                            "No booking found."

                    });

                }


                res.json({

                    success: true,

                    booking:
                        booking

                });

            }

        );

    }

);


// ============================================
// GET FARMER NOTIFICATIONS
// ============================================

router.get(
    "/:id/notifications",
    (req, res) => {

        const farmerId =
            req.params.id;


        const sql = `

            SELECT *

            FROM notifications

            WHERE farmer_id = ?

            ORDER BY id DESC

            LIMIT 20

        `;


        db.all(

            sql,

            [farmerId],

            (err, notifications) => {

                if (err) {

                    console.error(
                        "Notification error:",
                        err.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Unable to retrieve notifications."

                    });

                }


                res.json({

                    success: true,

                    notifications:
                        notifications

                });

            }

        );

    }

);


// ============================================
// MARK NOTIFICATIONS AS READ
// ============================================

router.put(
    "/:id/notifications/read",
    (req, res) => {

        const farmerId =
            req.params.id;


        const sql = `

            UPDATE notifications

            SET is_read = 1

            WHERE farmer_id = ?

        `;


        db.run(

            sql,

            [farmerId],

            function(err) {

                if (err) {

                    console.error(
                        "Notification read error:",
                        err.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Unable to update notifications."

                    });

                }


                res.json({

                    success: true,

                    message:
                        "Notifications marked as read."

                });

            }

        );

    }

);


// ============================================
// GET FARMER PAYMENT HISTORY
// ============================================

router.get(
    "/:id/payments",
    (req, res) => {

        const farmerId =
            req.params.id;


        const sql = `

            SELECT

                p.*,

                b.crop,

                b.variety,

                b.quintals

            FROM payments p

            LEFT JOIN bookings b

                ON p.booking_id =
                   b.booking_id

            WHERE b.farmer_id = ?

            ORDER BY p.id DESC

        `;


        db.all(

            sql,

            [farmerId],

            (err, payments) => {

                if (err) {

                    console.error(
                        "Payment history error:",
                        err.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Unable to retrieve payment history."

                    });

                }


                res.json({

                    success: true,

                    payments:
                        payments

                });

            }

        );

    }

);


// ============================================
// GET FARMER PROCUREMENT HISTORY
// ============================================

router.get(
    "/:id/procurement",
    (req, res) => {

        const farmerId =
            req.params.id;


        const sql = `

            SELECT

                p.*,

                b.crop,

                b.variety,

                b.quintals,

                b.date,

                b.time

            FROM procurement p

            LEFT JOIN bookings b

                ON p.booking_id =
                   b.booking_id

            WHERE b.farmer_id = ?

            ORDER BY p.id DESC

        `;


        db.all(

            sql,

            [farmerId],

            (err, records) => {

                if (err) {

                    console.error(
                        "Procurement history error:",
                        err.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Unable to retrieve procurement history."

                    });

                }


                res.json({

                    success: true,

                    procurement:
                        records

                });

            }

        );

    }

);


// ============================================
// GET FARMER PROFILE
// ============================================

router.get(
    "/:id",
    (req, res) => {

        const farmerId =
            req.params.id;


        const sql = `

            SELECT *

            FROM farmers

            WHERE id = ?

        `;


        db.get(

            sql,

            [farmerId],

            (err, farmer) => {

                if (err) {

                    console.error(
                        "Error getting farmer:",
                        err.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Unable to retrieve farmer."

                    });

                }


                if (!farmer) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Farmer not found."

                    });

                }


                res.json({

                    success: true,

                    farmer:
                        farmer

                });

            }

        );

    }

);


// ============================================
// EXPORT
// ============================================

module.exports = router;