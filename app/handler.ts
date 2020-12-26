import { Handler, Context } from 'aws-lambda';
import { WebhookController } from './controller/webhook.controller';

const webhookController  = new WebhookController();

export const webhookHandler: Handler = (event: any, context: Context) => {
  console.log(event)
  return webhookController.handleMessage(event, context);
};

export const webhookRegister: Handler = (event: any, context: Context) => {
  console.log(event)
  return webhookController.registerAPI(event, context);
};
