
function broadcastOnChat(manager, message) {
    let chatEventData = manager.createEventData("minecraft:display_chat_event");
    chatEventData.data.message = message;

    manager.broadcastEvent("minecraft:display_chat_event", chatEventData);
}

export default {
    broadcastOnChat: broadcastOnChat
}
