import Utils from "../utils/Utils";

const clientSystem = client.registerSystem(0, 0);

// Setup which events to listen for
clientSystem.initialize = function () {
    this.listenForEvent(
        "minecraft:client_entered_world",
        (eventData) => this.onClientEnteredWorld(eventData)
    );
    this.listenForEvent("minecraft:ui_event", (eventData) => this.onUIMessage(eventData));
    this.registerEventData("my_events:start_game", {});
};

// per-tick updates
clientSystem.update = function () {
	// Any logic that needs to happen every tick on the client.
};


clientSystem.onClientEnteredWorld = function(eventData) {
    let loadEventData = this.createEventData("minecraft:load_ui");
    loadEventData.data.path = "hello.html";
    loadEventData.data.options.is_showing_menu = true;
    this.broadcastEvent("minecraft:load_ui", loadEventData);
    Utils.broadcastOnChat(this, "Bienvenid@ a minecraft!");
};

clientSystem.onUIMessage = function(eventData) {
    Utils.broadcastOnChat(this, `ui event: ${JSON.stringify(eventData)}`);

    const unloadEventData = this.createEventData("minecraft:unload_ui");
    unloadEventData.data.path = "hello.html";
    this.broadcastEvent("minecraft:unload_ui", unloadEventData);

    this.sendStartGameEvent();
};

clientSystem.sendStartGameEvent = function() {
    let startEventData = this.createEventData("my_events:start_game");
    this.broadcastEvent("my_events:start_game", startEventData);
};
