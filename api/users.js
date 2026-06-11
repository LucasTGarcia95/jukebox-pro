import { Router } from "express";
import { createUser, getUserByUsernameAndPassword } from "#db/queries/users";
import { createToken } from "../utils/jwt.js";

const router = Router();

// POST /users/register
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    const user = await createUser(username, password);
    const token = createToken({ id: user.id });
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
});

// POST /users/login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    const user = await getUserByUsernameAndPassword(username, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const token = createToken({ id: user.id });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

export default router;
