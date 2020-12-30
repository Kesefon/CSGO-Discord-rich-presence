const DiscordRPC = require("discord-rpc");
const config = require("./config.json");
module.exports = class Discord {
  constructor(clientId) {
    this.clientId = clientId;
    this.loggedIn = false;
  }

  async login() {
    this.client = new DiscordRPC.Client({ transport: "ipc" });

    this.client.on("ready", () => {
      if(config.richOutput) console.log("Connected to discord");
    });
    var clientId = this.clientId;
    await this.client.login({ clientId });
    this.loggedIn = true;
  }

  async clearActivity(pid){
    if(config.richOutput) console.log("Activity cleared");
    await this.client.clearActivity(pid);
  }

  async setActivity(data) {
    var activity = {
      startTimestamp: this.client.connectTime,
    };
    if (data.activity == "menu") {
      activity.state = "In menu";
      activity.largeImageKey = "menu";
      activity.largeImageText = "Main Menu";
    } else if (data.activity == "playing") {
      activity.state = this.getTeam(data.game.player.team);
      activity.details = this.getGameMode(data.game.map.mode) + " " + this.getCurrentPoints(data.game);
      activity.largeImageKey = data.game.map.name;
      activity.largeImageText = data.game.map.name;
      activity.smallImageKey = data.game.map.mode;
      activity.smallImageText = this.getGameMode(data.game.map.mode);
    }
    await this.client.setActivity(activity, data.pid);
  }

  getGameMode(name) {
    switch (name) {
      case "scrimcomp2v2":
        return "Wingman";
      case "casual":
        return "Casual";
      case "competitive":
        return "Competitive";
      case "deatchmatch":
        return "Deatchmatch";
      case "demolition":
        return "Demolition";
      case "demolitionshield":
        return "Demolition";
    }
  }

  getTeam(team) {
    if (team == "CT") {
      return "Team Counter-Terrorists";
    } else if (team == "T") {
      return "Team Terrorists";
    }
  }

  getCurrentPoints(game){
    return "(CT: " + game.map.team_ct.score + ", T:" + game.map.team_t.score + ")";
  }
};
