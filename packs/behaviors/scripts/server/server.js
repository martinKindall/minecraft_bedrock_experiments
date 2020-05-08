import Utils from "../utils/Utils";

const serverSystem = server.registerSystem(0, 0);

const globals = {
    queryAllEntities: null
};

// Setup which events to listen for
serverSystem.initialize = function () {
    this.listenForEvent("my_events:start_game", eventData => this.onStartGame(eventData));
    globals.queryAllEntities = this.registerQuery();

    const scriptLoggerConfig = this.createEventData("minecraft:script_logger_config");
    scriptLoggerConfig.data.log_errors = true;
    scriptLoggerConfig.data.log_information = true;
    scriptLoggerConfig.data.log_warnings = true;
    this.broadcastEvent("minecraft:script_logger_config", scriptLoggerConfig);
};

// per-tick updates
serverSystem.update = function () {
	// Any logic that needs to happen every tick on the server.
};

serverSystem.onStartGame = function(eventData) {
    this.executeCommand("/tp @a 0 6 0 90 0", (commandData) => this.commandCallback(commandData) );
    this.cleanWorld();
    this.createMyEntity();
    this.experimentOnEntity();
};

serverSystem.experimentOnEntity = function() {
    // let allEntities = this.getEntitiesFromQuery(globals.queryAllEntities);
    // let size = allEntities.length;
    // for (let index = 0; index < size; ++index) {
    //     const currentEntity = allEntities[index];
    //     if (currentEntity.__identifier__ === "minecraft:llama") {
    //         const tameComponent = this.getComponent(currentEntity, "minecraft:llama_tamed");
    //         Utils.broadcastOnChat(this, `Llama : ${JSON.stringify(tameComponent)}`);
    //     }
    // }
};

serverSystem.commandCallback = function(commandData) {
    // Utils.broadcastOnChat(this, `command executed: ${JSON.stringify(commandData)}`);
};

serverSystem.cleanWorld = function () {
    this.addGameRules();
    this.cleanEntities();
};

serverSystem.cleanEntities = function () {
    let allEntities = this.getEntitiesFromQuery(globals.queryAllEntities);
    let size = allEntities.length;
    for (let index = 0; index < size; ++index) {
        if (allEntities[index].__identifier__ !== "minecraft:player") {
            // Utils.broadcastOnChat(this, `destroying: ${JSON.stringify(allEntities[index])}`);
            this.destroyEntity(allEntities[index]);
        }
    }
};

serverSystem.addGameRules = function() {
    this.executeCommand("/gamerule doMobLoot false", (commandData) => this.commandCallback(commandData) );
    this.executeCommand("/gamerule doMobSpawning false", (commandData) => this.commandCallback(commandData) );
    this.executeCommand("/gamerule doWeatherCycle false", (commandData) => this.commandCallback(commandData) );
    this.executeCommand("/gamerule doDaylightCycle false", (commandData) => this.commandCallback(commandData) );
};

serverSystem.createMyEntity = function () {
    let myEntity = this.createEntity("entity", "minecraft:llama");
    let posComponent = this.createComponent(myEntity, "minecraft:position");
    posComponent.data.x = -4.5;
    posComponent.data.y = 5;
    posComponent.data.z = 0.5;
    this.applyComponentChanges(myEntity, posComponent);

    let rotComponent = this.createComponent(myEntity, "minecraft:rotation");
    rotComponent.data.x = 0;
    rotComponent.data.y = 180;
    this.applyComponentChanges(myEntity, rotComponent);

    this.createAndExecute3x3FillCommand(myEntity, "soul_sand");
};

serverSystem.createAndExecute3x3FillCommand = function (entity, blockName) {
    let posComponent = this.getComponent(entity, "minecraft:position");
    if(posComponent) {
        let fillCommand = "/fill ";
        let lowX = posComponent.data.x - 1;
        let lowZ = posComponent.data.z - 1;
        let highX = posComponent.data.x + 1;
        let highZ = posComponent.data.z + 1;
        fillCommand += lowX + " 3 " + lowZ + " " + highX + " 3 " + highZ + " " + blockName;
        this.executeCommand(fillCommand, (commandData) => this.commandCallback(commandData) );
    }
};
