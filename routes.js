const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth.js");

const User = require("../models/users.js");
const Car = require("../models/cars.js");

router.post("/register", async (req, res) => {

    try {
        const {first_name, last_name, email, password} = req.body;

        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required");
        }

        const oldUser = await User.findOne({email});

        if (oldUser) { return res.status(409).send("User already exists")};

        encryptedUserPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            first_name: first_name,
            last_name: last_name,
            email: email.toLowerCase(),
            role: "admin",
            is_admin: true,
            password: encryptedUserPassword
        });

        const token = jwt.sign(
            {user_id: user._id, email},
            process.env.TOKEN_KEY,
            {
                expiresIn: "5h"
            }
        );

        user.token = token;
        user.role = "admin";
        user.is_admin = true;

        res.status(201).send(user);



    }catch(err) {

        console.log(err);

    }
});

//admin login
router.post("/login", async (req, res) => {

    try {

        //console.log(req);
        const {email, password } = req.body;

        if (!(email && password)) {
            res.status(400).send("All input is required");
        }


        const user = await User.findOne({email: email});

        if (user && await bcrypt.compare(password, user.password)) {

            const token = jwt.sign(
                {user_id: user._id, email},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "5h"
                }
            )

            user.token = token;
            req.user = user;
            req.headers["x-access-token"] = token;
            let options = {
                path: "/",
                sameSite: true,
                maxAge: 1000 * 60 * 24,
                httpOnly: true
            };
            res.cookie('x-access-token', token, options);
            res.cookie("loggedin", true);
            const id = req.user._id;
            const adminCars = await Car.find({relational_id: id});
            //res.status(200).json(adminCars);
            return res.status(200).render('views/admin', {
               cars: adminCars
            });


            //console.log(user);
            //return res.status(200).json(user);
            //return res.status(200).render('views/admin');
        }

        return res.status(400).send("Invalid credentials");


         


    }catch(err) {
        console.log(err)
    }

});

router.post("/newcar", auth, async (req, res, next) => {

    try {

        const {make, model, year} = req.body;
        const id = req.user.user_id;
        const car = await Car.create({
            make: make, 
            model: model, 
            year: year,
            is_available: true,
            relational_id: id
        });
        //console.log(req.user);
        res.status(201).json(car);

    }catch(err) {
        console.log(err);
    }
    next();
});

//returns all cars of an admin
router.get("/getcars", auth, async (req, res, next) => {

    try {
        //console.log(req.user);
        //console.log(req);
        const id = req.user.user_id;
        const adminCars = await Car.find({relational_id: id});
        //res.status(200).json(adminCars);
        res.status(200).render('views/admin', {
            cars: adminCars
        });

    }catch(err) {
        console.log(err)
    }

})

module.exports = router;