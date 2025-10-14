import pool from "../config/pool.js";

const createColumn = async (req, res, next) => {
  try {
    const { name, board_id } = req.body;
    const result = await pool.query(
      `INSERT INTO columns(name, board_id) VALUES($1, $2) RETURNING *;`,
      [name, board_id]
    );
    return res.status(201).send(result.rows[0]);
  } catch (err) {
    console.log("Xatolik:", err);
    next(err);
  }
};

const getAllColumns = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    const totalResult = await pool.query(`SELECT COUNT(*) FROM boards;`);
    const total = parseInt(totalResult.rows[0].count);
    const len = totalResult.length;

    const result = await pool.query(
      `SELECT * FROM columns LIMIT $1 OFFSET $2;`,
      [limit, offset]
    );

    res.status(200).json({
      page,
      limit,
      total: len,
      totalPages: Math.ceil(total / limit),
      data: result.rows,
    });
  } catch (err) {
    console.log("Xatolik:", err);
    next(err);
  }
};

const UpdateColumns = async (req, res, next) => {
  try {
    const fields = [];
    const values = [];
    let idx = 1;
    const { id } = req.params;

    const ColumnCheck = await pool.query(`SELECT * FROM columns WHERE id=$1;`, [
      id,
    ]);

    if (ColumnCheck.rows.length === 0)
      return res.status(404).send({ message: "columns topilmadi." });

    for (const [key, value] of Object.entries(req.body)) {
      fields.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "O'zgarishlar mavjud emas." });
    }

    values.push(id);

    const result = await pool.query(`UPDATE columns SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *;`, values);

    res.json({
      message: "Muvafaqqiyatli yangilandi.",
      data: result.rows[0],
    });

  } catch (err) {
    console.log("Xatolik:", err);
    next(err);
  }
};

const deleteColumn = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      " DELETE FROM columns WHERE id = $1 RETURNING *;",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "column topilmadi" });
    }

    res.status(200).json({
      message: "Ma'lumot o'chirildi"
    });
  } catch (error) {
    console.log("Xatolik:", error);
    next(error);
  }
};

const searchColumn = async (req, res, next) => {
  try {
    const search = req.query.search;

    if (!search) {
      return res.status(400).send({ message: "Qidiruv so'zi kiritilmadi." });
    }

    const result = await pool.query(
      `SELECT * FROM columns WHERE id::text ILIKE $1 OR name ILIKE $1 OR board_id::text ILIKE $1;`,
      [`%${search}%`]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Hech qanday ma'lumot topilmadi" });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.log("Xatolik:", err);
    next(err);
  }
};

export {
  createColumn,
  getAllColumns,
  UpdateColumns,
  deleteColumn,
  searchColumn,
};
