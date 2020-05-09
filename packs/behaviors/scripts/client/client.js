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
    this.listenForEvent(
        "guitutorial:player_set_name_skelly",
        (playerData) => this.onSetSkellyName(playerData));

    const scriptLoggerConfig = this.createEventData("minecraft:script_logger_config");
    scriptLoggerConfig.data.log_errors = true;
    scriptLoggerConfig.data.log_information = true;
    scriptLoggerConfig.data.log_warnings = true;
    this.broadcastEvent("minecraft:script_logger_config", scriptLoggerConfig);
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

clientSystem.onSetSkellyName = function(playerData) {
    Utils.broadcastOnChat(this, `skelly player event: ${JSON.stringify(playerData)}`);
    // let loadEventData = this.createEventData("minecraft:load_ui");
    // loadEventData.data.path = "hello.html";
    // loadEventData.data.options.is_showing_menu = true;
    // this.broadcastEvent("minecraft:load_ui", loadEventData);
};

clientSystem.onUIMessage = function(eventData) {
    Utils.broadcastOnChat(this, `ui event: ${JSON.stringify(eventData)}`);
    const uiMessage = JSON.parse(eventData.data);

    if (uiMessage.id === "StartPressed") {
        const unloadEventData = this.createEventData("minecraft:unload_ui");
        unloadEventData.data.path = "hello.html";
        this.broadcastEvent("minecraft:unload_ui", unloadEventData);

        this.sendStartGameEvent();
    } else if (uiMessage.id === "SkellySetName") {
        Utils.broadcastOnChat(this, `it worked: ${uiMessage.name}`);
        const unloadEventData = this.createEventData("minecraft:unload_ui");
        unloadEventData.data.path = "skelly.html";
        this.broadcastEvent("minecraft:unload_ui", unloadEventData);
    }
};

clientSystem.sendStartGameEvent = function() {
    let startEventData = this.createEventData("my_events:start_game");
    this.broadcastEvent("my_events:start_game", startEventData);
};
