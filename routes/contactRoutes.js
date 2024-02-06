const express = require("express");
const router = express.Router();
const Contact = require("../models/contactModels");
const validateToken = require("../validateToken");

router.use(validateToken);

// GET ALL CONTACTS
// @private
router.route('/').get(async(req, res) => {
    try {
        const contacts = await Contact.find({ user_id: req.user.id });
        res.json(contacts);
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// CREATE A CONTACT
// @private
router.route('/').post(async(req, res) => {
    try {
        const { name, email, phone } = req.body;
        if (!name || !email || !phone) {
            res.status(400).json({ error: "All fields are mandatory" });
            return;
        }

        const contact = await Contact.create({
            name,
            email,
            phone,
            user_id: req.user.id
        });
        res.json(contact);
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET SPECIFIC CONTACT
// @private
router.route('/:id').get(async(req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }
        res.json(contact);
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// UPDATE SPECIFIC CONTACT
// @private
router.route('/:id').put(async(req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }

        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedContact);
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE SPECIFIC CONTACT
// @private
router.route('/:id').delete(async(req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }

        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
