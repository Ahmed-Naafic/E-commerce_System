const bcrypt = require("bcrypt");
const User = require("../models/user");
const generateToken = require("../../../common/utils/generateToken");


const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User has been created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginUser = async (req,res) =>{
    
   try{

     const {email,password} = req.body ;

    if (!email || !password){
        return res.status(400).json({
            message : "All fields are required "
        })
    }

    const user = await User.findOne ({email});

    if (!user) {
        return res.status(400).json({
            message : "invalid credential"
        })
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch){
        return res.status(400).json({
            message : "invalid credential"
        })
    }

    const token =  generateToken(user._id);
   
    res.status(201).json({
        message:"Login seccessfully",
        token,
        user : {
            id :user._id,
            name:user.name,
            email :user.email,
            role:user.role,
        }
    })




   } catch(error){
    res.status(500).json({
        message: error.message
    })

   }
}


const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = { registerUser, loginUser, getMe };
