

const { buildErrorLog } = require("../utils");
const resetpointsModel = require("../models/resetpointsModel");
const fs = require("fs");
const RESET_FILE = "./data/parts1234.json";

exports.resetpoints = async (req, res) => {

    try {   

        const raw = fs.readFileSync(RESET_FILE, "utf8");
        const stations = JSON.parse(raw);
        
        await resetpointsModel.initialiseChargers(stations);

        return res.sendStatus(200);

    } catch(err) {

        return res.status(400).json(buildErrorLog(req, 400, err.message , "Invalid json file or unreachable database"))

    }

};


