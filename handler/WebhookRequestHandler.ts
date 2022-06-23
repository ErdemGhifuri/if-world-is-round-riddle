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
        handler: Joi.object({ name: Joi.string().valid("throwQuestion", "getAnswer").required() }).required(),
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
        console.log(data);
        return res.json({ ...data });
      } else res.sendStatus(400);
    } catch (error) {
      console.log("error in webhookRequest:", error);
      return res.sendStatus(500);
    }
  }

  private async getFulfillmentMessages(requestBody: RequestBody) {
    switch (requestBody.handler.name) {
      case "throwQuestion":
        return this.throwQuestion(requestBody);
      case "getAnswer":
        return this.getAnswer(requestBody);
      default:
        return {};
    }
  }

  private throwQuestion(requestBody: RequestBody) {
    const firstNumber = Math.round(Math.random() * 10);
    const secondNumber = Math.round(Math.random() * 10);

    const { session } = requestBody;
    return {
      session: {
        ...session,
        params: {
          firstNumber,
          secondNumber,
        },
      },
      prompt: {
        override: false,
        firstSimple: {
          speech: "Hello World.",
          text: "",
        },
      },
      scene: {
        name: "TellRiddle",
        next: {
          name: "actions.scene.END_CONVERSATION",
        },
      },
    };
  }

  private getAnswer(requestBody: RequestBody) {
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
