import {Injectable} from '@angular/core';

import {parse} from 'url';
import {remote} from 'electron';
import axios from 'axios';
import qs from 'qs';

const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token';
const GOOGLE_PROFILE_URL = 'https://www.googleapis.com/userinfo/v2/me';
const GOOGLE_CLIENT_ID = '942814386422-453sqea4gnbqidoc2r0g0jsc9bnsd1gs.apps.googleusercontent.com';
const GOOGLE_BUNDLE_ID = 'org.github.blquinn';
const GOOGLE_REDIRECT_URI = `com.googleusercontent.apps.942814386422-453sqea4gnbqidoc2r0g0jsc9bnsd1gs:/oauth2callback`;
const GOOGLE_AUTH_SCOPE = 'email profile https://www.googleapis.com/auth/tasks';

const CREDENTIALS_KEY = 'credentials';

export interface Credentials {
  refresh_token: string;
  expires_in: number;
  expiry_date?: Date | null;
  access_token: string;
  token_type: string;
  id_token: string;
  scope: string;
}

export interface RefreshResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
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

  static getCredentialsLocal(): Credentials {
    const j = localStorage.getItem(CREDENTIALS_KEY);
    if (j === undefined) {
      return null;
    }
    return JSON.parse(j);
  }

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
        // scope: 'profile email',
        scope: GOOGLE_AUTH_SCOPE,
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

  async googleSignIn(): Promise<Credentials> {
    const code = await this.signInWithPopup();
    const tokens = await this.fetchAccessTokens(code);
    const d = new Date();
    d.setSeconds(d.getSeconds() + tokens.expires_in - 60);
    tokens.expiry_date = d;
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(tokens));
    return tokens;
  }

  async performRefresh(currentCreds: Credentials): Promise<Credentials> {
    const response = await axios.post(GOOGLE_TOKEN_URL, qs.stringify({
      client_id: GOOGLE_CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: currentCreds.refresh_token,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (response.status !== 200) {
      throw new Error('Failed to refresh token');
    }
    return response.data;
  }

  async refreshToken(): Promise<Credentials> {
    const creds = localStorage.getItem(CREDENTIALS_KEY);
    if (creds === null || creds === undefined) {
      console.log('signing in with google');
      return this.googleSignIn();
    }
    console.log('retrieved credentials from localstorage');
    const currentCreds: Credentials = JSON.parse(creds);
    let newCreds: RefreshResponse;
    try {
      newCreds = await this.performRefresh(currentCreds);
    } catch (err) {
      localStorage.removeItem(CREDENTIALS_KEY);
      return this.googleSignIn();
      // TODO: Handle this properly
    }

    Object.assign(currentCreds, newCreds);
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(currentCreds));
    return currentCreds;
  }

  async getCredentials(): Promise<Credentials> {
    const creds = localStorage.getItem(CREDENTIALS_KEY);
    if (creds === null || creds === undefined) {
      console.log('signing in with google');
      return this.googleSignIn();
    }
    console.log('retrieved credentials from localstorage');
    return new Promise<Credentials>(resolve => resolve(JSON.parse(creds)));
  }

}
