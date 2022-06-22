"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookRequestHandler = void 0;
const joi_1 = __importDefault(require("joi"));
class WebhookRequestHandler {
    static webhookRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // validate user input according to https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook schema
                const bodySchema = joi_1.default.object({
                    responseId: joi_1.default.string().required(),
                    session: joi_1.default.string().required(),
                    queryResult: joi_1.default.object().required(),
                    originalDetectIntentRequest: joi_1.default.string().required(),
                });
                // validate the schema
                const validateSchema = bodySchema.validate(req.body);
                // handle if any mismatch between the request body and the designated schema
                if (validateSchema.error) {
                    const webhookRequestHandler = new WebhookRequestHandler();
                    const fulfillmentMessages = webhookRequestHandler.getFulfillmentMessages(req.body);
                    return res.json({ fulfillmentMessages });
                }
                else
                    res.sendStatus(400);
            }
            catch (error) {
                console.log("error in webhookRequest:", error);
                return res.sendStatus(500);
            }
        });
    }
    getFulfillmentMessages(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(requestBody);
            const { firstNumber, secondNumber, answer } = { firstNumber: 1, secondNumber: 8, answer: 9 };
            // check the real answer
            const realAnswer = firstNumber + secondNumber;
            const realRoundedWorldAnswerSplit = String(realAnswer)
                .split("")
                .map((value) => this.answerDictionary(parseInt(value)));
            const realRoundedWorldAnswer = realRoundedWorldAnswerSplit.reduce((a, b) => a + b, 0);
            // check user asnwer
            const userRoundedWorldAnswerSplit = String(realAnswer)
                .split("")
                .map((value) => this.answerDictionary(parseInt(value)));
            const userRoundedWorldAnswer = userRoundedWorldAnswerSplit.reduce((a, b) => a + b, 0);
            // match the answer
            if (realRoundedWorldAnswer === userRoundedWorldAnswer) {
                return {};
            }
            else
                return {};
        });
    }
    throwQuestion() {
        const firstNumber = Math.round(Math.random() * 10);
        const secondNumber = Math.round(Math.random() * 10);
    }
    /**
     * This function is used to determine the sum of 'rounded world' in a number
     * @param value -> number (1 digit only)
     * @returns -> A sum of 'rounded world' in a number
     */
    answerDictionary(value) {
        switch (value) {
            case 0:
                return 1;
            case 6:
                return 1;
            case 9:
                return 1;
            case 8:
                return 2;
            default:
                return 0;
        }
    }
}
exports.WebhookRequestHandler = WebhookRequestHandler;
