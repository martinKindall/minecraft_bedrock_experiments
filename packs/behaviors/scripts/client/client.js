import Utils from "../utils/Utils";

const clientSystem = client.registerSystem(0, 0);

// Setup which events to listen for
clientSystem.initialize = function () {
    this.listenForEvent(
        "minecraft:client_entered_world",
        (eventData) => this.onClientEnteredWorld(eventData)
    );
    this.listenForEvent("minecraft:ui_event", (eventData) => this.onUIMessage(eventData));
};

// per-tick updates
clientSystem.update = function () {
	// Any logic that needs to happen every tick on the client.
};


clientSystem.onClientEnteredWorld = function(eventData) {
    let loadEventData = this.createEventData("minecraft:load_ui");
    loadEventData.data.path = "hello.html";
    loadEventData.data.options.is_showing_menu = false;
    loadEventData.data.options.absorbs_input = true;
    this.broadcastEvent("minecraft:load_ui", loadEventData);
};

clientSystem.onUIMessage = function(eventData) {
    Utils.broadcastOnChat(this, `ui event: ${JSON.stringify(eventData)}`);
};
