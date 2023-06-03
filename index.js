import bodyParser from "body-parser";

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";

//data importts

/**CONFIGURATION */

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

/**User Error */
app.use((_req, _res, next) => {
  const error = new Error("Resource Not Found");
  error.status = 404;
  next(error);
});

/**SERVER ERROR */
app.use((err, _req, res, next) => {
  if (err) {
    return res.status(err.status).json({ message: err.message });
  }
  res.status(500).json({
    message: "Something went wrong",
  });
});

/**Routes */
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);

/** MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SERVER is running on http://localhost:${PORT}`);
      /**Only Add data one time */
      // User.insertMany(dataUser)
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
