#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';
import * as dotenv from 'dotenv';

var configRes = dotenv.config({
  path: process.env.ENV_PATH || '.env'
});

if (configRes.error) {
  console.error("Couldn't load environment file!");
  throw configRes.error;
}

const app = new cdk.App();
new CdkStack(app, process.env.DEPLOY_ENV + '-demo-app', {
  env: { account: process.env.AWS_ACC_ID, region: process.env.AWS_REGION },

});