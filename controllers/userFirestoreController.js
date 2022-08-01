const JWT = require("jsonwebtoken");
const config = require("../config/auth");
const { validationResult } = require("express-validator");
const { v4 } = require("uuid");
const bcrypt = require("bcrypt");
const admin = require("firebase-admin");

const credentials = require("../config/serviceAccountKey.json");

const bucketAdress = "form-multistep.appspot.com";

admin.initializeApp({
  credential: admin.credential.cert(credentials),
  storageBucket: bucketAdress,
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const userFirestoreController = {
  registerUser: async (req, res) => {
    console.log(req.body, req.file);
    const errors = validationResult(req);
    const { email, password, fullname, cel, birthday, terms } = req.body;
    const avatar = req.file;

    const filename = `${v4()} - ${avatar.originalname}`;

    const file = bucket.file(filename);

    const stream = file.createWriteStream({
      metadata: {
        contentType: avatar.mimetype,
      },
    });

    stream.on("error", (err) => console.log(err));

    stream.on("finish", async () => {
      await file.makePublic();
    });

    stream.end(avatar.buffer);

    const saltRounds = 10;

    const hash = bcrypt.hashSync(password, saltRounds);

    const firebaseUrl = `https://storage.googleapis.com/${bucketAdress}/${filename}`;

    const user = {
      email,
      password: hash,
      fullname,
      cel,
      birthday,
      avatar: firebaseUrl,
      terms,
    };

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors });
    }

    await db.collection("users").doc(email).set(user);

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
    });
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    const userRef = db.collection("users").doc(email);
    const userFound = await userRef.get();
    const user = userFound.data();

    if (!userFound.exists) {
      return res.status(200).json({
        message: "Usuário não encontrado",
      });
    }

    const checkPassword = bcrypt.compareSync(password, user.password);

    if (!checkPassword) {
      return res.status(401).json({
        message: "Usuário ou senha inválido!",
      });
    }

    const token = JWT.sign(
      {
        userId: user.id,
      },
      config.secret,
      {
        expiresIn: config.expireIn,
      }
    );

    return res.status(200).json({
      user,
      auth: true,
      token,
    });
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { fullname, cel, birthday } = req.body;

    const userRef = await db.collection("users").doc(id).update({
      fullname,
      cel,
      birthday,
    });

    return res.status(204).json({
      message: "Atualização bem sucedida",
    });
  },

  delete: async (req, res) => {
    const { id } = req.params;
    const userRef = await db.collection("users").doc(id).delete();

    return res.status(204).json({
      message: "Cadastro deletado",
    });
  },

  checkEmail: async (req, res) => {
    const { id } = req.params;

    const userRef = db.collection("users").doc(id);
    const userFound = await userRef.get();

    if (!userFound.exists) {
      return res.status(200).json({
        message: "Nada para ver aqui",
      });
    } else {
      return res.status(302).json({
        message: "Usuário já existe",
      });
    }
  },
};

module.exports = userFirestoreController;
