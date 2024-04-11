import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  const { userName, password, email } = req.body;

  //   hash password
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);
    //   create a new user

    const user = await prisma.user.create({
      data: {
        userName,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User created succefully" });
    // db operations
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error: failed to create user" });
  }
};

export const login = async (req, res) => {
  // db operations
  const { userName, password } = req.body;
  try {
    // CHECK IF USER EXIST
    const user = await prisma.user.findUnique({ where: { userName } });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Server Error: Invalid Credentials!" });
    }

    // CHECK IF PASSWORD IS CORRECT
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Server Error: Invalid Credentials!" });
    }

    // GENERATE COOKIE TOKEN AND SEND TO USER
    const age = 1000 * 60 * 60 * 24;
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: age,
    });
    const { password: userPassword, ...userInfo } = user;
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (error) {
    // RETURN AN ERROR IF there is an error
    console.log(error.message);
    res.status(500).json({ message: "Server Error: failed to Login" });
  }
};
export const logout = (req, res) => {
  // db operations
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
