const sessionModel = require("../models/sessionsModel");
const { buildErrorLog } = require("../utils/utils");
const { toCSV } = require("../utils/csv");

const DATE_REGEX = /^\d{8}$/; // YYYYMMDD

exports.getSessions = async (req, res) => {
  try {
    const { id, from, to } = req.params;
    const format = req.query.format || "json";

    if (!["json", "csv"].includes(format)) {
        return res.status(400).json(
          buildErrorLog(req, 400, "Invalid format", "Allowed: json, csv")
        );
      }

    // Validate id
    const chargerId = parseInt(id);
    if (!Number.isInteger(chargerId) || chargerId <= 0) {
      return res.status(400).json(
        buildErrorLog(req, 400, "Invalid charger id")
      );
    }

    // Validate dates
    if (!DATE_REGEX.test(from) || !DATE_REGEX.test(to)) {
      return res.status(400).json(
        buildErrorLog(
          req,
          400,
          "Invalid date format",
          "Expected YYYYMMDD"
        )
      );
    }

    // convert YYYYMMDD → YYYY-MM-DD
    const fromDate = `${from.slice(0,4)}-${from.slice(4,6)}-${from.slice(6,8)}`;
    const toDate   = `${to.slice(0,4)}-${to.slice(4,6)}-${to.slice(6,8)}`;

    const sessions = await sessionModel.getSessions(
      chargerId,
      fromDate,
      toDate
    );

    // No data → 204
    if (sessions.length === 0) {
      return res.status(204).send();
    }

    if (format === "csv") {
        res.setHeader("Content-Type", "text/csv; charset=utf-8");

        const header = ["starttime","endtime","startsoc","endsoc","totalkwh","kwhprice","amount"];
        const csv = toCSV(header, sessions);

        return res.status(200).type("text/csv; charset=utf-8").send(csv);
    }
  

    // Success → 200
    return res.status(200).json(sessions);

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
