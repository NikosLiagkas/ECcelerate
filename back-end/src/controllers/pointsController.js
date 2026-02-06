const { buildErrorLog } = require("../utils");
const pointsModel = require("../models/pointsModel");

exports.points = async (req, res) => {
  try {
    let point_status = req.query.status;
    const format = req.query.format || "json";

    if (point_status === undefined || point_status === "") {
      point_status = "";
    } else {
      const status_enum = ["available", "charging", "reserved", "malfunction", "offline"];
      if (!status_enum.includes(point_status)) {
        return res.status(401).json(
          buildErrorLog(req, 401, "Invalid status parameter.", "Please try again with a valid status parameter.")
        );
      }
    }

    const points = await pointsModel.getPoints(point_status);

    if (format === "csv") {
      res.setHeader("Content-Type", "text/csv; charset=utf-8");

      const header = "providerName,pointid,lon,lat,status,cap\n";

      const rows = points.map(p =>
        `${p.providerName},${p.pointid},${p.lon},${p.lat},${p.status},${p.cap}`
      ).join("\n");

      return res.status(200).send(header + rows);
    }

    // default JSON
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(200).json(points);

  } catch (err) {
    return res.status(400).json(
      buildErrorLog(req, 400, err.message, "Go look at the Database")
    );
  }
};
