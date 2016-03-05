var Connection = require('./connection');

/**
 * Connection for sending messages to clients.
 */
function Sender() {
    this.con = new Connection();
};

/**
 * Connect to the Pusher server.
 */
Sender.prototype.connect = function () {
    return this.con.connect();
}

/**
 * Disconnect the current connection.
 */
Sender.prototype.disconnect = function () {
    this.con.disconnect();
};

/**
 * Send a message to the clients with the given informations.
 * @param {string} title
 * @param {object} content
 * @params {string} [group]
 */
Sender.prototype.send = function (title, content, group) {
    this.con.send(Pusher.getSendKey(), title, content, group);
};

module.exports = Sender;