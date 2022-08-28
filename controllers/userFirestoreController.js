const nodemailer = require("nodemailer");
const SMTP_CONFIG = require("../config/smtp");
const admin = require("firebase-admin");
const credentials = require("../config/serviceAccountKey.json");
const bucketAdress = "form-multistep.appspot.com";

admin.initializeApp({
  credential: admin.credential.cert(credentials),
  storageBucket: bucketAdress,
});

const db = admin.firestore();

const userFirestoreController = {
  registerUser: async (req, res) => {
    const id = req.body.docNumber;
    const user = req.body;
    const { email, name, score, question1, question2, question3 } = req.body;

    const transporter = nodemailer.createTransport({
      host: SMTP_CONFIG.host,
      port: SMTP_CONFIG.port,
      secure: false,
      auth: {
        user: SMTP_CONFIG.user,
        pass: SMTP_CONFIG.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailSent = await transporter.sendMail({
      subject: "Resultado do seu Quiz",
      from: "noreply@xpquiz.com",
      to: email,
      html: `
      <html>
      <body>
      <strong>${name}</strong> você acertou: [x] perguntas, somando <strong>${score} ponto(s)</strong>. 
      </br>
      Abaixo suas respostas e as respostas corretas: 
<hr/>

Pergunta: <strong>${question1.question}</strong></br>
Sua resposta: <strong>${question1.userAnswer}</strong></br>
Resposta correta: <strong>${question1.correctAnswer}</strong>
<hr/>
Pergunta:<strong> ${question2.question}</strong></br>
Sua resposta:<strong> ${question2.userAnswer}</strong></br>
Resposta correta:<strong> ${question2.correctAnswer}</strong>
<hr/>
Pergunta: <strong> ${question3.question}</strong></br>
Sua resposta: <strong>${question3.userAnswer}</strong> </br>
Resposta correta:<strong> ${question3.correctAnswer}</strong>
<hr/>
      </body>
      </html>
      `,
    });

    console.log(mailSent);
    await db
      .collection("usersQuiz")
      .doc("" + id)
      .set(user);

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
    });
  },

  checkDoc: async (req, res) => {
    const { id } = req.params;

    const userRef = db.collection("usersQuiz").doc(id);
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
