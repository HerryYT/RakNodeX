const AcknowledgementPacket = require("./AcknowledgementPacket");

class NACK extends AcknowledgementPacket {
    constructor(stream) {
        super(stream);
    }

    static getId() {
        return 0xA0;
    }
}

module.exports = NACK;