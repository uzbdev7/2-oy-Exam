import pool from "../config/pool.js";
import * as bcrypt from "bcrypt";

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *;`,
      [name, email, hashedPassword]
    );

    return res.status(201).json({ message: "Siz muvaffaqiyatli ro'yxatdan o'tdingiz." });

  } catch (error) {

    if (error.code === "23505") {
      error.status = 409;
      error.message = "Bu email bilan foydalanuvchi allaqachon ro'yxatdan o'tgan.";
    }
    next(error); 
  }
};


const getAll = async (req, res, next) => {

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM users WHERE name ILIKE $1 OR
       email ILIKE $1;`,
      [`%${search}%`]
    );
    const total = parseInt(totalResult.rows[0].count);

    const result = await pool.query(
      `SELECT id, name, email 
       FROM users 
       WHERE name ILIKE $1 OR email ILIKE $1
       LIMIT $2 OFFSET $3;`,
      [`%${search}%`, limit, offset]
    );

    if(result.rows.length === 0){
       return res.status(404).json({message:"Ma'lumot topilmadi."})
    }

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

const getOneById = async(req,res,next) =>{

   try{
        const {id} = req.params

      const result = await pool.query(`SELECT id, name,email FROM users WHERE id=$1;`,[id])

      if(result.rows.length === 0){
        res.status(404).json({message:"Bunday user mavjud emas."})
      }

      res.status(200).json(result.rows)

   }catch(error){
    next(error)
   }
}


const login = async (req, res, next) => {

  try {
    const { email, password } = req.body;

      if (!email || !password) {
      return res.status(400).json({ message: "Email va password majburiy." });
    }

    const foundedUser = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      email
    ]);

    if(foundedUser.rows.length === 0) {
    return res.status(404).json({ message: "Bunday user mavjud emas." });
    }

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
    next(error);
  }
};

const UserUpdate = async (req, res, next) => {
  try {
    const fields = [];
    const values = [];
    let idx = 1;

    const { id } = req.params;

    const UserCheck = await pool.query(`SELECT * FROM users WHERE id=$1;`, [id]);

    if (UserCheck.rows.length === 0)
      return res.status(404).json({ message: "User topilmadi." });

    for (const [key, value] of Object.entries(req.body)) {
      let hashed = value;

      if (key === "password" && value) {
        hashed = await bcrypt.hash(value, 10);
      }

      fields.push(`${key} = $${idx}`);
      values.push(hashed);
      idx++;
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "O'zgarishlar mavjud emas." });
    }

    values.push(id);

    const UpdatedUser = await pool.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING id, name, email;`,
      values
    );

    res.json({
      message: "Muvaffaqiyatli yangilandi.",
      data: UpdatedUser.rows[0]
    });
  } catch (error) {
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
      message: "Foydalanuvchi o'chirildi"
    });
    
  } catch (error) {
    next(error);
  }
};

export { createUser, getAll, login, UserUpdate, deleteUser, getOneById };
