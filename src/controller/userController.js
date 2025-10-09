import pool from "../db/pool.js"
import { userValidation, userValidationUpdate } from "../validations/user.validation.js"
import  *as bcrypt from "bcrypt";

const createUser = async (req,res) => {
    try{

        const {value, error} = userValidation(req.body);
        if(error) return res.status(422).send(error.details[0].message);
        const { name, email, password } = value
    
        const hashedPassword = await bcrypt.hash(password, 10);

        const  {rows} = await pool.query(`INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *;`,[name, email, hashedPassword])

        return res.status(201).send(rows[0])

    }catch(error){
        console.log(error);
    }
}
const getAll = async (req, res)=> {
    try{
        const {rows} = await pool.query(`SELECT * FROM users`)
        return res.status(200).send(rows[0])
    }catch(error){
        console.log(error)
    }
}

const login = async (req, res)=> {
    try{
        const {email, password} = req.body

        const foundedUser = await pool.query(
            `SELECT * FROM users WHERE email=$1`,[email]
        )

        if(!foundedUser) return res.status(404).send({message:"Bunday user ma'lumotlari mavjud emas."})

        const matchPassword = await bcrypt.compare(password, foundedUser.rows[0].password)

        if(!matchPassword) return res.status(404).send({message:"Password mos emas."})

        return res.status(200).send({message:"Muvafaqqiyatli kirildi!"})

    }catch(error){
        console.log(error)
    }
}

const UserUpdate = async (req,res) => {
    try{

        const fields = []
        const values = []
        let idx = 1;

        const {value, error} = userValidationUpdate(req.body);
        const result = value
        if(error) return res.status(422).send(error.details[0].message);

        const { id } = req.params

        const UserCheck = await pool.query(`SELECT * FROM USERS WHERE id=$1;`,[id]);
        if(UserCheck.rows.length == 0) return res.status(404).send({message:"User topilmadi."});

        for(const [key, value] of Object.entries(result)){
                fields.push(`${key} = $${idx}`);
                values.push(value);
                idx++;
            }

        if(fields.length === 0){
            return res.status(400).json({ message:"O'zgarishlar mavjud emas." });
            }

         values.push(id);

        let UpdatedUser = await pool.query(
                `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *;`, values);

            res.json({ message:"Muvafaqqiyatli yangilandi.", data: UpdatedUser.rows[0] });
    }catch(error){
        console.log(error)
    }
}

export {createUser,getAll,login}