import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "dev-secret";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      roleId: user.roleId,
      email: user.email,
    },
    secret,
    { expiresIn: "1d" }
  );
};