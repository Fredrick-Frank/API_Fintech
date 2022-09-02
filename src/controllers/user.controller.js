require("dotenv").config();
const acct_no_gen = require('../../generate_random_acct_no/acct_no_gen');
const db = require('../../config/database')
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


const UserController = {
    login: async(req, res) => {
        const { id, password } = req.body;
        if (!(id && password)) {
            res.status(400).json("Enter all required inputs");
        };
        userExists = await db(process.env.DB_T_USERS).select("*").where('id', id)
            .then(row => { return row[0] })
            .catch((err) => { console.log(err); throw err });

        if (userExists || await bcrypt.compare(password, userExists.password)) {
            const token = jwt.sign({ id },
                process.env.TOKEN_KEY, {
                    expiresIn: "60d",
                }
            );
            await db(process.env.DB_T_USERS)
                .where({ id: id })
                .update({ token: token })
                .then(() => {
                    db(process.env.DB_T_USERS)
                        .where({ id: id })
                        .select("id", "first_name", "last_name", "id", "token")
                        .then(response => res.status(200).json({ data: response, message: "user successfully logged in" }))
                        .catch(err => res.status(404).json(err));
                })
                .catch(err => res.status(404).json({ message: "user not found", error: err }));
        } else {
            return res.status(404).json("incorrect details");
        };
    },
    createUser: async(req, res) => {
        const { first_name, last_name, id, password, confirmPassword, amount, transaction_pin, phone_no } = req.body;
        if (!(id && password && confirmPassword && first_name && last_name && transaction_pin && phone_no)) {
            return res.status(400).json("Enter all required inputs");
        };
        if (password !== confirmPassword) {
            return res.status(400).json("passwords do not match");
        };
        if (amount <= 0 || amount === "") {
            amount = 0;
        };

        userExists = await db(process.env.DB_T_USERS).select("id").where('id', id)
            .then((rows) => {
                for (row of rows) {
                    return row['id'];
                }
            })
            .catch((err) => { console.log(err); throw err });
        if (userExists) {
            return res.status(400).json("userExists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPin = await bcrypt.hash(String(transaction_pin), 10);
        const token = jwt.sign({ id: id }, process.env.TOKEN_KEY, { expiresIn: "60d" });
        const new_acct_no = await acct_no_gen(db);

        await db(process.env.DB_T_USERS).insert({
                first_name: first_name,
                last_name: last_name,
                id: id,
                user_password: hashedPassword,
                account_no: new_acct_no,
                transaction_pin: hashedPin,
                token: token,
                amount: amount,
                phone_no: phone_no
            }) 
            .then(_response => {
                return res.status(201).json({ message: "user successfully added" })
            })
            .catch(err => {
                console.log("error: ", err);
                return res.status(500).json("an error occured");
            });
    },

    getAllUsers: async(_req, res) => {
        await db(process.env.DB_T_USERS)
            .select("id", "first_name", "last_name", "account_no", "amount", "created_at")
            .then(response => res.status(200).json(response))
            .catch(err => res.status(400).json(err));
    },

    getUser: async(req, res) => {
        await db(process.env.DB_T_USERS)
            .where({ id: req.params.id })
            .select("id", "first_name", "last_name", "account_no", "amount", "created_at")
            .then(response => res.status(200).json(response))
            .catch(err => res.status(404).json({ message: "not found", error: err }));
    },

    updateUser: async(req, res) => {
        if (req.body.amount || req.body.created_at || req.body.id || req.body.account_no) {
            return res.status(403).json("cannot update amount, account number, date created and id");
        }
        await db(process.env.DB_T_USERS)
            .where({ id: req.params.id })
            .update(req.body)
            .then(() => {
                db(process.env.DB_T_USERS)
                    .where({ id: req.params.id })
                    .select("id", "first_name", "last_name", "id", "transaction_pin")
                    .then(response => res.status(201).json({ data: response, message: "user successfully updated" }))
                    .catch(err => res.status(404).json(err));
            })
            .catch(err => res.status(404).json({ message: "user not found", error: err }));
    },

    deleteUser: async(req, res) => {
        userExists = await db(process.env.DB_T_USERS).select("id").where('id', req.params.id)
            .then((rows) => {
                for (row of rows) {
                    return row['id'];
                }
            })
            .catch((err) => { console.log(err); throw err });
        if (!(userExists)) {
            return res.status(400).json("user does not exist");
        }
        await db(process.env.DB_T_USERS)
            .where({ id: req.params.id })
            .del()
            .then(() => res.status(200).json("user successfully deleted"))
            .catch(err => res.status(404).json({ error: err, message: "user not found" }));
    }
}

module.exports = UserController;