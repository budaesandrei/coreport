import defaultConfig from './default.json';

const currentOrigin = window.location.origin;

const config = {
  ...defaultConfig,
  env: import.meta.env.VITE_ENV,
  apiUrl: import.meta.env.VITE_API_URL,
  cognitoRegion: import.meta.env.VITE_COGNITO_REGION,
  cognitoUserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  cognitoUserPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
  cognitoDomain: import.meta.env.VITE_COGNITO_DOMAIN,

  cognitoRedirectSignIn: `${currentOrigin}/oauth2/idpresponse`,
  cognitoRedirectSignOut: `${currentOrigin}/logout`,
};

export default config;