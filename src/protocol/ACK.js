const AcknowledgementPacket = require("../protocol/AcknowledgementPacket");

class ACK extends AcknowledgementPacket {
    constructor(stream) {
        super();
        if (stream) {
            this.stream = stream;
        }
    }

    static getId() {
        return 0xc0;
    }
}

module.exports = ACK;