'use strict'

import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

export const getSecret = async (secretName: string): Promise<unknown> => {
  const client = new SecretsManagerClient({ region: 'us-east-1' }); // Replace with your AWS region
  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const data = await client.send(command);

    if (data.SecretString) {
      // Parse the secret string as JSON
      return JSON.parse(data.SecretString);
    } else if (data.SecretBinary) {
      // If the secret is binary, convert it to a string (assuming utf-8 encoding) and then parse as JSON
      const buffer = Buffer.from(data.SecretBinary.buffer);
      return JSON.parse(buffer.toString('utf-8'));
    } else {
      throw new Error('Secret not found or has no content.');
    }
  } catch (error) {
    console.error(`Error retrieving secret "${secretName}":`, error);
    throw error;
  }
};