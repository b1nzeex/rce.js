"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRoleInfo = parseRoleInfo;
/**
 * Parses the role info response and sets each player's `role`.
 * Players not in any role fall back to `null`.
 * @param roleInfoResponse The raw response string
 * @param players List of currently connected players
 * @returns Object containing updated player list
 */
function parseRoleInfo(roleInfoResponse, players = []) {
    const lines = roleInfoResponse.split(/\r?\n/);
    const roleMap = {};
    let currentRole = null;
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed)
            continue;
        if (/^[A-Z][A-Za-z]*$/.test(trimmed)) {
            currentRole = trimmed;
            if (!roleMap[currentRole])
                roleMap[currentRole] = [];
        }
        else if (currentRole) {
            roleMap[currentRole].push(trimmed);
        }
    }
    for (const role in roleMap) {
        roleMap[role] = Array.from(new Set(roleMap[role]));
    }
    players.forEach((player) => {
        player.role = null;
    });
    for (const role in roleMap) {
        for (const ign of roleMap[role]) {
            const player = players.find((p) => p.ign === ign);
            if (player) {
                player.role = role;
            }
        }
    }
    return { players };
}
//# sourceMappingURL=roleInfo.js.map