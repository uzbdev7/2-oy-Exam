import pool from "../config/pool.js";

export const createBoard = async (req, res, next) => {
  try {
    const { title, user_id } = req.body;
    
    const userCheck = await pool.query(`SELECT * FROM users WHERE id=$1;`, [user_id]);

    if (userCheck.rows.length === 0) {
      return res.status(400).json({ message: "Bunday user_id mavjud emas." });
    }

    const result = await pool.query(`SELECT * FROM boards WHERE user_id=$1 AND title=$2;`, [user_id, title]);

    if (result.rows.length === 0) {

      const result = await pool.query(`INSERT INTO boards(title, user_id) VALUES ($1, $2) RETURNING *`, [
      title,
      user_id,
    ]);
    
    return res.status(201).send({ message: "board yaratildi.", user : result.rows[0] });
    }else {
      return res.status(400).json({ message: "Bu ma'lumot allaqachon mavjud." });
    }
    
  } catch (err) {
    console.log("Xato:", err);
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM boards WHERE title ILIKE $1 OR
       user_id ::text ILIKE $1;`,
      [`%${search}%`]
    );
    const total = parseInt(totalResult.rows[0].count);

    const result = await pool.query(
      `SELECT * FROM boards WHERE title ILIKE $1
       OR user_id ::text ILIKE $1 LIMIT $2 OFFSET $3;`,
      [`%${search}%`,limit, offset]
    );

    if(result.rows.length === 0){
       return res.status(200).json({message:[]})
    }

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: result.rows,
    });
  } catch (err) {
    console.log("Xato:", err);
    next(err);
  }
};


export const getOneById = async(req,res,next) =>{

   try{
        const {id} = req.params

      const result = await pool.query(`SELECT * FROM boards WHERE id=$1;`,[id])

      if(result.rows.length === 0){
        res.status(404).json({message:"Bunday board mavjud emas."})
      }

      res.status(200).json(result.rows)

   }catch(error){
    next(error)
   }
}

export const updateBoard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = [];
    const values = [];
    let idx = 1;

    const boardCheck = await pool.query(`SELECT * FROM boards where id = $1;`, [
      id
    ]);

    if (boardCheck.rows.length === 0) {
      return res.status(404).json({ message: "board topilmadi." });
    }else{

    for (const [key, value] of Object.entries(req.body)) {

      if(key === "user_id" && value !== undefined){

        const userCheck = await pool.query(`SELECT * FROM users WHERE id=$1;`, [value]);

        if (userCheck.rows.length === 0) {

          return res.status(400).json({ message: "Bunday user_id mavjud emas." });
        }  
    }
      fields.push(`${key}=$${idx}`);
          values.push(value);
          idx++;
  }

    if (fields.length === 0) {
      return res.status(400).json({ message: "Ma'lumot kiritilmagan." });
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
  }

  }catch(err) {
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
      return res.status(200).json({ message: []});
    }else{
      await pool.query(`DELETE FROM boards WHERE id = $1;`, [id]);
    }
    res.status(200).json({message: "Muvafaqqiyatli o'chirildi"});

  } catch (err) {
    next(err);
  }
};
