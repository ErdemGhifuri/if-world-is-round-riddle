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
                    handler: joi_1.default.object({ name: joi_1.default.string().valid("getQuestion").required() }).required(),
                    intent: joi_1.default.object().required(),
                    scene: joi_1.default.object().required(),
                    session: joi_1.default.object().required(),
                    user: joi_1.default.object().required(),
                    home: joi_1.default.object().required(),
                    device: joi_1.default.object().required(),
                });
                // validate the schema
                const validateSchema = bodySchema.validate(req.body);
                // handle if any mismatch between the request body and the designated schema
                if (!validateSchema.error) {
                    const webhookRequestHandler = new WebhookRequestHandler();
                    const data = yield webhookRequestHandler.getFulfillmentMessages(req.body);
                    return res.json(Object.assign({}, data));
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
            // get the questions
            const question = this.getQuestion();
            // get answer
            const answer = this.getAnswer(question.firstNumber, question.secondNumber);
            // send the questions and answer
            return {
                session: Object.assign(Object.assign({}, requestBody.session), { params: Object.assign(Object.assign({}, question), answer) }),
            };
        });
    }
    /**
     * This is a handler for getting the question
     * @returns -> Response JSON for google actions
     */
    getQuestion() {
        const firstNumber = Math.round(Math.random() * 10);
        const secondNumber = Math.round(Math.random() * 10);
        return { firstNumber, secondNumber };
    }
    /**
     * This is a handler for throw the question
     * @param firstNumber -> first number of the question
     * @param secondNumber -> second number of the question
     * @returns -> Response JSON for google actions
     */
    getAnswer(firstNumber, secondNumber) {
        // check the  answer
        const answer = [firstNumber, secondNumber];
        const roundedWorldAnswerSplit = answer.map((value) => this.answerDictionary(value));
        const roundedWorldAnswer = roundedWorldAnswerSplit.reduce((a, b) => a + b, 0);
        // match the answer
        return { answer: roundedWorldAnswer };
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
