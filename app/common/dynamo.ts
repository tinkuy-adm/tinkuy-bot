import { DynamoDB } from 'aws-sdk';

const dynDb = new DynamoDB.DocumentClient({region: process.env.AWS_DEFAULT_REGION})

export default dynDb