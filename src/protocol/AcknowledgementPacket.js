const Packet = require("./Packet");

const BinaryStream = require("../../binarystream/BinaryStream");

class AcknowledgementPacket extends Packet {
    constructor(stream) {
        super(stream);
        this.packets = [];
    }

    static RECORD_TYPE_RANGE = 0;
    static RECORD_TYPE_SINGLE = 1;

    encodePayload() {
        let payload = new BinaryStream();
        this.packets = this.packets.sort((x, y) => {
            return x - y
        });
        let count = this.packets.length;
        let records = 0;

        if (count > 0) {
            let pointer = 1;
            let start = this.packets[0];
            let last = this.packets[0];

            while (pointer < count) {
                let current = this.packets[pointer++];
                let diff = current - last;
                if (diff === 1) {
                    last = current;
                } else if (diff > 1) {
                    if (start === last) {
                        payload.writeByte(AcknowledgementPacket.RECORD_TYPE_SINGLE);
                        payload.writeLTriad(start);
                        start = last = current;
                    } else {
                        payload.writeByte(AcknowledgementPacket.RECORD_TYPE_RANGE);
                        payload.writeLTriad(start);
                        payload.writeLTriad(last);
                        start = last = current;
                    }
                    records++;
                }
            }

            if (start === last) {
                payload.writeByte(AcknowledgementPacket.RECORD_TYPE_SINGLE);
                payload.writeLTriad(start);
            } else {
                payload.writeByte(AcknowledgementPacket.RECORD_TYPE_RANGE);
                payload.writeLTriad(start);
                payload.writeLTriad(last);
            }
            records++;
        }

        this.getStream().writeShort(records);
        this.getStream().append(payload.getBuffer());
    }

    decodePayload() {
        let count = this.getStream().readShort();
        this.packets = [];
        let cnt = 0;
        for (let i = 0; i < count && !this.getStream().feof() && cnt < 4096; i++) {
            if (this.getStream().readByte() === AcknowledgementPacket.RECORD_TYPE_RANGE) {
                let start = this.getStream().readLTriad();
                let end = this.getStream().readLTriad();
                if ((end - start) > 512) {
                    end = start + 512;
                }
                for (let c = start; c <= end; c++) {
                    this.packets[cnt++] = c;
                }
            } else {
                this.packets[cnt++] = this.getStream().readLTriad();
            }
        }
    }
}
module.exports = AcknowledgementPacket;