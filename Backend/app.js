const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const path = require('path');
const flash = require("connect-flash");
const expressSession = require("express-session"); 
const helmet = require("helmet"); // Helmet for security
const cors = require('cors');

require('dotenv').config();  //this mean the whatever in .env file that will come in use 

const connectdb = require('./config/mongoose.connection')
const adminRouter = require("./routes/adminRouter");
const doctorRouter = require("./routes/doctorRouter");
const indexRouter = require("./routes/indexRouter");
const patientRouter = require("./routes/patientRouter");

const port = process.env.PORT || 8080;

//Connect to MongoDB
connectdb();


//Middleware
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Your frontend URL
    credentials: true,  // This allows cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/images", express.static(path.join(__dirname, "public", "images"), {
    setHeaders: (res, path, stat) => {
      res.set("Access-Control-Allow-Origin", "*");  // Allow all origins (for debugging)
      res.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS"); 
    }
  }));
  



app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(     //you cant use flash without setuping the express session
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET || "default_secret_key",
    })
);
app.use(flash());  //for using the flash message 
app.use(express.static(path.join(__dirname,"public")));
//app.use('/images/uploads', express.static(path.join(__dirname, 'public', 'images', 'uploads')));
app.set("view engine",'ejs');

// Routes
app.use("/",indexRouter);
app.use("/admin", adminRouter);
app.use("/patient",patientRouter);
app.use("/doctor",doctorRouter)

// Serve images from the uploads directory
//app.use("/uploads", express.static(path.join(__dirname, "../public/images/uploads")));



// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
