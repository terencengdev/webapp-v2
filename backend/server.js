const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const server = express();
const PORT = 3002;
const SECRET_KEY = "dvIoSPO3tKWH5jbHxuPtVYn3etiyLnsx";
const uploadMiddleware = require("./middleware/uploadMiddleware");

const upload = uploadMiddleware("profileimages");

server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

let hostname = "217.21.85.1";
let database = "tere4902_webapp";
let username = "tere4902_admin";
let password = "FZ8&#_]7KWf@";

// hostname = "localhost";
// database = "webapp-v1";
// username = "root";
// password = "";

const db = mysql.createPool({
  connectionLimit: 100,
  hostname: hostname,
  database: database,
  user: username,
  password: password,
  port: 3306,
});

db.getConnection((err, connection) => {
  if (err) {
    console.log("Error connecting to MySQL server.");
    throw err;
  } else {
    console.log("Database connected successfully");
  }

  connection.release();
});

server.use(express.static(path.join(__dirname, "../frontend/dist")));

server.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

server.get("/api/users/:id", (req, res) => {
  const sql = "SELECT * FROM webapp_user_profile";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    } else {
      res.status(200).json(result[0]);
    }
  });
});
server.post("/api/register", async (req, res) => {
  const user_id = req.body.user_id;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const check_reg_sql = "SELECT * FROM webapp_user WHERE user_id = ?";
  const insertSql = "INSERT INTO webapp_user (user_id, password) VALUES (?, ?)";
  db.query(check_reg_sql, [user_id], (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ message: "An error occurred while processing your request." });
      throw err;
    } else {
      if (results.length > 0) {
        res.status(409).json({ message: "User already registered." });
      } else {
        db.query(insertSql, [user_id, hashedPassword], (err, results) => {
          if (err) {
            res.status(500).json({
              message: "An error occurred while processing your request.",
            });
            throw err;
          } else {
            console.log(results);
            createUserProfile(results.insertId);

            const token = jwt.sign({ id: results.user_id }, SECRET_KEY, {
              expiresIn: "1h",
            });

            res.status(200).json({
              message: "Register successful. Logging in... ",
              token: token,
              userdbid: results.insertId,
            });
          }
        });
      }
    }
  });

  const createUserProfile = (id) => {
    const query =
      "INSERT INTO webapp_user_profile (profile_image,salutation,first_name,last_name,email_address,mobile_number,home_address,country,postal_code,nationality,date_of_birth,gender,marital_status,hobbies_and_interests,favourite_sports,preferred_music_genres,preferred_movies_shows,spouse_salutation,spouse_first_name,spouse_last_name,user) VALUES ('', '','','','','','','','','','1900-01-01','','','','','','','','','',?)";
    db.query(query, [id], (err, _results) => {
      if (err) throw err;
    });
  };
});

server.post("/api/login", async (req, res) => {
  const user_id = req.body.user_id;
  const password = req.body.password;

  const searchUserSql = "SELECT * FROM webapp_user WHERE user_id = ?";
  db.query(searchUserSql, [user_id], async (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ message: "An error occurred while processing your request." });
      throw err;
    } else {
      if (results.length == 0) {
        res.status(404).json({ message: "User not found" });
      } else {
        const hashedPassword = results[0].password;
        if (await bcrypt.compare(password, hashedPassword)) {
          const token = jwt.sign({ id: results.user_id }, SECRET_KEY, {
            expiresIn: "1h",
          });
          res.status(200).json({
            message: "Login Successful",
            token: token,
            userdbid: results[0].id,
          });
        } else {
          res.status(401).json({
            message: "Your user ID and/or password does not match.",
          });
        }
      }
    }
  });
});

server.put(
  "/api/edit-user/:id",
  upload.single("profile_image"),
  async (req, res) => {
    const {
      salutation,
      first_name,
      last_name,
      email_address,
      mobile_number,
      home_address,
      country,
      postal_code,
      nationality,
      date_of_birth,
      gender,
      marital_status,
      hobbies_and_interests,
      favourite_sports,
      preferred_music_genres,
      preferred_movies_shows,
      spouse_salutation,
      spouse_first_name,
      spouse_last_name,
    } = req.body;

    const userId = req.params.id;
    const profile_image = req.file ? req.file.path : "";

    const query = profile_image
      ? "UPDATE webapp_user_profile SET profile_image = ?, salutation = ?, first_name = ? , last_name = ?, email_address = ?, mobile_number = ?, home_address = ? , country = ? , postal_code = ? , nationality = ?, date_of_birth = ? , gender = ? , marital_status = ? ,hobbies_and_interests = ? , favourite_sports = ?, preferred_music_genres = ? , preferred_movies_shows = ? ,spouse_salutation=? , spouse_first_name=? , spouse_last_name=? WHERE user = ?"
      : "UPDATE webapp_user_profile SET salutation = ?, first_name = ? , last_name = ?, email_address = ?, mobile_number = ?, home_address = ? , country = ? , postal_code = ? , nationality = ?, date_of_birth = ? , gender = ? , marital_status = ? ,hobbies_and_interests = ? , favourite_sports = ?, preferred_music_genres = ? , preferred_movies_shows = ? ,spouse_salutation=? , spouse_first_name=? , spouse_last_name=? WHERE user = ?";

    db.query(
      query,
      profile_image
        ? [
            profile_image,
            salutation,
            first_name,
            last_name,
            email_address,
            mobile_number,
            home_address,
            country,
            postal_code,
            nationality,
            date_of_birth,
            gender,
            marital_status,
            hobbies_and_interests,
            favourite_sports,
            preferred_music_genres,
            preferred_movies_shows,
            spouse_salutation,
            spouse_first_name,
            spouse_last_name,
            userId,
          ]
        : [
            salutation,
            first_name,
            last_name,
            email_address,
            mobile_number,
            home_address,
            country,
            postal_code,
            nationality,
            date_of_birth,
            gender,
            marital_status,
            hobbies_and_interests,
            favourite_sports,
            preferred_music_genres,
            preferred_movies_shows,
            spouse_salutation,
            spouse_first_name,
            spouse_last_name,
            userId,
          ],
      (err, _results) => {
        if (err) throw err;
        res.json({ message: "You have updated your profile information." });
      }
    );
  }
);

server.listen(PORT, (error) => {
  if (error) {
    console.log("server is not running");
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
