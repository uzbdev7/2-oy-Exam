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
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM columns WHERE name ILIKE $1 OR
       board_id::text ILIKE $1;`,
      [`%${search}%`]
    );
    const total = parseInt(totalResult.rows[0].count);

    const result = await pool.query(
      `SELECT * FROM columns WHERE name ILIKE $1 OR
       board_id::text ILIKE $1 LIMIT $2 OFFSET $3;`,
      [`%${search}%`,limit, offset]
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
  } catch (err) {
    next(err);
  }
};
const getOneById = async(req,res,next) =>{

   try{
        const {id} = req.params

      const result = await pool.query(`SELECT * FROM columns WHERE id=$1;`,[id])

      if(result.rows.length === 0){
        res.status(404).json({message:"Bunday column mavjud emas."})
      }

      res.status(200).json(result.rows)

   }catch(error){
    next(error)
   }
}

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
    next(error);
  }
};


export {
  createColumn,
  getAllColumns,
  UpdateColumns,
  deleteColumn,
  getOneById,
};
