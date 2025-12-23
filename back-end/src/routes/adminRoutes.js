

const express = require("express");
const router = express.Router();

const healthcheckController = require("../controllers/healthcheckController");
router.get("/healthcheck", healthcheckController.healthcheck);

const resetpointsController = require("../controllers/resetpointsController");
router.post("/resetpoints", resetpointsController.resetpoints);


module.exports = router;
