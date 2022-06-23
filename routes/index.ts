import express, { Router, Request, Response } from "express";
import { AuthLayer } from "../helpers/AuthLayer";
import { WebhookRequestHandler } from "../handler/WebhookRequestHandler";

const route: Router = express.Router();

// === CHECK CONNECTION
route.get("/", (req: Request, res: Response) => res.sendStatus(200));

// == HANDLER
route.post("/webhook-request/get-random-number", AuthLayer, WebhookRequestHandler.webhookRequestGetRandomNumber);
route.post("/webhook-request/answer-the-question", AuthLayer, WebhookRequestHandler.webhookRequestAnswerQuestion);

// === MISC
route.get("*", (req: Request, res: Response) => res.sendStatus(404));
route.post("*", (req: Request, res: Response) => res.sendStatus(404));

export default route;