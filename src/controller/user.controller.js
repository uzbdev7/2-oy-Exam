import pool from "../config/pool.js";
import * as bcrypt from "bcrypt";

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *;`,
      [name, email, hashedPassword]
    );

    return res.status(201).send(rows[0]);
  } catch (error) {
    console.log("Xatolik:", error);
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    const totalResult = await pool.query(`SELECT COUNT(*) FROM users;`);
    const total = parseInt(totalResult.rows[0].count);
    const len = totalResult.length;

    const result = await pool.query(`SELECT * FROM users LIMIT $1 OFFSET $2;`, [
      limit,
      offset,
    ]);

    res.status(200).json({
      page,
      limit,
      total: len,
      totalPages: Math.ceil(total / limit),
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const foundedUser = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);

    if (!foundedUser)
      return res
        .status(404)
        .send({ message: "Bunday user ma'lumotlari mavjud emas." });

    const matchPassword = await bcrypt.compare(
      password,
      foundedUser.rows[0].password
    );

    if (!matchPassword)
      return res.status(401).send({ message: "Password mos emas." });

    res.send({
      message: "Login muvafaqqiyatli tizimga kirdi.",
      foundedUser: {
        id: foundedUser.rows[0].id,
        name: foundedUser.rows[0].name,
        email: foundedUser.rows[0].email,
      },
    });
  } catch (error) {
    console.log("Xatolik:", error);
    next(error);
  }
};

const UserUpdate = async (req, res, next) => {
  try {
    const fields = [];
    const values = [];
    let idx = 1;

    const { id } = req.params;

    const UserCheck = await pool.query(`SELECT * FROM users WHERE id=$1;`, [
      id,
    ]);

    if (UserCheck.rows.length === 0)
      return res.status(404).send({ message: "User topilmadi." });

    for (const [key, value] of Object.entries(req.body)) {
      fields.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "O'zgarishlar mavjud emas." });
    }

    values.push(id);

    const UpdatedUser = await pool.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *;`,
      values
    );

    res.json({
      message: "Muvafaqqiyatli yangilandi.",
      data: UpdatedUser.rows[0],
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      " DELETE FROM users WHERE id = $1 RETURNING *;",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }

    res.status(200).json({
      message: "Foydalanuvchi o'chirildi",
      user: result.rows[0],
    });
  } catch (error) {
    console.log("Xatolik:", error);
    next(error);
  }
};

const searchUser = async (req, res, next) => {
  try {
    const search = req.query.search;

    if (!search) {
      return res.status(400).send({ message: "Qidiruv so'zi kiritilmadi." });
    }

    const result = await pool.query(
      `SELECT * FROM users WHERE name ILIKE $1 OR email ILIKE $1 OR password ILIKE $1;`,
      [`%${search}%`]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Hech qanday user topilmadi" });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.log("Xatolik:", err);
    next(err);
  }
};
export { createUser, getAll, login, UserUpdate, deleteUser, searchUser };
