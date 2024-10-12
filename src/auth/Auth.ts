import { load } from "cheerio";
import type { GPortalAuthData } from "./interfaces";
import type RCEManager from "../Manager";
import { GPortalRoutes } from "../constants";

export default class GPortalAuth {
  private _manager: RCEManager;
  private _authData: GPortalAuthData;
  private _refreshTimeout: NodeJS.Timeout;

  public constructor(manager: RCEManager) {
    this._manager = manager;
  }

  /**
   *
   * @param username The G-Portal email address
   * @param password The G-Portal password
   *
   * @returns {void}
   * @throws {Error} If the login fails
   */
  public async login(username: string, password: string) {
    this._manager.logger.debug("Logging in to G-Portal");

    try {
      const authUrl = new URL(GPortalRoutes.Auth);
      authUrl.searchParams.append("client_id", "website");
      authUrl.searchParams.append("redirect_uri", GPortalRoutes.Home);
      authUrl.searchParams.append("response_mode", "query");
      authUrl.searchParams.append("response_type", "code");
      authUrl.searchParams.append("scope", "openid email profile gportal");
      const loginResponse = await fetch(authUrl);
      if (!loginResponse.ok) {
        throw new Error("Failed to fetch the login page");
      }

      const loginPage = await loginResponse.text();
      const cookies = loginResponse.headers.get("set-cookie");

      const $ = load(loginPage);
      const url = $("#kc-form-login").attr("action");

      if (!url) {
        throw new Error("Failed to extract the login URL");
      }

      const authResponse = await fetch(url, {
        method: "POST",
        headers: {
          Cookie: cookies,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username,
          password,
          credentialId: "",
        }),
      });

      if (!authResponse.ok) {
        throw new Error("Failed to authenticate");
      }

      const code = new URLSearchParams(new URL(authResponse.url).search).get(
        "code"
      );
      if (!code) {
        throw new Error("Failed to extract the authentication code");
      }

      const tokenResponse = await fetch(GPortalRoutes.Token, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          grant_type: "authorization_code",
          client_id: "website",
          redirect_uri: GPortalRoutes.Home,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to fetch the authentication token");
      }

      this._authData = await tokenResponse.json();

      this._refreshTimeout = setTimeout(
        () => this.refresh(),
        (this._authData.expires_in - 60) * 1_000
      );
    } catch (error) {
      throw new Error(`Failed to login: ${error.message}`);
    }
  }

  /**
   * Refresh the authentication token
   * @returns {void}
   * @throws {Error} If the refresh fails
   */
  private async refresh() {
    if (!this._authData?.refresh_token) {
      throw new Error("Missing refresh token");
    }

    this._manager.logger.debug("Refreshing The Authentication Token");

    try {
      const tokenResponse = await fetch(GPortalRoutes.Token, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          refresh_token: this._authData.refresh_token,
          grant_type: "refresh_token",
          client_id: "website",
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to fetch the authentication token");
      }

      this._authData = await tokenResponse.json();

      this._refreshTimeout = setTimeout(
        () => this.refresh(),
        (this._authData.expires_in - 60) * 1_000
      );

      this._manager.logger.debug("Token Refreshed");
    } catch (error) {
      throw new Error(`Failed to refresh the token: ${error.message}`);
    }
  }

  public destroy() {
    clearTimeout(this._refreshTimeout);
  }

  /**
   * Get the access token
   * @returns {string} The access token
   * @returns {undefined} If the access token is not available
   */
  get accessToken() {
    return this._authData?.access_token;
  }
}
