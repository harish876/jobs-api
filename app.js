require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const authenticatedUser=require("./middleware/authentication");
//security-features

const rateLimiter=require("express-rate-limit");
const limiter=rateLimiter({
  windowMs: 15 * 60 * 1000,
  max:100
});

const cors=require("cors");
const helmet=require("helmet");
const xss=require("xss-clean");

//connectDB
const connectDB=require("./db/connect")

//routers
const authRouter=require("./routes/auth")
const jobsRouter=require("./routes/jobs")

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy',1);
app.use(limiter);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
// extra packages

app.get('/',(req,res)=>{
    res.send("App is working");
})
// routes
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',authenticatedUser,jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
