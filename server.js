var express = require("express");
var fs = require("fs");
var path = require("path");
var cors = require("cors");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;

var app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
var Player = require("./Player.js");

//app.use(express.static(path.join(__dirname, "/../dist")));
app.use(express.static("static"));
app.use(express.static("static/Game"));
app.use(cors());

let playersInRoom = [];

io.on("connection", function (socket) {
	console.log("connected " + socket.handshake.query.nickname);
	addNewPlayer(socket, socket.handshake.query.nickname);

	socket.on("disconnect", function () {
		console.log("A user disconnected " + socket.handshake.query.nickname);
		removePlayer(socket.handshake.query.nickname);
	});

	socket.on("playerPositionUpdate", (playerName, posX, posZ) => {
		socket.broadcast.emit("playerPositionUpdateReceived", playerName, posX, posZ);
	});
});

const addNewPlayer = (socket, nickname) => {
	let id = null;
	if (playersInRoom.length == 1) {
		if (playersInRoom[0].playerName == "player1") {
			id = 2;
			const player = Player.createPlayer("player" + id, nickname);
			playersInRoom.push(player);
		} else {
			id = 1;
			const player = Player.createPlayer("player" + id, nickname);
			playersInRoom.push(player);
		}
	} else if (playersInRoom.length == 0) {
		id = 1;
		const player = Player.createPlayer("player" + id, nickname);
		playersInRoom.push(player);
	}

	socket.emit("idGenerated", id);
	console.log("after adding: " + JSON.stringify(playersInRoom));
};

const removePlayer = (nick) => {
	for (let i = 0; i < playersInRoom.length; i++) {
		if (playersInRoom[i].nickname == nick) {
			playersInRoom.splice(i, 1);
		}
	}
	console.log("after remove: " + JSON.stringify(playersInRoom));
};

app.get("/", (req, res) => {
	res.sendFile(path.resolve(__dirname, "static/lobby.html"));
});

app.post("/", (req, res) => {
	if (playersInRoom.length >= 2) res.send("MAXYMALNA LICZBA GRACZY. POCZEKAJ");
	else res.sendFile(path.resolve(__dirname + "/static/Game/game.html"));
});

http.listen(PORT, function () {
	console.log("START ON 3000");
});
