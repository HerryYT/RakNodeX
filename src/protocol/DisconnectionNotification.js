const Packet = require("./Packet");
const MessageIdentifiers = require("../protocol/MessageIdentifiers");

class DisconnectionNotification extends Packet {
    static getId() {
        return MessageIdentifiers.ID_DISCONNECTION_NOTIFICATION;
    }
}

module.exports = DisconnectionNotification;