import express, { Express } from "express";
import cors from "cors";
import route from "./routes";

// =================================================================================================
//                                      SERVER CONFIGURATION
// =================================================================================================

// INITIATE THE SERVER
const app: Express = express();

// SERVER ACCEPT JSON FORMAT
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

app.use(
  cors({
    origin: ["cloud.google.com"],
  })
);

// =================================================================================================
//                                        SERVER ROUTING
// =================================================================================================

// CONNECT THE ROUTING TO THE SERVER
app.use(route);

// =================================================================================================
//                                      RUNNING THE SERVER
// =================================================================================================
app.listen(process.env.PORT || 2828, () => {
  console.log(`Server running on 'http://localhost:${process.env.PORT || 2828}' !`);
});
