const express = require("express");
const router = express.Router();

const studentController = require("../controller/studentController");

router.post("/posting", studentController.posting);
router.get("/getall", studentController.getall);
router.get("/getById/:id", studentController.getById);


module.exports = router;
