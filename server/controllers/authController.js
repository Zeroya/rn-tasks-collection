import Users from "../models/userModal.js";
import bcrypt from "bcryptjs";

const authRegister = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const isUsed = await Users.findOne({ userName: req.body.userName });

    if (isUsed) {
      return res.status(300).json({ msg: "This account already exist." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new Users({ userName, password: hashedPassword });
    await user.save();

    return res.status(201).json({ msg: "New user registered." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const authLogin = async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(400).json({ msg: "Not all fields have been entered." });
    }
    const user = await Users.findOne({ userName: req.body.userName });
    if (!user) {
      return res.status(400).json({ msg: "No account with this userName has been registered." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password." });
    }

    return res.status(201).json({ msg: "User logged in." });
    // res.json({
    //   user: {
    //     userId: user._id,
    //     userName: user.userName,
    //   },
    // });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllRegisteredUsers = async (req, res) => {
  try {
    const users = await Users.find({}, { userName: 1, _id: 0 });
    const userNames = users.map((user) => user.userName);
    res.send(userNames);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export { authLogin, authRegister, getAllRegisteredUsers };
