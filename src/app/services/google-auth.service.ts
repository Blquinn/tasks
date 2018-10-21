import {Injectable} from '@angular/core';

import {parse} from 'url';
import {remote} from 'electron';
import axios from 'axios';
import qs from 'qs';
import {OAuth2Client} from 'google-auth-library';

const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token';
const GOOGLE_PROFILE_URL = 'https://www.googleapis.com/userinfo/v2/me';
const GOOGLE_CLIENT_ID = '942814386422-453sqea4gnbqidoc2r0g0jsc9bnsd1gs.apps.googleusercontent.com';
const GOOGLE_BUNDLE_ID = 'org.github.blquinn';
const GOOGLE_REDIRECT_URI = `com.googleusercontent.apps.942814386422-453sqea4gnbqidoc2r0g0jsc9bnsd1gs:/oauth2callback`;

const KEYTAR_SERVICE = 'tasks-electron';
const CREDENTIALS_KEY = 'credentials';

export interface Credentials {
  refresh_token: string;
  expires_in: number;
  expiry_date?: number | null;
  access_token: string;
  token_type: string;
  id_token: string;
  scope: string;
}

export interface GoogleUser {
  id: string;
  email: string;
  displayName: string;
  credentials: Credentials;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  constructor() { }

  signInWithPopup () {
    return new Promise((resolve, reject) => {
      const authWindow = new remote.BrowserWindow({
        width: 500,
        height: 600,
        show: true,
      });

      function handleNavigation (url) {
        const query = parse(url, true).query;
        if (query) {
          if (query.error) {
            reject(new Error(`There was an error: ${query.error}`));
          } else if (query.code) {
            // Login is complete
            authWindow.removeAllListeners('closed');
            setImmediate(() => authWindow.close());

            // This is the authorization code we need to request tokens
            resolve(query.code);
          }
        }
      }

      // TODO: Generate and validate PKCE code_challenge value
      const urlParams = {
        response_type: 'code',
        redirect_uri: GOOGLE_REDIRECT_URI,
        client_id: GOOGLE_CLIENT_ID,
        scope: 'profile email',
      };
      const authUrl = `${GOOGLE_AUTHORIZATION_URL}?${qs.stringify(urlParams)}`;

      authWindow.on('closed', () => {
        // TODO: Handle this smoothly
        throw new Error('Auth window was closed by user');
      });

      authWindow.webContents.on('will-navigate', (event, url) => {
        handleNavigation(url);
      });

      authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
        handleNavigation(newUrl);
      });

      authWindow.loadURL(authUrl);
    });
  }

  async fetchAccessTokens(code): Promise<Credentials> {
    const response = await axios.post(GOOGLE_TOKEN_URL, qs.stringify({
      code,
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  }

  async fetchGoogleProfile (accessToken) {
    const response = await axios.get(GOOGLE_PROFILE_URL, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  async googleSignIn(): Promise<GoogleUser> {
    const code = await this.signInWithPopup();
    const tokens = await this.fetchAccessTokens(code);
    const {id, email, name} = await this.fetchGoogleProfile(tokens.access_token);
    const d = {
      id,
      email,
      displayName: name,
      credentials: tokens,
    };
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(d));
    return d;
  }

  async getCredentials(): Promise<GoogleUser> {
    const creds = localStorage.getItem(CREDENTIALS_KEY);
    if (creds !== null) {
      return JSON.parse(creds);
    }
    return await this.googleSignIn();
  }

  async getOAuthClient(): Promise<OAuth2Client> {
    const creds = await this.getCredentials();
    const client = new OAuth2Client();
    client.setCredentials(creds.credentials);
    return client;
  }

}
