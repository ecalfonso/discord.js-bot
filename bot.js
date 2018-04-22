const Discord 	= require("discord.js");
const fs 	= require("fs");
const ffmpeg 	= require("fluent-ffmpeg");

const client = new Discord.Client();

global.config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

// Global vars
var vc = null // For bot's voiceChannel
var vr = null // For bot's voiceReceiver

client.login(config.TestToken);

client.on("ready", () => {
	// Set Bot's Presence
	client.user.setActivity(`The Server v${config.version}`, { type: 'WATCHING'});
	console.log("-----------------------------------------------------------");
	console.log(`Bot: ${client.user.username}:${client.user.id} logged in.`);
	console.log("-----------------------------------------------------------");
});

client.on("message", (msg) => {
	// Skip Bot messages
	if (msg.author.bot)
		return;

	// Get timestamp
	var d = new Date();
	var now = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
	var line = `${now} ${msg.author.id} ${msg.author.username} ${msg.id} ${msg.content}`;

	// Output datetime and message to console
	console.log(line);

	// Check if it is a command
	if (msg.content[0] != '!')
		return;

	// Build Command and Argument variables
	args = msg.content.split(' ');
	cmd = args[0].toString().substr(1).toLowerCase();
	args.shift();

	if (cmd == "joinme") {
		console.log("Invoking !joinme");

		vc = msg.member.voiceChannel
		if (!vc) {
			msg.reply("You are not in a voice channel!");
			return;
		}

		//vc.join().then((connection) => {
		//	vr = connection.createReceiver();
		//});

		const connection = vc.join();
		if (connection) {
			console.log('Successfully made connection');
			console.log(connection);

			const receiver = connection.createReceiver();

			const voiceStream = receiver.createOpusStream(msg.member.user);
			voiceStream.on('data', chunk => {
				console.log(`voiceStream received: ${chunk}`);
			});
		}
	}

	if (cmd == "leave") {
		console.log("Invoking !leave");
		
		if (vc) {
			vc.leave();
			vc = null;
			vr = null;
		}
		else {
			msg.reply("I'm not in a voice channel!");
		}
	}
});

client.on("guildMemberSpeaking", (member, speaking) => {
	// Ignore bots
	if (member.user.bot)
		return

	if (speaking && vr != null) {
		console.log(`Listening to ${member.user.username}`);
	} else {
		console.log(`${member.user.username} STOPPED speaking`);
	}
});
