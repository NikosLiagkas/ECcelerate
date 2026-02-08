const { pool } = require("../../config/db");
const ApiError = require("../utils/apiError");

exports.updatePoint = async (id, { status, kwhprice }) => {
  const result = await pool.query(
    `UPDATE charger c
     SET status = COALESCE($2, c.status)
     FROM station s
     WHERE c.station_id = s.station_id
       AND c.charger_id = $1
     RETURNING c.charger_id AS "pointid",
               c.status,
               COALESCE($3, s.price_per_kwh) AS "kwhprice";`,
    [id, status ?? null, kwhprice ?? null]
  );

  if (result.rowCount === 0) {
    throw new ApiError(404, "Invalid point id", "Cannot find charge point with this ID in the database");
  }

  if (kwhprice !== undefined) {
    await pool.query(
      `UPDATE station
       SET price_per_kwh = $2
       WHERE station_id = (
         SELECT station_id FROM charger WHERE charger_id = $1
       );`,
      [id, kwhprice]
    );
  }

  return result.rows[0];
};
