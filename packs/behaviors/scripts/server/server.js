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

    this.createLlama();
};

serverSystem.commandCallback = function(commandData) {
    Utils.broadcastOnChat(this, `command executed: ${JSON.stringify(commandData)}`);
};

serverSystem.createLlama = function () {
    let llama = this.createEntity("entity", "minecraft:llama");
    let posComponent = this.createComponent(llama, "minecraft:position");
    posComponent.data.x = -6.5;
    posComponent.data.y = 5;
    posComponent.data.z = 0.5;
    this.applyComponentChanges(llama, posComponent);
};
