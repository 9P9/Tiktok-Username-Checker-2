const request = require('request');
const colors = require('colors');
const chalk = require('chalk');
const ProxyAgent = require('proxy-agent');
const prompt = require('prompt');
const UserAgent = require(`user-agents`);
const fs = require('fs');
const proxies = fs.readFileSync('./extra/proxies.txt', 'utf-8').replace(/\r/gi, '').split('\n');
const usernames = [...new Set(require('fs').readFileSync('usernames.txt', 'utf-8').replace(/\r/g, '').split('\n'))];
const config = require("./extra/config.json");

process.on('uncaughtException', e => {});
process.on('uncaughtRejection', e => {});
process.warn = () => {};

var available = 0;
var unavailable = 0;
var rate = 0;
var retries = 0;
var checked = 0;

function write(content, file) {
    fs.appendFile(file, content, function(err) {});
}

function pcheck(username) {
	var userAgent = new UserAgent();
    var proxy = proxies[Math.floor(Math.random() * proxies.length)];
    var agent = new ProxyAgent(`${config.proxyType}://` + proxy);
    request({
        method: "HEAD",
        url: `https://www.tiktok.com/@${username}`,
		agent,
		headers: { 
			'User-Agent': userAgent.toString(),
			"accept-encoding": "gzip, deflate, br",
            'accept-language': 'en-US',
            'content-type': 'application/json'
		}
    }, (err, res, body) => {
		if(!res){ pcheck(username); }
		else{
			switch(res.statusCode){
				case 200: 
						unavailable++;
						console.log(chalk.red(`[${chalk.white('%s')}] (%s/%s/%s) [${chalk.white('Unavailable')}] Username: %s | Proxy: %s`), res.statusCode, available, checked, usernames.length, username, proxy);
						write(username + "\n", "usernames/unavailable.txt");
						
						break; 
				case 404: 
						available++;
						console.log(chalk.green(`[${chalk.white('%s')}] (%s/%s/%s) [${chalk.white('Available')}] Username: %s | Proxy: %s`), res.statusCode, available, checked, usernames.length, username, proxy);
						write(username + "\n", "usernames/available.txt");
						break; 
				case 429: 
						rate++;
						console.log(chalk.red("[${chalk.white('%s')}] (%s) Proxy: %s has been rate limited".inverse), res.statusCode, rate, proxy);
						pcheck(username);
						break; 
				default: 
						pcheck(username)
						break; 
			}
		}
        checked = available + unavailable;
        process.title = `[313][Tiktok Usernames Checker] - ${checked}/${usernames.length} Total Checked | ${available} Available | ${unavailable} Unavailable | ${rate} Rate Limited | Retries ${retries}`;
    });
}

function check(username) {
	var userAgent = new UserAgent();
    var proxy = proxies[Math.floor(Math.random() * proxies.length)];
    request({
        method: "HEAD",
        url: `https://www.tiktok.com/@${username}`,
		headers: { 
			'User-Agent': userAgent.toString(),
			"accept-encoding": "gzip, deflate, br",
            'accept-language': 'en-US',
            'content-type': 'application/json'
		}
    }, (err, res, body) => {
        if (res && res.statusCode === 200) {
            unavailable++;
            console.log(chalk.red(`[${chalk.white('%s')}] (%s/%s/%s) [${chalk.white('Unavailable')}] Username: %s `), res.statusCode, available, checked, usernames.length, username);
            write(username + "\n", "usernames/unavailable.txt");
        } else if (res && res.statusCode === 404) {
            available++;
            console.log(chalk.green(`[${chalk.white('%s')}] (%s/%s/%s) [${chalk.white('Available')}] Username: %s `), res.statusCode, available, checked, usernames.length, username);
            write(username + "\n", "usernames/available.txt");

        } else if (res && res.statusCode === 429) {
            rate++;
            console.log(chalk.red(`[%s] (%s) you have been rate limited (${chalk.white('consider using a VPN while using proxyless!')})`.inverse), res.statusCode, rate);
            check(username);
        } else {
            check(username)
        }

        checked = available + unavailable;
        process.title = `[313][Tiktok Usernames Checker] - ${checked}/${usernames.length} Total Checked | ${available} Available | ${unavailable} Unavailable | ${rate} Rate Limited`;
    });
}

function Generate(dict, Size, Loops) {
    let Name = '';
    for (var i = 0; i < Size; i++) {
        Name = Name + dict.charAt(Math.floor(Math.random() * dict.length));
    }
    console.log(Name);
    write(Name + "\n", "./extra/Generated.txt");
}


function printAsciiLogo() {
    console.log(chalk.hex("EE1D52")(`
	▄▄▄█████▓ ██▓ ██ ▄█▀▄▄▄█████▓ ▒█████   ██ ▄█▀    ▄████▄   ██░ ██ ▓█████  ▄████▄   ██ ▄█▀▓█████  ██▀███  
	▓  ██▒ ▓▒▓██▒ ██▄█▒ ▓  ██▒ ▓▒▒██▒  ██▒ ██▄█▒    ▒██▀ ▀█  ▓██░ ██▒▓█   ▀ ▒██▀ ▀█   ██▄█▒ ▓█   ▀ ▓██ ▒ ██▒
	▒ ▓██░ ▒░▒██▒▓███▄░ ▒ ▓██░ ▒░▒██░  ██▒▓███▄░    ▒▓█    ▄ ▒██▀▀██░▒███   ▒▓█    ▄ ▓███▄░ ▒███   ▓██ ░▄█ ▒
	░ ▓██▓ ░ ░██░▓██ █▄ ░ ▓██▓ ░ ▒██   ██░▓██ █▄    ▒▓▓▄ ▄██▒░▓█ ░██ ▒▓█  ▄ ▒▓▓▄ ▄██▒▓██ █▄ ▒▓█  ▄ ▒██▀▀█▄  
	  ▒██▒ ░ ░██░▒██▒ █▄  ▒██▒ ░ ░ ████▓▒░▒██▒ █▄   ▒ ▓███▀ ░░▓█▒░██▓░▒████▒▒ ▓███▀ ░▒██▒ █▄░▒████▒░██▓ ▒██▒
	▒ ░░   ░▓  ▒ ▒▒ ▓▒  ▒ ░░   ░ ▒░▒░▒░ ▒ ▒▒ ▓▒   ░ ░▒ ▒  ░ ▒ ░░▒░▒░░ ▒░ ░░ ░▒ ▒  ░▒ ▒▒ ▓▒░░ ▒░ ░░ ▒▓ ░▒▓░
		░     ▒ ░░ ░▒ ▒░    ░      ░ ▒ ▒░ ░ ░▒ ▒░     ░  ▒    ▒ ░▒░ ░ ░ ░  ░  ░  ▒   ░ ░▒ ▒░ ░ ░  ░  ░▒ ░ ▒░
	░       ▒ ░░ ░░ ░   ░      ░ ░ ░ ▒  ░ ░░ ░    ░         ░  ░░ ░   ░   ░        ░ ░░ ░    ░     ░░   ░ 
			░  ░  ░                ░ ░  ░  ░      ░ ░       ░  ░  ░   ░  ░░ ░      ░  ░      ░  ░   ░     
												`));
    console.log("");
	process.title = `[313] [Tiktok Usernames Checker] Created By Luci`;
    console.log(`[${chalk.green('!')}] Tiktok Checker | Created by ${chalk.bold.red('Luci')} | Join! discord.gg/XKv5AEPKZu for support!`);
}
printAsciiLogo();
console.log(chalk.red(`[${chalk.white('!')}] Some Usernames may be banned and will show as Available!`));
console.log("");
console.log(chalk("[1] Proxied Checking "));
console.log(chalk("[2] Proxyless Checker (Proxies)"));
console.log(chalk("[3] Username Generator"));
prompt.start();
console.log("");
prompt.get(['options'], function(err, result) {
    console.log('');
    var options = result.options;
    switch (options) {
        case "1":
            console.log(`[Proxy] ${config.proxyType}`);
            console.log(`[Tiktok Username Checker]: Started!`.inverse);
            console.log(`[Checking %s Usernames with %s Proxies!]`.inverse, usernames.length, proxies.length);
            for (var i in usernames) pcheck(usernames[i]);
            break;

        case "2":
            console.log(`[Tiktok Username Checker]: Started!`.inverse);
            console.log(`[Checking %s Usernames with No Proxies!]`.inverse, usernames.length, );
            for (var i in usernames) check(usernames[i]);
            break;
        case "3":
			console.clear();
            prompt.start()
            console.log("[?] How many chars for each Username!");
            prompt.get(['Amount'], function(err, result) {
                var Size = result.Amount;
                console.log("[?] How many would you like to generate!");
                prompt.get(['Generation'], function(err, result) {
                    var Loops = result.Generation;
                    console.log("");
                    console.log("[1] Dictionary Type | AlphaNumerical | abcdefghijklmnopqrstuvwxyz0123456789");
                    console.log("[2] Dictionary Type | Alphabet | abcdefghijklmnopqrstuvwxyz");
                    prompt.get(['Letters'], function(err, result) {
                        var Letters = result.Letters;
                        switch (Letters) {
                            case "1":
                                var dict = "abcdefghijklmnopqrstuvwxyz0123456789";
                                for (var i = 0; i < Loops; i++) {
                                    Generate(dict, Size, Loops);
                                }
                                break;
                            case "2":
                                var dict = "abcdefghijklmnopqrstuvwxyz";
                                for (var i = 0; i < Loops; i++) {
                                    Generate(dict, Size, Loops);
                                }
								console.log("[!] Usernames Generated Successfully! Check Generated.txt in The Extra Folder!"); 
                                break;
                        }
                    })
                })
            })
            break;
    }
})
