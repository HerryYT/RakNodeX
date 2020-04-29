class InternetAddress {

    /** @type {string} */
    ip;
    /** @type {number} */
    port;
    /** @type {number} */
    version;

    /**
     * @param address {string}
     * @param port {number}
     * @param version {number}
     */
    constructor(address, port, version) {
        this.ip = address;
        if (port < 0 || port > 65535) {
            throw new Error('Invalid port range');
        }
        this.port = port;
        this.version = version;
    }

    /**
     * @return {string}
     */
    getIp() {
        return this.ip;
    }

    /**
     * @return {number}
     */
    getPort() {
        return this.port;
    }

    /**
     * @return {number}
     */
    getVersion() {
        return this.version;
    }
}
module.exports = InternetAddress;