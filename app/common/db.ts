import { DynamoDB } from 'aws-sdk';

export const dynamoDbInstance = new DynamoDB.DocumentClient({region: process.env.AWS_DEFAULT_REGION})