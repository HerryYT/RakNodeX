const Packet = require("./Packet");
const MessageIdentifiers = require("./MessageIdentifiers");

class ConnectedPing extends Packet {
    constructor(stream) {
        super(stream);
        this.sendPingTime = -1;
    }

    static getId() {
        return MessageIdentifiers.ID_CONNECTED_PING;
    }

    encodePayload() {
        this.getStream()
            .writeLong(this.sendPingTime);
    }

    decodePayload() {
        this.sendPingTime = this.getStream().readLong();
    }
}

module.exports = ConnectedPing;