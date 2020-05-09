import Utils from "../utils/Utils";

const serverSystem = server.registerSystem(0, 0);

const globals = {
    queryAllEntities: null,
    toggleDayNightState: false
};

// Setup which events to listen for
serverSystem.initialize = function () {
    this.listenForEvent("my_events:start_game", eventData => this.onStartGame(eventData));
    this.listenForEvent("minecraft:block_interacted_with", eventData => this.onBlockInteraction(eventData));

    globals.queryAllEntities = this.registerQuery();

    const scriptLoggerConfig = this.createEventData("minecraft:script_logger_config");
    scriptLoggerConfig.data.log_errors = true;
    scriptLoggerConfig.data.log_information = true;
    scriptLoggerConfig.data.log_warnings = true;
    this.broadcastEvent("minecraft:script_logger_config", scriptLoggerConfig);

    this.registerEventData("guitutorial:player_set_name_skelly", {playerData: null});
};

// per-tick updates
serverSystem.update = function () {
	// Any logic that needs to happen every tick on the server.
};

serverSystem.onStartGame = function(eventData) {
    this.executeCommand("/tp @a 0 6 -10 0 0", (commandData) => this.commandCallback(commandData) );
    this.cleanWorld();
    this.createEntities();
};

serverSystem.onBlockInteraction = function(eventData) {
    Utils.broadcastOnChat(this, `interaction: ${JSON.stringify(eventData)}`);
    const player = eventData.data.player;
    const blockPosition = eventData.data.block_position;
    if (blockPosition.x === 0 && blockPosition.y === 5 && blockPosition.z === 0) {
        this.dayNightLeverInteraction();
    } else if (blockPosition.x === 4 && blockPosition.y === 4 && blockPosition.z === -2) {
        this.setSkellyNameInteraction(player);
    }
};

let hasBeenNamed = false;
serverSystem.setSkellyNameInteraction = function(player) {
    if (!hasBeenNamed) {
        hasBeenNamed = true;
        let setSkellyNameEvent = this.createEventData("guitutorial:player_set_name_skelly");
        setSkellyNameEvent.data.playerData = player;
        this.broadcastEvent("guitutorial:player_set_name_skelly", setSkellyNameEvent);
    }
};

serverSystem.dayNightLeverInteraction = function() {
    this.executeCommand(
        `/time set ${toggleDayNight()}`,
        (commandData) => this.commandCallback(commandData)
    );
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

serverSystem.createEntitySetPositionRotation = function(indentifier, position, rotation) {
    let myEntity = this.createEntity("entity", indentifier);
    let posComponent = this.createComponent(myEntity, "minecraft:position");
    posComponent.data.x = position.x;
    posComponent.data.y = position.y;
    posComponent.data.z = position.z;
    this.applyComponentChanges(myEntity, posComponent);

    let rotComponent = this.createComponent(myEntity, "minecraft:rotation");
    rotComponent.data.x = rotation.x;
    rotComponent.data.y = rotation.y;
    this.applyComponentChanges(myEntity, rotComponent);

    this.createAndExecute3x3FillCommand(myEntity, "warped_nylium");
};

serverSystem.createEntities = function () {
    this.createEntitySetPositionRotation(
        "minecraft:llama",
        {
            x: -4.5,
            y: 5,
            z: 0.5
        },
        {
            x: 0,
            y: 180
        }
    );
    this.createEntitySetPositionRotation(
        "minecraft:skeleton",
        {
            x: 4.5,
            y: 5,
            z: 0.0
        },
        {
            x: 0,
            y: 180
        }
    );
    this.createEntitySetPositionRotation(
        "minecraft:zombie",
        {
            x: 4.5,
            y: 5,
            z: 45.0
        },
        {
            x: 0,
            y: 180
        }
    );
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

function toggleDayNight() {
    const time = globals.toggleDayNightState? "day": "night";
    globals.toggleDayNightState = !globals.toggleDayNightState;
    return time;
}
