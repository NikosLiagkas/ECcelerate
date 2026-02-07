const { buildErrorLog } = require("../utils");
const updpointModel = require("../models/updpointModel");

const STATUS_ENUM = ["available", "charging", "reserved", "malfunction", "offline"];

exports.updpoint = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json(
        buildErrorLog(req, 400, "Invalid point id.", "Point id must be a positive integer.")
      );
    }

    const { status, kwhprice } = req.body || {};

    if (status === undefined && kwhprice === undefined) {
      return res.status(400).json(
        buildErrorLog(req, 400, "Missing body fields.", "Provide status and/or kwhprice.")
      );
    }

    if (status !== undefined && !STATUS_ENUM.includes(status)) {
      return res.status(400).json(
        buildErrorLog(req, 400, "Invalid status.", "Status must be one of: available, charging, reserved, malfunction, offline.")
      );
    }

    if (kwhprice !== undefined && (Number.isNaN(Number(kwhprice)) || Number(kwhprice) < 0)) {
      return res.status(400).json(
        buildErrorLog(req, 400, "Invalid kwhprice.", "kwhprice must be a non-negative number.")
      );
    }

    const updated = await updpointModel.updatePoint(id, { status, kwhprice });

    if (!updated) {
      return res.status(204).send();
    }

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json(
      buildErrorLog(req, 400, err.message, "Go look at the Database")
    );
  }
};
