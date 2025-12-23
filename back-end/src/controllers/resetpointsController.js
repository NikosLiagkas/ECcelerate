

const { buildErrorLog } = require("../utils");
const resetpointsModel = require("../models/resetpointsModel");

exports.resetpoints = async (req, res) => {

    try {   

        await resetpointsModel.initialisePoints();

        return res.sendStatus(200);

    } catch(err) {

        return res.status(400).json(buildErrorLog(req, 400, err.message , "Invalid json file or unreachable database"))

    }

};


