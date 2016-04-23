const DEFAULT_CONNECTION_SETTINGS = { transport: "webSockets" };

var Api = require('../api');

/**
 * Connection for sending or receiving messages.
 */
function Connection() {
    this.connection = null;
    this.hubs = {
        MessageHub: null
    };
};

/**
 * Connect to the Pusher server with the given query string.
 * @param {object} [queryString]
 */
Connection.prototype.connect = function (queryString) {
    this.connection = $.hubConnection(Api.getApiUrl(), { useDefaultPath: false });
    this.connection.qs = queryString;

    this.hubs.MessageHub = this.connection.createHubProxy("MessageHub");
    this.hubs.MessageHub.on('Receive', function () {}); // this is a fake subscription for correct connecting. 

    return this.connection.start(DEFAULT_CONNECTION_SETTINGS);
};

/**
 * Disconnect the current connection.
 */
Connection.prototype.disconnect = function () {
    this.connection.stop();
};

/**
 * Set callback for receiving the incomming messages. 
 * @param {type} callback
 */
Connection.prototype.on = function (callback) {
    if (this.hubs.MessageHub == null) {
        return;
    }

    this.hubs.MessageHub.on('Receive', callback);
}

/**
 * Send a message to the clients with the given informations.
 * @param {string} sendkey
 * @param {string} title
 * @param {object} content
 * @param {string} [group]
 */
Connection.prototype.send = function (sendkey, title, content, group) {
    if (group == undefined) {
        this.hubs.MessageHub.invoke('Send', sendkey, title, content);
    } else {
        console.log("Group", group);
        this.hubs.MessageHub.invoke('GroupSend', sendkey, group, title, content);
    }
};

module.exports = Connection;