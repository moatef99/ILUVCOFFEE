import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthConfig } from '../auth.config';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  public pems;
  axios = require('axios');
  jwkToPem = require('jwk-to-pem');
  jwt = require('jsonwebtoken');

  constructor(
    private readonly reflector: Reflector,
    private readonly authConfig: AuthConfig
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest<Request>();
    const authenticationHeader = request.header('Authentication');
    //verify amazon cognito authentication header
    return this.verifyAccessCode(authenticationHeader)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  async verifyAccessCode(accessToken: string): Promise<boolean> {
    if (!this.pems) {
      //Download the JWKs and save it as PEM

      const response = await this.axios.get(
        this.authConfig.authority + '/.well-known/jwks.json'
      );
      // handle success
      var keys = response.data.keys;
      this.pems = {};

      for (var i = 0; i < keys.length; i++) {
        //Convert each key to PEM
        var key_id = keys[i].kid;
        var modulus = keys[i].n;
        var exponent = keys[i].e;
        var key_type = keys[i].kty;
        var jwk = { kty: key_type, n: modulus, e: exponent };
        var pem = this.jwkToPem(jwk);
        this.pems[key_id] = pem;
      }
      //Now continue with validating the token
      return this.ValidateToken(accessToken);
    } else {
      //PEMs are already downloaded, continue with validating the token
      return this.ValidateToken(accessToken);
    }
  }

  ValidateToken(accessToken): boolean {
    //Fail if the token is not jwt
    var decodedJwt = this.jwt.decode(accessToken, { complete: true });
    if (!decodedJwt) {
      console.log('Not a valid JWT token');
      return false;
    }

    //Fail if token is not from your User Pool
    if (decodedJwt.payload.iss != this.authConfig.authority) {
      console.log('invalid issuer');
      return false;
    }

    //Reject the jwt if it's not an 'Access Token'
    if (decodedJwt.payload.token_use != 'access') {
      console.log('Not an access token');
      return false;
    }

    //Get the kid from the token and retrieve corresponding PEM
    var kid = decodedJwt.header.kid;
    var pem = this.pems[kid];
    if (!pem) {
      console.log('Invalid access token');
      return false;
    }

    //Verify the signature of the JWT token to ensure it's really coming from your User Pool
    return this.jwt.verify(
      accessToken,
      pem,
      { issuer: this.authConfig.authority },
      function (err, payload) {
        if (err) {
          console.log('Access code isnot valid');
          return false;
        } else {
          console.log('Access code is valid');
          return true;
        }
      }
    );
  }
}
