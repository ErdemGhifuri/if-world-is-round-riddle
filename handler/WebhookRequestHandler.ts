import { Request, Response } from "express";
import Joi from "joi";

export class WebhookRequestHandler {
  static async webhookRequestAnswerQuestion(req: Request, res: Response) {
    try {
      // validate user input according to https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook schema
      const bodySchema = Joi.object({
        responseId: Joi.string().required(),
        session: Joi.string().required(),
        queryResult: Joi.object().required(),
        originalDetectIntentRequest: Joi.string().required(),
      });
      // validate the schema
      const validateSchema = bodySchema.validate(req.body);
      // handle if any mismatch between the request body and the designated schema
      if (validateSchema.error) {
        const webhookRequestHandler = new WebhookRequestHandler();
        const fulfillmentMessages = webhookRequestHandler.getFulfillmentMessagesAnswerQuestion(req.body);
        return res.json({ fulfillmentMessages });
      } else res.sendStatus(400);
    } catch (error) {
      console.log("error in webhookRequest:", error);
      return res.sendStatus(500);
    }
  }

  static async webhookRequestGetRandomNumber(req: Request, res: Response) {
    try {
      // validate user input according to https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook schema
      const bodySchema = Joi.object({
        responseId: Joi.string().required(),
        session: Joi.string().required(),
        queryResult: Joi.object().required(),
        originalDetectIntentRequest: Joi.string().required(),
      });
      // validate the schema
      const validateSchema = bodySchema.validate(req.body);
      // handle if any mismatch between the request body and the designated schema
      if (validateSchema.error) {
        const webhookRequestHandler = new WebhookRequestHandler();
        const fulfillmentMessages = webhookRequestHandler.getFulfillmentMessagesGetRandomNumber(req.body);
        return res.json({ fulfillmentMessages });
      } else res.sendStatus(400);
    } catch (error) {
      console.log("error in webhookRequest:", error);
      return res.sendStatus(500);
    }
  }

  private async getFulfillmentMessagesAnswerQuestion(requestBody: {
    responseId: string;
    session: string;
    queryResult: any;
    originalDetectIntentRequest: string;
  }) {
    console.log(requestBody);
    const { firstNumber, secondNumber, answer } = { firstNumber: 1, secondNumber: 8, answer: 9 };
    // check the real answer
    const realAnswer: number = firstNumber + secondNumber;
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
    } else return {};
  }

  private getFulfillmentMessagesGetRandomNumber(requestBody: {
    responseId: string;
    session: string;
    queryResult: any;
    originalDetectIntentRequest: string;
  }) {
    console.log(requestBody);
    const firstNumber = Math.round(Math.random() * 10);
    const secondNumber = Math.round(Math.random() * 10);
    return {};
  }

  /**
   * This function is used to determine the sum of 'rounded world' in a number
   * @param value -> number (1 digit only)
   * @returns -> A sum of 'rounded world' in a number
   */
  private answerDictionary(value: number): number {
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
