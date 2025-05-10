const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/run", (req, res) => {
  const code = req.body.code;

  fs.writeFileSync("Main.java", code); // Guardamos el cÃ³digo en un archivo

  exec("javac Main.java && java Main", (error, stdout, stderr) => {
    if (error) {
      res.json({ output: stderr });
    } else {
      res.json({ output: stdout });
    }
  });
});

app.listen(5000, () => console.log("Servidor Java escuchando en el puerto 5000"));