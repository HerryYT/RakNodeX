const BinaryStream = require("../../binarystream/BinaryStream");

class Packet {
    constructor(stream) {
        if (stream instanceof BinaryStream) {
            this.stream = stream;
        } else {
            this.stream = new BinaryStream();
        }
    }

    static getId() {
        return -1;
    }

    getId() {
        return this.constructor.getId();
    }

    encode() {
        this.encodeHeader();
        this.encodePayload();
    }

    encodeHeader() {
        this.getStream().writeByte(this.getId());
    }

    encodePayload() {
    }

    decode() {
        this.decodeHeader();
        this.decodePayload();
    }

    decodeHeader() {
        this.getStream().readByte();
    }

    decodePayload() {
    }

    /** @param v {string} */
    writeString(v) {
        this.getStream().writeShort(v.length);
        this.getStream().append(Buffer.from(v, "utf8"));
    }

    getStream() {
        return this.stream;
    }

    getBuffer() {
        return this.stream.buffer;
    }
}

module.exports = Packet;