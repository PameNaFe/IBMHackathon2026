const pool = require('../db/pool');

const hasOverlap = async (espacio_id, hora_entrada, hora_salida, excludeId = null) => {
  let query = `
    SELECT id FROM reservaciones
    WHERE espacio_id = $1
      AND status = 'CONFIRMED'
      AND hora_entrada < $3
      AND hora_salida  > $2
  `;
  const params = [espacio_id, hora_entrada, hora_salida];

  // Para ediciones — excluye la reserva actual de la verificación
  if (excludeId) {
    params.push(excludeId);
    query += ` AND id != $${params.length}`;
  }

  const result = await pool.query(query, params);
  return result.rows.length > 0;
};

module.exports = { hasOverlap };