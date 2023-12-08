const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require('dotenv').config();
const app = express();
const port = 8000;
const cors = require("cors");
// Enable CORS for all routes
app.use(cors());
// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Mongoose"))
  .catch((err) => console.log("Couldn't connect to Mongoose", err));

app.listen(port, () => console.log("Server listening on port 8000"));

// // funtion to send verification mail to newUser
// const sendVerificationMail = async (email, verificationToken) => {
//   // create a nodemailer transport
//   const transporter = nodemailer.createTransport({
//     // confige the mail service
//     service: "gmail",
//     auth: {
      // user: "kaishavmehra123@gmail.com",
      // pass: "ajetmhbzkrmdwrrg",
//     },
//   });

//   // compose the email massage
//   const mailOptions = {
//     from: "amazon.com",
//     to: email,
//     subjecr: "Email Verification",
//     text: `please click the verification link to verify your email: http://localhost:8000/verify/${verificationToken}`,
//   };

//   // send the mail
//   try {
//     await transporter.sendMail(mailOptions);
//   } catch (err) {
//     console.log("Error sending mail: " + err);
//   }
// };

// // end point to register in application

// const User = require("./models/user");

// app.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // check if user or email is already registered
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already registered" });
//     }

//     // create new user
//     const newUser = new User({ name, email, password });

//     // Generate and store the verification token
//     newUser.verificationToken = crypto.randomBytes(20).toString("hex");

//     // save the new user
//     await newUser.save();

//     // send verification mail to the new user
//     sendVerificationMail(newUser.email, newUser.verificationToken);
//   } catch (err) {
//     console.log("error registering", err);
//     res.status(500).json({ message: "Registration failed" });
//   }
// });

// // endpoint to verify the mail
// app.get("/verify/:token", async (req, res) => {
//   try {
//     const token = req.params.token;

//     // find the user with the given verification token
//     const user = await User.findOne({ verificationToken: token });
//     if (!user) {
//       return res.status(404).json({ message: "Invalid verification token" });
//     }

//     // mark the user as verified
//     user.verified = true;
//     user.verificationToken = undefined;

//     await user.save();

//     res.status(200).json({ message: "Email verificaation successful" });
//   } catch (err) {
//     res.status(500).json({ message: "Email verification failed" });
//   }
// });


const User = require("./models/user");
// const Order = require("./models/order");

const sendVerificationEmail = async (email, verificationToken) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    // Configure the email service or SMTP details here
    service: "gmail",
    auth: {
      user: "kaishavmehra123@gmail.com",
      pass: process.env.PASS,
    },
  });

  // Compose the email message
  const mailOptions = {
    from: "amazon.com",
    to: email,
    subject: "Email Verification",
    text: `Please click the following link to verify your email: http://localhost:8000/verify/${verificationToken}`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};
// Register a new user
// ... existing imports and setup ...

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already registered:", email); // Debugging statement
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create a new user
    const newUser = new User({ name, email, password });

    // Generate and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    // Save the user to the database
    await newUser.save();

    // Debugging statement to verify data
    console.log("New User Registered:", newUser);

    // Send verification email to the user
    // Use your preferred email service or library to send the email
    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(201).json({
      message:
        "Registration successful. Please check your email for verification.",
    });
  } catch (error) {
    console.log("Error during registration:", error); // Debugging statement
    res.status(500).json({ message: "Registration failed" });
  }
});

//endpoint to verify the email
app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    //Find the user witht the given verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    //Mark the user as verified
    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Email Verificatioion Failed" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey;
};

const secretKey = generateSecretKey();

//endpoint to login the user!
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //check if the password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    //generate a token
    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login Failed" });
  }
});

//  endpoint to store the user addresses
app.post("/addresses",async(req,res)=>{
  try{
    const {userId,address} = req.body;
    // find the user by userId
    const user = await User.findById({userId});
    if(!user){
      return res.status(404).json({ message: "User not found" });
    }
    // add the new address to user's addresses array
    user.addresses.push(address);

    // save the updated user in ther backed
    await user.save();

    res.status(200).json({ message: "Address created successfully" });

  }catch(error){
    res.status(500).json({ message: "Error adding address" });
  }
})

// endpoint to get addresses of the particular user
app.get("/addresses/:userId",async(res,req)=>{
  try{
    const userId = req.params.userId;
    // find user with given userid
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({ message: "User not found"});
    }

    const addresses = user.addresses;
    res.status(200).json({addresses});
  }catch(error){
    res.status(500).json({ message: "Error retrieving addresses" });
  }
})