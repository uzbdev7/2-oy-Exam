import pool from "../config/pool.js";

const createTasks = async (req, res, next) => {
  try {
    const { title, description, user_id, board_id, column_id } = req.body;

    const result = await pool.query(
      `INSERT INTO tasks (title, description, user_id, board_id, column_id) VALUES($1, $2, $3, $4, $5) RETURNING *;`,
      [title, description, user_id, board_id, column_id]
    );
    
    return res.status(201).send(result.rows[0]);

  } catch (err) {
    next(err);
  }
};


const getAllTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    const totalResult = await pool.query(`SELECT COUNT(*) FROM tasks WHERE id::text ILIKE $1 OR title ILIKE $1 OR description ILIKE $1 OR user_id::text ILIKE $1 OR board_id::text ILIKE $1 OR column_id::text ILIKE $1;`,
      [`%${search}%`]
    );
    const total = parseInt(totalResult.rows[0].count);

    const result = await pool.query(`SELECT * FROM tasks WHERE title ILIKE $1 OR description ILIKE $1 OR user_id::text ILIKE $1 OR board_id::text ILIKE $1 OR column_id::text ILIKE $1 LIMIT $2 OFFSET $3;`, [
      `%${search}%`,
      limit,
      offset,
    ]);

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

      const result = await pool.query(`SELECT * FROM tasks WHERE id=$1;`,[id])

      if(result.rows.length === 0){
        res.status(404).json({message:"Bunday task mavjud emas."})
      }

      res.status(200).json(result.rows)

   }catch(error){
    next(error)
   }
}


const UpdateTasks = async (req, res, next) => {
  try {
    const fields = [];
    const values = [];
    let idx = 1;
    const { id } = req.params;

    const TaskCheck = await pool.query(`SELECT * FROM tasks WHERE id=$1;`, [
      id,
    ]);

    if (TaskCheck.rows.length === 0)
      return res.status(404).send({ message: "tasks topilmadi." });

    for (const [key, value] of Object.entries(req.body)) {
      fields.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "O'zgarishlar mavjud emas." });
    }

    values.push(id);

    const UpdatedTasks = await pool.query(
      `UPDATE tasks SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *;`,
      values
    );

    res.json({
      message: "Muvafaqqiyatli yangilandi.",
      data: UpdatedTasks.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

const deleteTasks = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      " DELETE FROM tasks WHERE id = $1 RETURNING *;",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task topilmadi" });
    }

    res.status(200).json({
      message: "Task o'chirildi"
    });
  } catch (error) {
    next(error);
  }
};


export { createTasks, getAllTasks, UpdateTasks, deleteTasks, getOneById };
