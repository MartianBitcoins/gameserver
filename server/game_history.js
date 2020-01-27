var CBuffer = require('CBuffer');

function GameHistory (gameTable) {
    var self = this;
    self.gameTable = new CBuffer(10);
    gameTable.forEach(function(game) {
        self.gameTable.push(game);
    });
}

GameHistory.prototype.addCompletedGame = function (game) {
    this.gameTable.unshift(game);
};

GameHistory.prototype.getHistory = function () {
    return this.gameTable.toArray();
};

module.exports = GameHistory;
