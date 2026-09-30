// ============================================
// SMART FARMER PROCUREMENT SYSTEM
// LIVE QUEUE ROUTES
// ============================================

const express = require("express");

const router = express.Router();

const db = require("../database");


// ============================================
// GET QUEUE INFORMATION FOR A BOOKING
// ============================================
//
// Example:
// GET /api/queue/booking/SF-123456
//
// ============================================

router.get(
    "/booking/:bookingId",
    (req, res) => {

        const bookingId =
            req.params.bookingId;


        // =====================================
        // FIND THE BOOKING
        // =====================================

        const bookingSql = `
            SELECT *
            FROM bookings
            WHERE booking_id = ?
        `;


        db.get(
            bookingSql,
            [bookingId],
            (err, booking) => {

                if (err) {

                    console.error(
                        "Queue booking error:",
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


                // =================================
                // FIND ALL ACTIVE BOOKINGS
                // AT SAME CENTRE AND DATE
                // =================================

                const queueSql = `

                    SELECT
                        id,
                        booking_id,
                        token,
                        farmer_id,
                        status

                    FROM bookings

                    WHERE centre = ?
                    AND date = ?

                    AND status IN (
                        'Confirmed',
                        'Arrived',
                        'Processing'
                    )

                    ORDER BY id ASC

                `;


                db.all(

                    queueSql,

                    [
                        booking.centre,
                        booking.date
                    ],

                    (queueError, queue) => {

                        if (queueError) {

                            console.error(
                                "Queue error:",
                                queueError.message
                            );

                            return res.status(500).json({

                                success: false,

                                message:
                                    "Unable to calculate queue."

                            });

                        }


                        // =================================
                        // FIND FARMER'S POSITION
                        // =================================

                        const position =
                            queue.findIndex(
                                item =>
                                    item.booking_id ===
                                    booking.booking_id
                            );


                        if (position === -1) {

                            return res.json({

                                success: true,

                                queue: {

                                    booking_id:
                                        booking.booking_id,

                                    token:
                                        booking.token,

                                    position:
                                        0,

                                    farmers_ahead:
                                        0,

                                    estimated_wait:
                                        0,

                                    current_serving:
                                        "—",

                                    status:
                                        booking.status

                                }

                            });

                        }


                        const queuePosition =
                            position + 1;


                        const farmersAhead =
                            position;


                        // =================================
                        // ESTIMATED WAIT
                        // 5 MINUTES PER FARMER
                        // =================================

                        const estimatedWait =
                            farmersAhead * 5;


                        // =================================
                        // CURRENTLY SERVING TOKEN
                        // =================================

                        const currentServing =
                            queue.length > 0
                                ? queue[0].token
                                : "—";


                        // =================================
                        // RESPONSE
                        // =================================

                        res.json({

                            success: true,

                            queue: {

                                booking_id:
                                    booking.booking_id,

                                token:
                                    booking.token,

                                position:
                                    queuePosition,

                                farmers_ahead:
                                    farmersAhead,

                                estimated_wait:
                                    estimatedWait,

                                current_serving:
                                    currentServing,

                                centre:
                                    booking.centre,

                                date:
                                    booking.date,

                                status:
                                    booking.status,

                                total_farmers:
                                    queue.length

                            }

                        });

                    }

                );

            }

        );

    }

);


// ============================================
// GET COMPLETE QUEUE FOR CENTRE + DATE
// ============================================
//
// Example:
// /api/queue?centre=Main%20Procurement%20Centre&date=2026-09-08
//
// ============================================

router.get(
    "/",
    (req, res) => {

        const {
            centre,
            date
        } = req.query;


        if (!centre || !date) {

            return res.status(400).json({

                success: false,

                message:
                    "Centre and date are required."

            });

        }


        const sql = `

            SELECT
                id,
                booking_id,
                farmer_id,
                token,
                crop,
                quintals,
                centre,
                date,
                time,
                status

            FROM bookings

            WHERE centre = ?
            AND date = ?

            AND status IN (
                'Confirmed',
                'Arrived',
                'Processing'
            )

            ORDER BY id ASC

        `;


        db.all(

            sql,

            [
                centre,
                date
            ],

            (err, rows) => {

                if (err) {

                    console.error(
                        "Queue list error:",
                        err.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Unable to retrieve queue."

                    });

                }


                // =================================
                // ADD QUEUE POSITION
                // =================================

                const queue =
                    rows.map(
                        (item, index) => {

                            return {

                                ...item,

                                position:
                                    index + 1,

                                farmers_ahead:
                                    index,

                                estimated_wait:
                                    index * 5

                            };

                        }
                    );


                res.json({

                    success: true,

                    centre:
                        centre,

                    date:
                        date,

                    total:
                        queue.length,

                    current_serving:
                        queue.length > 0
                            ? queue[0].token
                            : "—",

                    queue:
                        queue

                });

            }

        );

    }

);


// ============================================
// TEST QUEUE ROUTE
// ============================================

router.get(
    "/test",
    (req, res) => {

        res.json({

            success: true,

            message:
                "Queue routes are working!"

        });

    }
);


// ============================================
// EXPORT
// ============================================

module.exports = router;