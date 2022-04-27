const TwitchApi = require("node-twitch").default;
const open = require('open');
const moment = require('moment');
var successful = false;

const twitch = new TwitchApi({
	client_id: "",
	client_secret: ""
});

const isStreaming = (usern) => {
	return new Promise((resolve, reject) => {
		twitch.getStreams({
				channel: usern
			}).then(avail => {
				if (JSON.stringify(avail.data) == '[]') {
					resolve(false);
				} else {
					resolve(true);
				}
			})
			.catch(err => {
				console.log(err);
				reject(Error(err));
			});
	});
};

function isTimeCorrect() {
	if((moment().format('D')== 28) && moment().format('H') >= 3) {
		return true;
	}
	else {
		return false;
	}
}

setInterval(function () {
	isStreaming('KarQ').then(isStream => {
		if(!successful) {
			if(!isTimeCorrect()) {
				console.log('\x1b[33m', ('[' + moment().format('MMMM h:mm:ssa')+ '] incorrect time.'));
			}
			if(!isStream && isTimeCorrect()) {
				console.log('\x1b[31m', ('[' + moment().format('MMMM h:mm:ssa')+ '] WARNING: past 3am and KarQ is not streaming.'));
			}
			if (isStream && isTimeCorrect()) {
				open('https://twitch.tv/KarQ');
				successful = true;
				console.log('\x1b[32m', ('[' + moment().format('MMMM h:mm:ssa')+ '] success.'));
			} 
		}
	})
}, 10000);

