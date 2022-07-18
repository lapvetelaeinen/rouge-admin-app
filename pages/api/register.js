import bcrypt from "bcrypt";
import Users from "../../models/userModel";

export default async function handler(req, res) {
  const body = req.body;
  const lowCaseEmail = body.email.toLowerCase();
  // update user email in body to lowercase
  body.email = lowCaseEmail;
  const user = await Users.findOne({ email: lowCaseEmail });

  if (user) {
    res.status(200).json({ message: "Already registered" });
    return;
  }

  const newUser = new Users(body);

  const salt = await bcrypt.genSalt(10);

  newUser.password = await bcrypt.hash(newUser.password, salt);

  await newUser.save();
  res.status(200).json({ message: "Registered successfully" });
}
