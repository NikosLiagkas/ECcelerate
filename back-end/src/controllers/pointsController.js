
const { buildErrorLog } = require("../utils");
const pointsModel = require("../models/pointsModel");


exports.points = async (req, res) => {

    try {   
        let point_status = req.query.status;

        if (point_status === undefined) {
            point_status = "";
            const points = await pointsModel.getPoints(point_status);
            return res.status(200).json({points});
        }
        
        const status_enum = ["available", "charging", "reserved", "malfunction" , "offline"];

        if (!status_enum.includes(point_status)) {
            return res.status(401).json(buildErrorLog(req, 401, "Invalid status parameter.", "Please try again with a valid status parameter."));
        }
        
        const points = await pointsModel.getPoints(point_status);
        return res.status(200).json(points);

    } catch(err) {
        return res.status(400).json(buildErrorLog(req, 400, err.message , "Go look at the Database"));
    }

};

