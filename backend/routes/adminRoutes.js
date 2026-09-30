// ============================================
// SMART FARMER PROCUREMENT SYSTEM
// ADMIN ROUTES
// ============================================

const express = require("express");

const router = express.Router();

const db = require("../database");


// ============================================
// TEST ADMIN ROUTE
// ============================================

router.get("/test", (req, res) => {

    res.json({
        success: true,
        message: "Admin routes are working!"
    });

});


// ============================================
// ADMIN LOGIN
// ============================================

router.post("/login", (req, res) => {

    const {
        username,
        password
    } = req.body;

    if (!username || !password) {

        return res.status(400).json({
            success: false,
            message:
                "Username and password are required."
        });

    }

    const sql = `
        SELECT
            id,
            username,
            name,
            centre
        FROM admins
        WHERE username = ?
        AND password = ?
    `;

    db.get(
        sql,
        [username, password],
        (err, admin) => {

            if (err) {

                console.error(
                    "❌ Admin login error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Unable to process admin login."
                });

            }

            if (!admin) {

                return res.status(401).json({
                    success: false,
                    message:
                        "Invalid username or password."
                });

            }

            console.log(
                `✅ Admin logged in: ${admin.username}`
            );

            res.json({
                success: true,
                message:
                    "Admin login successful.",
                admin: admin
            });

        }
    );

});


// ============================================
// GET ALL FARMERS
// ============================================

router.get("/farmers", (req, res) => {

    const sql = `
        SELECT *
        FROM farmers
        ORDER BY id DESC
    `;

    db.all(
        sql,
        [],
        (err, farmers) => {

            if (err) {

                console.error(
                    "❌ Farmers error:",
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
                farmers: farmers
            });

        }
    );

});


// ============================================
// GET ALL BOOKINGS
// ============================================

router.get("/bookings", (req, res) => {

    const sql = `
        SELECT
            b.*,
            f.name AS farmer_name,
            f.mobile AS farmer_mobile,
            f.farmer_id AS farmer_code,
            f.village AS farmer_village,
            f.district AS farmer_district
        FROM bookings b
        LEFT JOIN farmers f
            ON b.farmer_id = f.id
        ORDER BY b.id DESC
    `;

    db.all(
        sql,
        [],
        (err, bookings) => {

            if (err) {

                console.error(
                    "❌ Bookings error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Unable to retrieve bookings."
                });

            }

            res.json({
                success: true,
                bookings: bookings
            });

        }
    );

});


// ============================================
// GET SINGLE BOOKING
// ============================================

router.get(
    "/booking/:bookingId",
    (req, res) => {

        const bookingId =
            req.params.bookingId;

        const sql = `
            SELECT
                b.*,
                f.name AS farmer_name,
                f.mobile AS farmer_mobile,
                f.farmer_id AS farmer_code,
                f.village AS farmer_village,
                f.district AS farmer_district,
                f.state AS farmer_state
            FROM bookings b
            LEFT JOIN farmers f
                ON b.farmer_id = f.id
            WHERE b.booking_id = ?
        `;

        db.get(
            sql,
            [bookingId],
            (err, booking) => {

                if (err) {

                    console.error(
                        "❌ Booking error:",
                        err.message
                    );

                    return res.status(500).json({
                        success: false,
                        message:
                            "Unable to retrieve booking."
                    });

                }

                if (!booking) {

                    return res.status(404).json({
                        success: false,
                        message:
                            "Booking not found."
                    });

                }

                res.json({
                    success: true,
                    booking: booking
                });

            }
        );

    }

);


// ============================================
// UPDATE BOOKING STATUS
// ============================================

router.put(
    "/booking/:bookingId/status",
    (req, res) => {

        const bookingId =
            req.params.bookingId;

        const {
            status
        } = req.body;

        if (!status) {

            return res.status(400).json({
                success: false,
                message:
                    "Status is required."
            });

        }

        updateBookingStatus(
            bookingId,
            status,
            res
        );

    }

);


// ============================================
// MARK FARMER ARRIVED
// ============================================

router.put(
    "/booking/:bookingId/arrived",
    (req, res) => {

        updateBookingStatus(
            req.params.bookingId,
            "Arrived",
            res
        );

    }

);


// ============================================
// START QUALITY CHECK
// ============================================

router.put(
    "/booking/:bookingId/quality",
    (req, res) => {

        updateBookingStatus(
            req.params.bookingId,
            "Quality Check",
            res
        );

    }

);


// ============================================
// START WEIGHING
// ============================================

router.put(
    "/booking/:bookingId/weighing",
    (req, res) => {

        updateBookingStatus(
            req.params.bookingId,
            "Weighing",
            res
        );

    }

);


// ============================================
// START PROCUREMENT
// ============================================

router.put(
    "/booking/:bookingId/procurement",
    (req, res) => {

        updateBookingStatus(
            req.params.bookingId,
            "Procurement Processing",
            res
        );

    }

);


// ============================================
// COMPLETE PROCUREMENT
// ============================================

router.put(
    "/booking/:bookingId/complete",
    (req, res) => {

        updateBookingStatus(
            req.params.bookingId,
            "Procurement Completed",
            res
        );

    }

);


// ============================================
// QUALITY - GET ALL
// ============================================

router.get("/quality", (req, res) => {

    const sql = `
        SELECT *
        FROM quality
        ORDER BY id DESC
    `;

    db.all(
        sql,
        [],
        (err, quality) => {

            if (err) {

                console.error(
                    "❌ Quality error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Unable to retrieve quality records."
                });

            }

            res.json({
                success: true,
                quality: quality
            });

        }
    );

});


// ============================================
// QUALITY - GET BY BOOKING
// ============================================

router.get(
    "/quality/:bookingId",
    (req, res) => {

        const bookingId =
            req.params.bookingId;

        const sql = `
            SELECT *
            FROM quality
            WHERE booking_id = ?
            ORDER BY id DESC
            LIMIT 1
        `;

        db.get(
            sql,
            [bookingId],
            (err, quality) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message:
                            "Unable to retrieve quality result."
                    });

                }

                res.json({
                    success: true,
                    quality:
                        quality || null
                });

            }
        );

    }

);


// ============================================
// SAVE QUALITY RESULT
// ============================================

router.post(
    "/quality",
    (req, res) => {

        const {
            booking_id,
            moisture,
            foreign_matter,
            damaged_grains,
            grade
        } = req.body;

        if (!booking_id) {

            return res.status(400).json({
                success: false,
                message:
                    "Booking ID is required."
            });

        }

        if (
            moisture === undefined ||
            foreign_matter === undefined ||
            damaged_grains === undefined ||
            !grade
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Moisture, foreign matter, damaged grains and grade are required."
            });

        }

        const moistureValue =
            Number(moisture);

        const foreignMatterValue =
            Number(foreign_matter);

        const damagedGrainsValue =
            Number(damaged_grains);

        if (
            moistureValue < 0 ||
            foreignMatterValue < 0 ||
            damagedGrainsValue < 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Quality values cannot be negative."
            });

        }

        const sql = `
            INSERT INTO quality
            (
                booking_id,
                moisture,
                foreign_matter,
                damaged_grains,
                grade
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        db.run(
            sql,
            [
                booking_id,
                moistureValue,
                foreignMatterValue,
                damagedGrainsValue,
                grade
            ],
            function(err) {

                if (err) {

                    console.error(
                        "❌ Quality save error:",
                        err.message
                    );

                    return res.status(500).json({
                        success: false,
                        message:
                            "Failed to save quality result."
                    });

                }

                // -------------------------------
                // UPDATE BOOKING
                // -------------------------------

                db.run(
                    `
                    UPDATE bookings
                    SET status = ?
                    WHERE booking_id = ?
                    `,
                    [
                        "Quality Checked",
                        booking_id
                    ]
                );


                // -------------------------------
                // NOTIFY FARMER
                // -------------------------------

                getFarmerIdByBooking(
                    booking_id,
                    (farmerId) => {

                        if (farmerId) {

                            createNotification(
                                farmerId,
                                "Quality Check Completed",
                                `Quality inspection completed for ${booking_id}. Grade ${grade}, moisture ${moistureValue.toFixed(2)}%.`
                            );

                        }

                    }
                );


                console.log(
                    `✅ Quality saved for ${booking_id}`
                );


                res.status(201).json({

                    success: true,

                    message:
                        "Quality result saved successfully.",

                    quality: {

                        id:
                            this.lastID,

                        booking_id:
                            booking_id,

                        moisture:
                            moistureValue,

                        foreign_matter:
                            foreignMatterValue,

                        damaged_grains:
                            damagedGrainsValue,

                        grade:
                            grade

                    }

                });

            }
        );

    }

);


// ============================================
// PROCUREMENT - GET ALL
// ============================================

router.get(
    "/procurement",
    (req, res) => {

        const sql = `
            SELECT
                p.*,
                b.crop,
                b.variety,
                b.farmer_id,
                b.centre,
                f.name AS farmer_name,
                f.mobile AS farmer_mobile
            FROM procurement p
            LEFT JOIN bookings b
                ON p.booking_id = b.booking_id
            LEFT JOIN farmers f
                ON b.farmer_id = f.id
            ORDER BY p.id DESC
        `;

        db.all(
            sql,
            [],
            (err, records) => {

                if (err) {

                    console.error(
                        "❌ Procurement error:",
                        err.message
                    );

                    return res.status(500).json({
                        success: false,
                        message:
                            "Unable to retrieve procurement records."
                    });

                }

                res.json({
                    success: true,
                    procurement: records
                });

            }
        );

    }

);


// ============================================
// PROCUREMENT - GET BY BOOKING
// ============================================

router.get(
    "/procurement/:bookingId",
    (req, res) => {

        const bookingId =
            req.params.bookingId;

        const sql = `
            SELECT *
            FROM procurement
            WHERE booking_id = ?
            ORDER BY id DESC
            LIMIT 1
        `;

        db.get(
            sql,
            [bookingId],
            (err, record) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message:
                            "Unable to retrieve procurement record."
                    });

                }

                res.json({
                    success: true,
                    procurement:
                        record || null
                });

            }
        );

    }

);


// ============================================
// SAVE WEIGHT + PROCUREMENT
// ============================================

router.post(
    "/procurement",
    (req, res) => {

        const {
            booking_id,
            net_weight,
            rate
        } = req.body;


        if (!booking_id) {

            return res.status(400).json({
                success: false,
                message:
                    "Booking ID is required."
            });

        }


        const finalWeight =
            Number(net_weight);

        const finalRate =
            Number(rate);


        if (
            !Number.isFinite(finalWeight) ||
            finalWeight <= 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Please provide a valid net weight."
            });

        }


        if (
            !Number.isFinite(finalRate) ||
            finalRate <= 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Please provide a valid procurement rate."
            });

        }


        const totalAmount =
            finalWeight *
            finalRate;


        // ========================================
        // CHECK EXISTING PROCUREMENT
        // ========================================

        db.get(
            `
            SELECT *
            FROM procurement
            WHERE booking_id = ?
            ORDER BY id DESC
            LIMIT 1
            `,
            [booking_id],
            (checkErr, existing) => {

                if (checkErr) {

                    console.error(
                        "❌ Procurement check error:",
                        checkErr.message
                    );

                    return res.status(500).json({
                        success: false,
                        message:
                            "Unable to check procurement record."
                    });

                }


                // ==================================
                // UPDATE EXISTING
                // ==================================

                if (existing) {

                    const updateSql = `
                        UPDATE procurement
                        SET
                            net_weight = ?,
                            rate = ?,
                            total_amount = ?,
                            status = ?
                        WHERE id = ?
                    `;


                    db.run(
                        updateSql,
                        [
                            finalWeight,
                            finalRate,
                            totalAmount,
                            "Completed",
                            existing.id
                        ],
                        function(err) {

                            if (err) {

                                console.error(
                                    "❌ Procurement update error:",
                                    err.message
                                );

                                return res.status(500).json({
                                    success: false,
                                    message:
                                        "Failed to update procurement."
                                });

                            }


                            finishProcurementSave(
                                booking_id,
                                finalWeight,
                                finalRate,
                                totalAmount,
                                res
                            );

                        }
                    );


                    return;

                }


                // ==================================
                // CREATE NEW PROCUREMENT
                // ==================================

                const insertSql = `
                    INSERT INTO procurement
                    (
                        booking_id,
                        net_weight,
                        rate,
                        total_amount,
                        status
                    )
                    VALUES (?, ?, ?, ?, ?)
                `;


                db.run(
                    insertSql,
                    [
                        booking_id,
                        finalWeight,
                        finalRate,
                        totalAmount,
                        "Completed"
                    ],
                    function(err) {

                        if (err) {

                            console.error(
                                "❌ Procurement save error:",
                                err.message
                            );

                            return res.status(500).json({
                                success: false,
                                message:
                                    "Failed to save procurement."
                            });

                        }


                        finishProcurementSave(
                            booking_id,
                            finalWeight,
                            finalRate,
                            totalAmount,
                            res
                        );

                    }
                );

            }
        );

    }

);


// ============================================
// COMPLETE PROCUREMENT
// ============================================

function finishProcurementSave(
    bookingId,
    weight,
    rate,
    totalAmount,
    res
) {

    // ========================================
    // UPDATE BOOKING
    // ========================================

    db.run(
        `
        UPDATE bookings
        SET status = ?
        WHERE booking_id = ?
        `,
        [
            "Procurement Completed",
            bookingId
        ],
        (bookingError) => {

            if (bookingError) {

                console.error(
                    "❌ Booking update error:",
                    bookingError.message
                );

            }

        }
    );


    // ========================================
    // CREATE PAYMENT AS PROCESSING
    // ========================================

    db.get(
        `
        SELECT id
        FROM payments
        WHERE booking_id = ?
        LIMIT 1
        `,
        [bookingId],
        (checkError, existingPayment) => {

            if (checkError) {

                console.error(
                    "❌ Payment check error:",
                    checkError.message
                );

            }


            if (!existingPayment) {

                db.run(
                    `
                    INSERT INTO payments
                    (
                        booking_id,
                        amount,
                        payment_status,
                        payment_date
                    )
                    VALUES (?, ?, ?, ?)
                    `,
                    [
                        bookingId,
                        totalAmount,
                        "Processing",
                        null
                    ],
                    (paymentError) => {

                        if (paymentError) {

                            console.error(
                                "❌ Payment creation error:",
                                paymentError.message
                            );

                        } else {

                            console.log(
                                `💰 Payment created as Processing for ${bookingId}`
                            );

                        }

                    }
                );

            } else {

                // --------------------------------
                // UPDATE EXISTING PAYMENT AMOUNT
                // --------------------------------

                db.run(
                    `
                    UPDATE payments
                    SET amount = ?
                    WHERE id = ?
                    AND payment_status != 'Completed'
                    `,
                    [
                        totalAmount,
                        existingPayment.id
                    ],
                    (updatePaymentError) => {

                        if (updatePaymentError) {

                            console.error(
                                "❌ Payment update error:",
                                updatePaymentError.message
                            );

                        }

                    }
                );

            }

        }
    );


    // ========================================
    // NOTIFY FARMER
    // ========================================

    getFarmerIdByBooking(
        bookingId,
        (farmerId) => {

            if (farmerId) {

                createNotification(
                    farmerId,
                    "Procurement Completed",
                    `Your produce has been weighed and procurement is completed. Net weight: ${weight.toFixed(2)} Q. Total value: ₹${totalAmount.toFixed(2)}.`
                );

            }

        }
    );


    console.log(
        `✅ Procurement completed for ${bookingId}`
    );


    // ========================================
    // RESPONSE
    // ========================================

    res.status(201).json({

        success: true,

        message:
            "Weight and procurement saved successfully.",

        procurement: {

            booking_id:
                bookingId,

            net_weight:
                weight,

            rate:
                rate,

            total_amount:
                totalAmount,

            status:
                "Completed"

        }

    });

}


// ============================================
// PAYMENTS - GET ALL
// ============================================

router.get(
    "/payments",
    (req, res) => {

        const sql = `
            SELECT
                p.*,
                b.crop,
                b.variety,
                b.farmer_id,
                b.centre,
                f.name AS farmer_name,
                f.mobile AS farmer_mobile
            FROM payments p
            LEFT JOIN bookings b
                ON p.booking_id = b.booking_id
            LEFT JOIN farmers f
                ON b.farmer_id = f.id
            ORDER BY p.id DESC
        `;


        db.all(
            sql,
            [],
            (err, payments) => {

                if (err) {

                    console.error(
                        "❌ Payments error:",
                        err.message
                    );

                    return res.status(500).json({
                        success: false,
                        message:
                            "Unable to retrieve payments."
                    });

                }


                res.json({
                    success: true,
                    payments: payments
                });

            }
        );

    }

);


// ============================================
// PAYMENT - GET BY BOOKING
// ============================================

router.get(
    "/payments/:bookingId",
    (req, res) => {

        const bookingId =
            req.params.bookingId;


        const sql = `
            SELECT *
            FROM payments
            WHERE booking_id = ?
            ORDER BY id DESC
            LIMIT 1
        `;


        db.get(
            sql,
            [bookingId],
            (err, payment) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message:
                            "Unable to retrieve payment."
                    });

                }


                res.json({
                    success: true,
                    payment:
                        payment || null
                });

            }
        );

    }

);


// ============================================
// PROCESS PAYMENT
// ============================================

router.post(
    "/payments",
    (req, res) => {

        const {
            booking_id,
            amount
        } = req.body;


        if (!booking_id) {

            return res.status(400).json({
                success: false,
                message:
                    "Booking ID is required."
            });

        }


        const paymentAmount =
            Number(amount);


        if (
            !Number.isFinite(paymentAmount) ||
            paymentAmount <= 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Please provide a valid payment amount."
            });

        }


        const paymentDate =
            new Date().toISOString();


        // ========================================
        // CHECK EXISTING PAYMENT
        // ========================================

        db.get(
            `
            SELECT *
            FROM payments
            WHERE booking_id = ?
            ORDER BY id DESC
            LIMIT 1
            `,
            [booking_id],
            (checkErr, existing) => {

                if (checkErr) {

                    return res.status(500).json({
                        success: false,
                        message:
                            "Unable to check payment."
                    });

                }


                // ==================================
                // UPDATE EXISTING PAYMENT
                // ==================================

                if (existing) {

                    const updateSql = `
                        UPDATE payments
                        SET
                            amount = ?,
                            payment_status = ?,
                            payment_date = ?
                        WHERE id = ?
                    `;


                    db.run(
                        updateSql,
                        [
                            paymentAmount,
                            "Completed",
                            paymentDate,
                            existing.id
                        ],
                        function(err) {

                            if (err) {

                                console.error(
                                    "❌ Payment update error:",
                                    err.message
                                );

                                return res.status(500).json({
                                    success: false,
                                    message:
                                        "Failed to update payment."
                                });

                            }


                            finishPayment(
                                booking_id,
                                paymentAmount,
                                res
                            );

                        }
                    );


                    return;

                }


                // ==================================
                // CREATE NEW PAYMENT
                // ==================================

                const insertSql = `
                    INSERT INTO payments
                    (
                        booking_id,
                        amount,
                        payment_status,
                        payment_date
                    )
                    VALUES (?, ?, ?, ?)
                `;


                db.run(
                    insertSql,
                    [
                        booking_id,
                        paymentAmount,
                        "Completed",
                        paymentDate
                    ],
                    function(err) {

                        if (err) {

                            console.error(
                                "❌ Payment creation error:",
                                err.message
                            );

                            return res.status(500).json({
                                success: false,
                                message:
                                    "Failed to process payment."
                            });

                        }


                        finishPayment(
                            booking_id,
                            paymentAmount,
                            res
                        );

                    }
                );

            }
        );

    }

);


// ============================================
// COMPLETE PAYMENT
// ============================================

function finishPayment(
    bookingId,
    amount,
    res
) {

    // ========================================
    // UPDATE BOOKING
    // ========================================

    db.run(
        `
        UPDATE bookings
        SET status = ?
        WHERE booking_id = ?
        `,
        [
            "Payment Completed",
            bookingId
        ],
        (bookingError) => {

            if (bookingError) {

                console.error(
                    "❌ Payment booking update error:",
                    bookingError.message
                );

            }

        }
    );


    // ========================================
    // NOTIFY FARMER
    // ========================================

    getFarmerIdByBooking(
        bookingId,
        (farmerId) => {

            if (farmerId) {

                createNotification(
                    farmerId,
                    "Payment Completed",
                    `Payment of ₹${amount.toFixed(2)} has been completed for booking ${bookingId}.`
                );

            }

        }
    );


    console.log(
        `💰 Payment completed for ${bookingId}: ₹${amount}`
    );


    res.status(201).json({

        success: true,

        message:
            "Payment completed successfully.",

        payment: {

            booking_id:
                bookingId,

            amount:
                amount,

            payment_status:
                "Completed",

            payment_date:
                new Date().toISOString()

        }

    });

}


// ============================================
// GET ALL NOTIFICATIONS
// ============================================

router.get(
    "/notifications",
    (req, res) => {

        const sql = `
            SELECT
                n.*,
                f.name AS farmer_name,
                f.mobile AS farmer_mobile
            FROM notifications n
            LEFT JOIN farmers f
                ON n.farmer_id = f.id
            ORDER BY n.id DESC
        `;


        db.all(
            sql,
            [],
            (err, notifications) => {

                if (err) {

                    console.error(
                        "❌ Notifications error:",
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
// SEND NOTIFICATION TO FARMER
// ============================================

router.post(
    "/notifications",
    (req, res) => {

        const {
            farmer_id,
            title,
            message
        } = req.body;


        if (
            !farmer_id ||
            !title ||
            !message
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Farmer ID, title and message are required."
            });

        }


        const sql = `
            INSERT INTO notifications
            (
                farmer_id,
                title,
                message
            )
            VALUES (?, ?, ?)
        `;


        db.run(
            sql,
            [
                farmer_id,
                title,
                message
            ],
            function(err) {

                if (err) {

                    console.error(
                        "❌ Notification error:",
                        err.message
                    );

                    return res.status(500).json({
                        success: false,
                        message:
                            "Failed to send notification."
                    });

                }


                console.log(
                    `🔔 Notification sent to farmer ${farmer_id}`
                );


                res.status(201).json({

                    success: true,

                    message:
                        "Notification sent successfully.",

                    notification: {

                        id:
                            this.lastID,

                        farmer_id:
                            farmer_id,

                        title:
                            title,

                        message:
                            message

                    }

                });

            }
        );

    }

);


// ============================================
// DASHBOARD STATISTICS
// ============================================

router.get(
    "/stats",
    (req, res) => {

        const queries = {

            farmers: `
                SELECT COUNT(*) AS count
                FROM farmers
            `,

            bookings: `
                SELECT COUNT(*) AS count
                FROM bookings
                WHERE date =
                    date('now','localtime')
            `,

            completed: `
                SELECT COUNT(*) AS count
                FROM procurement
                WHERE status = 'Completed'
            `,

            payments: `
                SELECT
                    COALESCE(
                        SUM(total_amount),
                        0
                    ) AS amount
                FROM procurement
                WHERE status = 'Completed'
            `

        };


        db.get(
            queries.farmers,
            [],
            (err, farmerResult) => {

                if (err) {
                    return statsError(res);
                }


                db.get(
                    queries.bookings,
                    [],
                    (err, bookingResult) => {

                        if (err) {
                            return statsError(res);
                        }


                        db.get(
                            queries.completed,
                            [],
                            (err, completedResult) => {

                                if (err) {
                                    return statsError(res);
                                }


                                db.get(
                                    queries.payments,
                                    [],
                                    (err, paymentResult) => {

                                        if (err) {
                                            return statsError(res);
                                        }


                                        res.json({

                                            success: true,

                                            stats: {

                                                total_farmers:
                                                    farmerResult.count,

                                                today_bookings:
                                                    bookingResult.count,

                                                completed_procurement:
                                                    completedResult.count,

                                                total_amount:
                                                    paymentResult.amount

                                            }

                                        });

                                    }
                                );

                            }
                        );

                    }
                );

            }
        );

    }

);


// ============================================
// HELPER
// UPDATE BOOKING STATUS
// ============================================

function updateBookingStatus(
    bookingId,
    status,
    res
) {

    const sql = `
        UPDATE bookings
        SET status = ?
        WHERE booking_id = ?
    `;


    db.run(
        sql,
        [
            status,
            bookingId
        ],
        function(err) {

            if (err) {

                console.error(
                    "❌ Status update error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Unable to update booking status."
                });

            }


            if (this.changes === 0) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Booking not found."
                });

            }


            // --------------------------------
            // NOTIFY FARMER
            // --------------------------------

            getFarmerIdByBooking(
                bookingId,
                (farmerId) => {

                    if (farmerId) {

                        createNotification(
                            farmerId,
                            "Procurement Update",
                            `Your booking ${bookingId} is now "${status}".`
                        );

                    }

                }
            );


            console.log(
                `✅ ${bookingId} → ${status}`
            );


            res.json({

                success: true,

                message:
                    `Booking status changed to ${status}.`,

                status:
                    status

            });

        }
    );

}


// ============================================
// HELPER
// GET FARMER ID BY BOOKING
// ============================================

function getFarmerIdByBooking(
    bookingId,
    callback
) {

    const sql = `
        SELECT farmer_id
        FROM bookings
        WHERE booking_id = ?
    `;


    db.get(
        sql,
        [bookingId],
        (err, row) => {

            if (err || !row) {

                callback(null);

                return;

            }


            callback(
                row.farmer_id
            );

        }
    );

}


// ============================================
// HELPER
// CREATE NOTIFICATION
// ============================================

function createNotification(
    farmerId,
    title,
    message
) {

    if (!farmerId) {
        return;
    }


    const sql = `
        INSERT INTO notifications
        (
            farmer_id,
            title,
            message
        )
        VALUES (?, ?, ?)
    `;


    db.run(
        sql,
        [
            farmerId,
            title,
            message
        ],
        (err) => {

            if (err) {

                console.error(
                    "❌ Notification creation error:",
                    err.message
                );

            } else {

                console.log(
                    `🔔 Notification created for farmer ${farmerId}`
                );

            }

        }
    );

}


// ============================================
// HELPER
// STATISTICS ERROR
// ============================================

function statsError(res) {

    return res.status(500).json({

        success: false,

        message:
            "Unable to load dashboard statistics."

    });

}


// ============================================
// EXPORT ROUTER
// ============================================

module.exports = router;