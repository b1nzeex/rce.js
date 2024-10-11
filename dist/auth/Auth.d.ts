import type RCEManager from "../Manager";
export default class GPortalAuth {
    private _manager;
    private _authData;
    private _refreshTimeout;
    constructor(manager: RCEManager);
    /**
     *
     * @param username The G-Portal email address
     * @param password The G-Portal password
     *
     * @returns {void}
     * @throws {Error} If the login fails
     */
    login(username: string, password: string): Promise<void>;
    /**
     * Refresh the authentication token
     * @returns {void}
     * @throws {Error} If the refresh fails
     */
    private refresh;
    destroy(): void;
    /**
     * Get the access token
     * @returns {string} The access token
     * @returns {undefined} If the access token is not available
     */
    get accessToken(): string;
}
