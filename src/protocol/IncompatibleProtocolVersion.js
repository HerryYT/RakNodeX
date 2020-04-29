const OfflineMessage = require("./OfflineMessage");
const MessageIdentifiers = require("./MessageIdentifiers");

class IncompatibleProtocolVersion extends OfflineMessage {
    constructor() {
        super();
        this.initVars();
    }

    static getId() {
        return MessageIdentifiers.ID_INCOMPATIBLE_PROTOCOL_VERSION;
    }

    initVars() {
        this.protocolVersion = -1;
        this.serverId = -1;
    }

    encodePayload() {
        this.getStream().writeByte(this.protocolVersion);

        this.writeMagic();

        this.getStream().writeLong(this.serverId);
    }
}

module.exports = IncompatibleProtocolVersion;