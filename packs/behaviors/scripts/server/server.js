import Utils from "../utils/Utils";

const serverSystem = server.registerSystem(0, 0);

// Setup which events to listen for
serverSystem.initialize = function () {
    this.listenForEvent("my_events:start_game", eventData => this.onStartGame(eventData));
};

// per-tick updates
serverSystem.update = function () {
	// Any logic that needs to happen every tick on the server.
};

serverSystem.onStartGame = function(eventData) {
    this.executeCommand("/tp @a 0 8 0", (commandData) => this.commandCallback(commandData) );
};

serverSystem.commandCallback = function(commandData) {
    Utils.broadcastOnChat(this, `command executed: ${JSON.stringify(commandData)}`);
};
