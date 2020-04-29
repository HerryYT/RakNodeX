const OfflineMessage = require("./OfflineMessage");
const MessageIdentifiers = require("./MessageIdentifiers");

class UnconnectedPong extends OfflineMessage {
    static getId() {
        return MessageIdentifiers.ID_UNCONNECTED_PONG;
    }

    /** @type {number} */
    sendPingTime;
    /** @type {number} */
    serverId;
    /** @type {string} */
    serverName;

    encodePayload() {
        this.getStream().writeLong(this.pingId);
        this.getStream().writeLong(this.serverId);
        this.writeMagic();
        this.writeString(this.serverName);
    }
}

module.exports = UnconnectedPong;