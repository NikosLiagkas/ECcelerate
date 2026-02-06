

const { buildErrorLog } = require("../utils");
const addpointsModel = require("../models/addpointsModel");
const { parse } = require("csv-parse/sync");


exports.addChargers = async (req, res) => {

    try {   
        if (!req.file){
            return res.status(400).json(
                buildErrorLog(req, 400, err.message, "Provide a file")
            )
        }
        
        const mime = req.file.mimetype || "";

        if (!mime.startsWith("text/csv")) {
        return res.status(400).json(
           buildErrorLog(req, 400, `Invalid MIME type: ${mime}`, "MIME type has to be text/csv")
        );
        }

        const csvText = req.file.buffer.toString("utf8");
        const rows = parse(csvText, {
                columns: true,
                trim: true
            });

        if (rows.length === 0) {
            return res.status(400).json(
                buildErrorLog(req, 400, err.message, "No rows found")
            );
        }

        await addpointsModel.createChargers(rows);

        return res.sendStatus(200);

    } catch(err) {

        return res.status(400).json(buildErrorLog(req, 400, err.message , "Unreachable database"))

    }

};