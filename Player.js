const Player = class Player {
	constructor(playerName, nickname) {
		this.playerName = playerName;
		this.nickname = nickname;
	}
};

exports.createPlayer = function (name, nickname) {
	return new Player(name, nickname);
};
