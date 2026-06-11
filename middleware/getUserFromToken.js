import { getUserById } from "../db/queries/users.js";
import { verifyToken } from "../utils/jwt.js";

export default async function getUserFromToken(req, res, next) {
  const authorization = req.get("authorization");
  console.log("AUTH HEADER:", authorization);
  if (!authorization || !authorization.startsWith("Bearer ")) return next();
  const token = authorization.split(" ")[1];
  console.log("TOKEN:", token);
  try {
    const payload = verifyToken(token);
    console.log("PAYLOAD:", payload);
    const user = await getUserById(payload.id);
    console.log("USER:", user);
    req.user = user;
    next();
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(401).send("Invalid token.");
  }
}
