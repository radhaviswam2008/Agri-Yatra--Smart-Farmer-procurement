// ============================================
// SMART FARMER PROCUREMENT SYSTEM
// BOOKING ROUTES
// ============================================

const express = require("express");

const router = express.Router();

const db = require("../database");


// ============================================
// TEST BOOKING ROUTE
// ============================================

router.get("/test", (req, res) => {

    res.json({

        success: true,

        message:
            "Booking routes are working!"

    });

});


// ============================================
// GET LATEST BOOKING FOR FARMER
// ============================================

router.get(
    "/latest/:farmerId",
    (req, res) => {

        const farmerId =
            req.params.farmerId;


        console.log(
            `📅 Getting latest booking for farmer: ${farmerId}`
        );


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
                        "❌ Latest booking error:",
                        err.message
                    );


                    return res.status(500).json({

                        success: false,

                        message:
                            "Unable to retrieve latest booking."

                    });

                }


                // =================================
                // NO BOOKING
                // =================================

                if (!booking) {

                    console.log(
                        `ℹ️ No booking found for farmer ${farmerId}`
                    );


                    return res.json({

                        success: false,

                        message:
                            "No booking found for this farmer.",

                        booking: null

                    });

                }


                // =================================
                // BOOKING FOUND
                // =================================

                console.log(
                    "✅ Latest booking found:",
                    booking.booking_id
                );


                res.json({

                    success: true,

                    message:
                        "Latest booking retrieved successfully.",

                    booking: booking

                });

            }

        );

    }

);


// ============================================
// GET ALL BOOKINGS
// ============================================

router.get(
    "/",
    (req, res) => {

        const sql = `

            SELECT *

            FROM bookings

            ORDER BY id DESC

        `;


        db.all(

            sql,

            [],

            (err, rows) => {

                if (err) {

                    console.error(
                        "❌ Get bookings error:",
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

                    bookings: rows

                });

            }

        );

    }

);


// ============================================
// CREATE NEW BOOKING
// ============================================

router.post(
    "/",
    (req, res) => {

        const {

            farmer_id,

            crop,

            variety,

            quantity,

            quintals,

            centre,

            date,

            time,

            vehicle,

            vehicle_number

        } = req.body;


        // =====================================
        // VALIDATION
        // =====================================

        if (
            !farmer_id ||
            !crop ||
            !centre ||
            !date ||
            !time
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Farmer, crop, centre, date and time are required."

            });

        }


        // =====================================
        // QUANTITY
        // =====================================

        const finalQuintals =
            Number(
                quintals ??
                quantity ??
                0
            );


        if (
            !finalQuintals ||
            finalQuintals <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please provide a valid quantity."

            });

        }


        // =====================================
        // GENERATE BOOKING ID
        // =====================================

        const bookingId =

            "SF-" +

            Math.floor(
                100000 +
                Math.random() * 900000
            );


        // =====================================
        // GENERATE TOKEN
        // =====================================

        const token =

            "A-" +

            Math.floor(
                100 +
                Math.random() * 900
            );


        // =====================================
        // INSERT BOOKING
        // =====================================

        const sql = `

            INSERT INTO bookings

            (

                booking_id,

                farmer_id,

                crop,

                variety,

                weight,

                quintals,

                centre,

                date,

                time,

                vehicle,

                vehicle_number,

                token,

                status

            )

            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

        `;


        db.run(

            sql,

            [

                bookingId,

                farmer_id,

                crop,

                variety || "",

                finalQuintals,

                finalQuintals,

                centre,

                date,

                time,

                vehicle || "",

                vehicle_number || "",

                token,

                "Confirmed"

            ],

            function (err) {

                if (err) {

                    console.error(
                        "❌ Booking creation error:",
                        err.message
                    );


                    return res.status(500).json({

                        success: false,

                        message:
                            "Failed to create booking."

                    });

                }


                // =================================
                // SUCCESS
                // =================================

                console.log(
                    `✅ Booking created: ${bookingId}`
                );


                res.status(201).json({

                    success: true,

                    message:
                        "Procurement slot booked successfully.",

                    booking: {

                        id:
                            this.lastID,

                        booking_id:
                            bookingId,

                        farmer_id:
                            farmer_id,

                        crop:
                            crop,

                        variety:
                            variety || "",

                        weight:
                            finalQuintals,

                        quintals:
                            finalQuintals,

                        quantity:
                            finalQuintals,

                        centre:
                            centre,

                        date:
                            date,

                        time:
                            time,

                        vehicle:
                            vehicle || "",

                        vehicle_number:
                            vehicle_number || "",

                        token:
                            token,

                        status:
                            "Confirmed"

                    }

                });

            }

        );

    }

);


// ============================================
// GET BOOKING BY ID
// ============================================
//
// IMPORTANT:
// This route MUST come AFTER
// /latest/:farmerId
//
// Otherwise Express may interpret
// "latest" as an ID.
// ============================================

router.get(
    "/:id",
    (req, res) => {

        const bookingId =
            req.params.id;


        const sql = `

            SELECT *

            FROM bookings

            WHERE booking_id = ?

        `;


        db.get(

            sql,

            [bookingId],

            (err, booking) => {

                if (err) {

                    console.error(
                        "❌ Get booking error:",
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
// EXPORT ROUTER
// ============================================

module.exports = router;