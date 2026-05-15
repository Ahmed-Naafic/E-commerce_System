const bcrypt = require("bcrypt");
const user = require("../models/user")

const registerUser = async (req,res)=>{
    try{
        const {name, email, password } = req.body;

        if (!name || !email || !password){
           return  res.status(400).json({
                message : "All fields are required"

            });
        }

        const existingUser = await user.findOne({email});

        if (existingUser){
            return res.status(400).json({
                message:"User already exist"
            })
        };

        const hashedPassword = await bcrypt.hash(password,10);

        const user  = await user.create({
            name,
            email,
            password:hashedPassword
        });

        res.status(201).json({
            message: "user has been created seccesfully",
            user:{
                id: user._id,
                name:user.name,
                email : user.email,
                role: user.role
            },
        });

    }
    catch(error){
        res.status(500).json({
            message :error.message,
        })
    }
};

module.exports = {registerUser}