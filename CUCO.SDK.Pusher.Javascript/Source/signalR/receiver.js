var Connection = require('./connection');

/**
 * Connection for receiving messages.
 * @param {string} group
 */
function Receiver(group) {
    this.group = group;
    this.con = new Connection();
};

/**
 * Connect to the Pusher server for receiving messages.
 */
Receiver.prototype.connect = function () {
    this.con.connect({
        Key: Pusher.getReceiveKey(),
        Group: this.group
    });
};

/**
 * Disconnect the current connection.
 */
Receiver.prototype.disconnect = function () {
    return this.con.disconnect();
};

/**
 * Set callback for receiving the incomming messages. 
 * @param {function} callback
 */
Receiver.prototype.on = function (callback) {
    this.con.on(callback);
};

module.exports = Receiver;