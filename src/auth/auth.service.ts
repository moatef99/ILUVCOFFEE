import { AuthConfig } from '../common/auth.config';
import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool
} from 'amazon-cognito-identity-js';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  constructor(private readonly authConfig: AuthConfig) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId
    });
  }

  authenticateUser(user: { name: string; password: string }) {
    const { name, password } = user;

    const authenticationDetails = new AuthenticationDetails({
      Username: name,
      Password: password
    });
    const userData = {
      Username: name,
      Pool: this.userPool
    };

    const newUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result.getAccessToken().getJwtToken());
        },
        onFailure: (err) => {
          console.log(err);
          reject(err);
        },
        newPasswordRequired: function (usersAttributes) {
          console.log('new password required');
          delete usersAttributes.email_verified;
          delete usersAttributes.phone_number_verified;
          console.log('new password required');
          console.log(usersAttributes);
          console.log(this);

          return newUser.completeNewPasswordChallenge(
            '12345679',
            usersAttributes,
            this
          );
        }
      });
    });
  }
}
