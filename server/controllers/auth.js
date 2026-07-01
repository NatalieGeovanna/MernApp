import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { randomBytes } from "node:crypto";
import { sendVerificationEmail } from "../utils/email.js";

/**registrar */

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      friends,
      location,
      occupation,
      rol,
    } = req.body;

    console.log(req.files);

    const picturePath = req.files?.picture?.[0]?.path || "";
    const cvPath = req.files?.document?.[0]?.path || "";

    const verificationToken = randomBytes(32).toString("hex");

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      cvPath,
      friends,
      location,
      occupation,
      rol,

      viewedProfile: Math.floor(Math.random() * 10),
      impressions: Math.floor(Math.random() * 10),

      verified: process.env.EMAIL_VERIFICATION === "false",
      verificationToken:
        process.env.EMAIL_VERIFICATION === "true"
          ? verificationToken
          : undefined,
      verificationExpires:
        process.env.EMAIL_VERIFICATION === "true"
          ? Date.now() + 1000 * 60 * 60 * 24
          : undefined,
    });

    const savedUser = await newUser.save();

    if (process.env.EMAIL_VERIFICATION === "true") {
      await sendVerificationEmail(
        savedUser.email,
        savedUser.firstName,
        verificationToken,
      );
    }

    res.status(201).json({
      success: true,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    // 1. Verificar si existe
    if (!user) {
      return res.status(400).json({
        msg: "El usuario no existe.",
      });
    }

    // 2. Verificar si confirmó el correo
    if (process.env.EMAIL_VERIFICATION === "true" && !user.verified) {
      return res.status(403).json({
        msg: "Debes verificar tu correo antes de iniciar sesión.",
      });
    }

    // 3. Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        msg: "Contraseña incorrecta.",
      });
    }

    // 4. Crear el token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/verification-error`);
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;

    await user.save();

    return res.redirect(`${process.env.CLIENT_URL}/verified`);
  } catch (err) {
    return res.redirect(`${process.env.CLIENT_URL}/verification-error`);
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        msg: "Usuario no encontrado.",
      });
    }

    if (user.verified) {
      return res.status(400).json({
        msg: "Esta cuenta ya está verificada.",
      });
    }

    const verificationToken = randomBytes(32).toString("hex");

    user.verificationToken = verificationToken;
    user.verificationExpires = Date.now() + 1000 * 60 * 60 * 24;

    await user.save();

    await sendVerificationEmail(user.email, user.firstName, verificationToken);

    res.status(200).json({
      msg: "Correo reenviado correctamente.",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
