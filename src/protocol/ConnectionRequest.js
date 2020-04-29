const Packet = require("./Packet");
const MessageIdentifiers = require("./MessageIdentifiers");

class ConnectionRequest extends Packet {
    constructor(stream) {
        super(stream);
        this.initVars();
    }

    static getId() {
        return MessageIdentifiers.ID_CONNECTION_REQUEST;
    }

    initVars() {
        this.clientId = -1;
        this.sendPingTime = 0;
        this.useSecurity = false;
    }

    encodePayload() {
        this.getStream()
            .writeLong(this.clientId)
            .writeLong(this.sendPingTime)
            .writeBool(this.useSecurity);
    }

    decodePayload() {
        this.clientId = this.getStream().readLong();
        this.sendPingTime = this.getStream().readLong();
        this.useSecurity = this.getStream().readBool();
    }
}

module.exports = ConnectionRequest;