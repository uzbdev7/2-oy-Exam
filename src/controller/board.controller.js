import pool from "../config/pool.js";

export const createBoard = async (req, res, next) => {
  try {
    const { title, user_id } = req.body;

    await pool.query(`INSERT INTO boards(title, user_id) VALUES ($1, $2)`, [
      title,
      user_id,
    ]);

    
    console.log("Board yaratildi:", title);
    return res.status(201).send({ message: "board yaratildi." });
  } catch (err) {
    console.log("Xato:", err);
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    const totalResult = await pool.query(`SELECT COUNT(*) FROM boards;`);
    const total = parseInt(totalResult.rows[0].count);
    const len = totalResult.length;

    const result = await pool.query(
      `SELECT * FROM boards LIMIT $1 OFFSET $2;`,
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
    console.log("Xato:", err);
    next(err);
  }
};

export const updateBoard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = [];
    const values = [];
    let idx = 1;

    const boardCheck = await pool.query(`SELECT * FROM boards where id = $1;`, [
      id,
    ]);

    if (boardCheck.rows.length === 0) {
      return res.status(404).json({ message: "board topilmadi." });
    }

    for (const [key, value] of Object.entries(req.body)) {
      fields.push(`${key}=$${idx}`);
      values.push(value);
      idx++;
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "O'zgarish mavjud emas." });
    }

    values.push(id);

    const updatedBoard = await pool.query(
      `UPDATE boards SET ${fields.join(", ")} where id = $${idx} returning *`,
      values
    );
    res.send({
      message: "Muvafaqqiyatli yangilandi.",
      board: updatedBoard.rows[0],
    });

  } catch (err) {
    console.log("Xatolik:", err);
    next(err);
  }
};

export const deleteBoard = async (req, res, next) => {
  try {
    const { id } = req.params;

    const boardCheck = await pool.query(`SELECT * FROM boards WHERE id = $1;`, [
      id,
    ]);

    if (boardCheck.rows.length === 0) {
      return res.status(404).json({ message: "Ma'lumot topilmadi." });
    }

    const {rows} = await pool.query(`DELETE FROM boards WHERE id = $1;`, [id]);

    res.status(200).json({
      message: "Muvafaqqiyatli o'chirildi"
    });

  } catch (err) {
    console.log("Xatolik:",err);
    next(err);
  }
};

export const searchBoard = async (req, res, next) => {
  try {
    const search = req.query.search;

    if (!search) {
      return res.status(400).send({ message: "Qidiruv so'zi kiritilmadi." });
    }

    const result = await pool.query(
      `SELECT * FROM boards WHERE id::text ILIKE $1 OR title ILIKE $1 OR user_id ::text ILIKE $1;`,
      [`%${search}%`]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .send({ message: "Xech qanday ma'lumot topilmadi." });
    }
    
    res.status(200).json(result.rows);
  } catch (err) {
    console.log("Xatolik: ", err);
    next(err);
  }
};

