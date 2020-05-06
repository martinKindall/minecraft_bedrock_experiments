import Utils from "../utils/Utils";

const clientSystem = client.registerSystem(0, 0);

// Setup which events to listen for
clientSystem.initialize = function () {
    this.listenForEvent("minecraft:ui_event", (eventData) => this.onUIMessage(eventData));
};

// per-tick updates
clientSystem.update = function () {
	// Any logic that needs to happen every tick on the client.
};


clientSystem.onUIMessage = function(eventData) {
    Utils.broadcastOnChat(this, `ui event: ${JSON.stringify(eventData)}`);
};
