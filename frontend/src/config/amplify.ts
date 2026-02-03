import { Amplify } from 'aws-amplify';
import config from './env';

const amplifyConfig = {
  aws_project_region: config.cognitoRegion,
  aws_cognito_region: config.cognitoRegion,
  aws_user_pools_id: config.cognitoUserPoolId,
  aws_user_pools_web_client_id: config.cognitoUserPoolClientId,
  oauth: {
    domain: config.cognitoDomain,
    scope: ['email', 'openid', 'profile'],
    redirectSignIn: config.cognitoRedirectSignIn,
    redirectSignOut: config.cognitoRedirectSignOut,
    responseType: 'code'
  }
};

Amplify.configure(amplifyConfig);
