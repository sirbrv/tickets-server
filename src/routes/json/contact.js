const express = require("express");
const router = express.Router();
const {
  getContacts,
  getContact,
  delContact,
  AddContact,
  upDateContact,
} = require("../../controller/json/contactsController");

router.get("/contacts", getContacts);
router.get("/contact/:id", getContact);
router.post("/contact", AddContact);
router.put("/contact/:id", upDateContact);
router.delete("/contact/:id", delContact);

module.exports = router;
