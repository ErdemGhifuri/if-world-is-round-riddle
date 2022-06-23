import { Request, Response } from "express";
import Joi from "joi";

// declare types for helping
interface RequestBody {
  handler: { name: string };
  intent: any;
  scene: any;
  session: any;
  user: any;
  home: any;
  device: any;
}

export class WebhookRequestHandler {
  static async webhookRequest(req: Request, res: Response) {
    try {
      // validate user input according to https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook schema
      const bodySchema = Joi.object({
        handler: Joi.object({ name: Joi.string().valid("getQuestion").required() }).required(),
        intent: Joi.object().required(),
        scene: Joi.object().required(),
        session: Joi.object().required(),
        user: Joi.object().required(),
        home: Joi.object().required(),
        device: Joi.object().required(),
      });
      // validate the schema
      const validateSchema = bodySchema.validate(req.body);
      // handle if any mismatch between the request body and the designated schema
      if (!validateSchema.error) {
        const webhookRequestHandler = new WebhookRequestHandler();
        const data = await webhookRequestHandler.getFulfillmentMessages(req.body);
        return res.json({ ...data });
      } else res.sendStatus(400);
    } catch (error) {
      console.log("error in webhookRequest:", error);
      return res.sendStatus(500);
    }
  }

  private async getFulfillmentMessages(requestBody: RequestBody) {
    // get the questions
    const question = this.getQuestion();
    // get answer
    const answer = this.getAnswer(question.firstNumber, question.secondNumber);
    // send the questions and answer
    return {
      session: {
        ...requestBody.session,
        params: { ...question, ...answer },
      },
    };
  }

  /**
   * This is a handler for getting the question
   * @returns -> Response JSON for google actions
   */
  private getQuestion() {
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
  private getAnswer(firstNumber: number, secondNumber: number) {
    // check the  answer
    const answer: number[] = [firstNumber, secondNumber];
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
