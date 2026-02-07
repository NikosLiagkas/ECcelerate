const pointStatusModel = require("../models/pointStatusModel");
const { buildErrorLog } = require("../utils/utils");
const { toCSV } = require("../utils/csv");

const DATE_REGEX = /^\d{8}$/;

exports.getPointStatus = async (req, res) => {
  try {
    const { pointid, from, to } = req.params;
    const format = req.query.format || "json";

    // format validation
    if (!["json", "csv"].includes(format)) {
      return res.status(400).json(
        buildErrorLog(req, 400, "Invalid format", "Allowed: json, csv")
      );
    }

    // pointid validation
    const chargerId = parseInt(pointid);
    if (!Number.isInteger(chargerId) || chargerId <= 0) {
      return res.status(400).json(
        buildErrorLog(req, 400, "Invalid pointid")
      );
    }

    // date validation
    if (!DATE_REGEX.test(from) || !DATE_REGEX.test(to)) {
      return res.status(400).json(
        buildErrorLog(req, 400, "Invalid date format", "Expected YYYYMMDD")
      );
    }

    const fromDate = `${from.slice(0,4)}-${from.slice(4,6)}-${from.slice(6,8)}`;
    const toDate   = `${to.slice(0,4)}-${to.slice(4,6)}-${to.slice(6,8)}`;

    const rows = await pointStatusModel.getPointStatus(
      chargerId,
      fromDate,
      toDate
    );

    // no data
    if (rows.length === 0) {
      return res.status(204).send();
    }

    // CSV
    if (format === "csv") {
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        const header = ["timeref", "old_state", "new_state"];
        const csv = toCSV(header, rows);
        return res
            .status(200)
            .type("text/csv; charset=utf-8")
            .send(csv);
    }

    // JSON
    return res.status(200).json(rows);

  } catch (err) {
    if (err.message === "Charger not found") {
      return res.status(404).json(
        buildErrorLog(req, 404, err.message)
      );
    }

    return res.status(500).json(
      buildErrorLog(req, 500, "Internal server error", err.message)
    );
  }
};
