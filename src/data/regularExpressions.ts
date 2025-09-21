export const RegularExpressions: { [key: string]: RegExp } = {
  CommandExecuting: new RegExp(/Executing console system command '([^']+)'/),
  VendingMachineName: new RegExp(
    /\[VENDING MACHINE\] Player \[ ([^\]]+) \] changed name from \[ ([^\]]+) \] to \[ ([^\]]+) \]/
  ),
  QuickChat: new RegExp(/(\[CHAT (TEAM|SERVER|LOCAL)\]) ([\w\s\-_]+) : (.+)/),
  CustomZoneCreated: new RegExp(/Successfully created zone \[([\w\d\s_-]+)\]/),
  CustomZoneRemoved: new RegExp(/Successfully removed zone \[([\w\d\s_-]+)\]/),
  PlayerRoleAdd: new RegExp(
    /\[([\w\s-]+)] Added \[([\w\s-]+)] to Group \[([\w\s-]+)]/
  ),
  PlayerRoleRemove: new RegExp(
    /\[([\w\s-]+)] Removed \[([\w\s-]+)] from Group \[([\w\s-]+)]/
  ),
  PlayerBanned: new RegExp(/\[([\w\s-]+)\] Added \[([\w\s-]+)\] to \[Banned\]/),
  PlayerUnbanned: new RegExp(
    /\[([\w\s-]+)\] Removed \[([\w\s-]+)\] from \[Banned\]/
  ),
  ItemSpawn: new RegExp(
    /\bgiving ([\w\s._-]+) ([\d.]+) x ([\w\s._-]+(?: [\w\s._-]+)*)\b/
  ),
  NoteEdit: new RegExp(
    /\[NOTE PANEL\] Player \[ ([^\]]+) \] changed name from \[\s*([\s\S]*?)\s*\] to \[\s*([\s\S]*?)\s*\]/
  ),
  TeamCreate: new RegExp(/\[([^\]]+)\] created a new team, ID: (\d+)/),
  TeamJoin: new RegExp(
    /\[([^\]]+)\] has joined \[([^\]]+)]s team, ID: \[(\d+)\]/
  ),
  TeamLeave: new RegExp(
    /\[([^\]]+)\] has left \[([^\]]+)]s team, ID: \[(\d+)\]/
  ),
  TeamInvite: new RegExp(
    /\[([\w\s]+)] has invited \[([\w-]+)] to their team ID: \[(\d+)]/
  ),
  TeamInviteCancel: new RegExp(
    /\[([\w\s-]+)] canceled the invitation for \[([\w\s-]+)] to their team, ID: \[(\d+)]/
  ),
  TeamPromoted: new RegExp(
    /\[([\w\s-]+)] promoted \[([\w\s-]+)] as their new leader of the team, ID: \[(\d+)]/
  ),
  KitSpawn: new RegExp(/SERVER giving (.+?) kit (\w+)/),
  KitGive: new RegExp(
    /\[ServerVar\] ([\w\s_-]+) giving ([\w\s_-]+) kit ([\w\s_-]+)/
  ),
  ServerSaving: new RegExp(/^\[ SAVE \] Saved (\d+) ents$/),
  // Team Info patterns
  TeamInfoNoTeams: new RegExp(/No teams found/),
  TeamInfoTeamHeader: new RegExp(/Team (\d+) member list:/),
  TeamInfoPlayer: new RegExp(/^(.+?)\s+\[(\d+)\](?:\s+\(LEADER\))?$/),
};
