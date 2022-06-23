"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthLayer_1 = require("../helpers/AuthLayer");
const WebhookRequestHandler_1 = require("../handler/WebhookRequestHandler");
const route = express_1.default.Router();
// === CHECK CONNECTION
route.get("/", (req, res) => res.sendStatus(200));
// == HANDLER
route.post("/webhook-request/get-random-number", AuthLayer_1.AuthLayer, WebhookRequestHandler_1.WebhookRequestHandler.webhookRequestGetRandomNumber);
route.post("/webhook-request/answer-the-question", AuthLayer_1.AuthLayer, WebhookRequestHandler_1.WebhookRequestHandler.webhookRequestAnswerQuestion);
// === MISC
route.get("*", (req, res) => res.sendStatus(404));
route.post("*", (req, res) => res.sendStatus(404));
exports.default = route;
