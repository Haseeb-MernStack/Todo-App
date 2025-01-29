import express from 'express';
import { login, logout, register } from '../controllers/user.js';

const router = express.Router();
// basic end-points or Rest APi
router.route("/register").post(register); // ye valid hota agr dono method seperate hotai post or get 
router.route("/login").post(login);
router.route("/logout").get(logout);

export default router;