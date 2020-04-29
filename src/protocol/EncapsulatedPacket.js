const BinaryStream = require("../../binarystream/BinaryStream");

const PacketReliability = require("./PacketReliability");

class EncapsulatedPacket {
    constructor() {
        this.initVars();
    }

    /** @type {number | null} */
    identifierACK;

    static fromBinary(stream) {
        let packet = new EncapsulatedPacket();

        let flags = stream.readByte();
        packet.reliability = ((flags & 0xe0) >> 5);
        packet.hasSplit = (flags & 0x10) > 0;

        packet.length = Math.ceil(stream.readShort() / 8);

        if (packet.isReliable()) {
            packet.messageIndex = stream.readLTriad();
        }

        if (packet.isSequenced()) {
            packet.sequenceIndex = stream.readLTriad();
        }

        if (packet.isSequencedOrOrdered()) {
            packet.orderIndex = stream.readLTriad();
            packet.orderChannel = stream.readByte();
        }

        if (packet.hasSplit) {
            packet.splitCount = stream.readInt();
            packet.splitId = stream.readShort();
            packet.splitIndex = stream.readInt();
        }

        packet.stream = new BinaryStream(stream.buffer.slice(stream.offset, stream.offset + packet.length));
        stream.offset += packet.length;

        return packet;
    }

    initVars() {
        this.reliability = 0;
        this.hasSplit = false;

        this.messageIndex = null;

        this.orderIndex = null;
        this.orderChannel = null;

        this.splitCount = null;
        this.splitId = null;
        this.splitIndex = null;

        this.stream = new BinaryStream();
        this.length = 0;

        this.needACK = false;
    }

    toBinary() {
        let stream = new BinaryStream();

        stream.writeByte((this.reliability << 5) | (this.hasSplit ? 0x10 : 0));
        stream.writeShort(this.getBuffer().length << 3);

        if (this.isReliable()) {
            stream.writeLTriad(this.messageIndex);
        }

        if (this.isSequenced()) {
            stream.writeLTriad(this.sequenceIndex);
        }

        if (this.isSequencedOrOrdered()) {
            stream.writeLTriad(this.orderIndex);
            stream.writeByte(this.orderChannel);
        }

        if (this.hasSplit) {
            stream.writeInt(this.splitCount);
            stream.writeShort(this.splitId);
            stream.writeInt(this.splitIndex);
        }

        stream.append(this.getBuffer());

        return stream.buffer.toString("hex");
    }

    isReliable() {
        return (
            this.reliability === PacketReliability.RELIABLE ||
            this.reliability === PacketReliability.RELIABLE_ORDERED ||
            this.reliability === PacketReliability.RELIABLE_SEQUENCED ||
            this.reliability === PacketReliability.RELIABLE_WITH_ACK_RECEIPT ||
            this.reliability === PacketReliability.RELIABLE_ORDERED_WITH_ACK_RECEIPT
        );
    }

    isSequenced() {
        return (
            this.reliability === PacketReliability.UNRELIABLE_SEQUENCED ||
            this.reliability === PacketReliability.RELIABLE_SEQUENCED
        );
    }

    isOrdered() {
        return (
            this.reliability === PacketReliability.RELIABLE_ORDERED ||
            this.reliability === PacketReliability.RELIABLE_ORDERED_WITH_ACK_RECEIPT
        );
    }

    isSequencedOrOrdered() {
        return (
            this.reliability === PacketReliability.UNRELIABLE_SEQUENCED ||
            this.reliability === PacketReliability.RELIABLE_ORDERED ||
            this.reliability === PacketReliability.RELIABLE_SEQUENCED ||
            this.reliability === PacketReliability.RELIABLE_ORDERED_WITH_ACK_RECEIPT
        );
    }

    getLength() {
        return 3 + this.getBuffer().length + (this.messageIndex !== null ? 3 : 0) + (this.orderIndex !== null ? 4 : 0) + (this.hasSplit ? 10 : 0);
    }

    getStream() {
        return this.stream;
    }

    getBuffer() {
        return this.stream.buffer;
    }
}

module.exports = EncapsulatedPacket;