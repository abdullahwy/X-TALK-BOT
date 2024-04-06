const { Client, Location, Poll, List, Buttons, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const svmsg = require('./svmsg.json');
const settings = require('./settings.json');
const { ndown } = require("nayan-media-downloader");
const net = require('net');
const express = require('express'); 

const host = 'whatsapp.com'; // Replace with desired ping server
const port = 80; // Standard port for HTTP requests (often used for ping checks)


const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: 'zspeak' //session | abdullah | zspeak
    }),
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
        },
});

client.initialize();

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

client.on('qr', (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    //console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small : true})
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
    client.sendMessage(`${settings.botNumber}@c.us`, svmsg.connectedMsg);
});

client.on('message_create', async (msg) => {
    const chat = await msg.getChat();


    if (msg.fromMe || msg.from === settings.ownerNumber + '@c.us' || msg.from === settings.sudoUsers + '@c.us') {
        
    if (settings.reactOwner === true){
        msg.react(settings.globalEmoji);

    }
} 
    

    if (msg.body.startsWith(settings.prefix + 'tagall')) {
        msg.react(settings.markEmoji);
        const NotifyMsg = (msg.body.slice(8));
        
        let text = `*G R O U P   N O T I F Y*\n\n${NotifyMsg}\n\n*${settings.botName}*\n\n`;
        let mentions = [];

        for (let participant of chat.participants) {
            mentions.push(`${participant.id.user}@c.us`);
            text += `> ${settings.markEmoji} @${participant.id.user} \n`;
        }

        await chat.sendMessage(text, { mentions });
    

    }  else if (msg.body === settings.prefix + "wid" && msg.hasQuotedMsg){
        const quotedMsg = await msg.getQuotedMessage();
        msg.react('🆔');
        msg.reply(quotedMsg.author);

    } else if (msg.body === settings.prefix + "wid" && !msg.hasQuotedMsg){
        msg.react('🆔');
        msg.reply(msg.id.remote);

    } else if (msg.body === settings.prefix + "wid" && msg.mentionedIds){
        const mentions = await msg.mentionedIds();
        msg.react('🆔');
        msg.reply(mentions);

    } else if (msg.body.startsWith(settings.prefix + 'join ')) {
        if (msg.fromMe || msg.from === settings.ownerNumber + '@c.us' || msg.from === settings.sudoUsers + '@c.us'){
        const inviteCode = msg.body.split(' ')[1];
        try {
            await client.acceptInvite(inviteCode);
            msg.reply(svmsg.joinedGrp);
            msg.react(settings.doneEmoji);
        } catch (e) {
            msg.reply(svmsg.invalidGrpLink);
            msg.react(settings.errorEmoji);
        }
    } else {
            msg.react(settings.errorEmoji);
            msg.reply(svmsg.onlyOwnerMsg);

    }
    } else if(msg.body.includes('🥺') || msg.body.includes('🥹') || msg.body.includes('😥') || msg.body.includes('😢') || msg.body.includes('😭') || msg.body.includes('😞') || msg.body.includes('😖') || msg.body.includes('😓') || msg.body.includes('😿') || msg.body.includes('😟') || msg.body.includes('😔')) {
        const chat = await msg.getChat();
        const audio = await MessageMedia.fromFilePath('./audio/sad_violin.mp3');
        if(settings.autoVoice === 'true'){
        await client.sendMessage(msg.from, audio, { sendAudioAsVoice: true });
        }
        if (settings.autoReact === 'true'){
            msg.react(settings.smile2Emoji);
        }
        
    } else if(msg.body.includes('😁') || msg.body.includes('😆') || msg.body.includes('😅') || msg.body.includes('🤣') || msg.body.includes('😂')) {
        const chat = await msg.getChat();
        const audio = await MessageMedia.fromFilePath('./audio/laugh.mp3');
        if(settings.autoVoice === 'true'){
        await client.sendMessage(msg.from, audio, { sendAudioAsVoice: true });
        }
        if (settings.autoReact === 'true'){
            msg.react(settings.smile2Emoji);
        }
        
    } else if(msg.body.includes('🕺') || msg.body.includes('💃') || msg.body.includes('👯') || msg.body.includes('👯‍♀️') || msg.body.includes('👯‍♂️')) {
        const chat = await msg.getChat();
        const audio = await MessageMedia.fromFilePath('./audio/amuka.mp3');
        if(settings.autoVoice === 'true'){
        await client.sendMessage(msg.from, audio, { sendAudioAsVoice: true });
        }
        if (settings.autoReact === 'true'){
            msg.react(settings.smile2Emoji);
        }
        
    } else if(msg.body.includes('oh') || msg.body.includes('ohh') || msg.body.includes('no') || msg.body.includes('noo') || msg.body.includes('oh nooo') || msg.body.includes('nooo')) {
        const chat = await msg.getChat();
        const audio = await MessageMedia.fromFilePath('./audio/no_no_no_nooo.mp3');
        if(settings.autoVoice === 'true'){
        await client.sendMessage(msg.from, audio, { sendAudioAsVoice: true });
        }
        if (settings.autoReact === 'true'){
            msg.react(settings.smile2Emoji);
        }
        
    }/* else if (msg.body === settings.prefix + 'ping'){
        msg.react(settings.markEmoji);

        msg.reply('Testing Ping...');
        
        const pingServer = net.createServer(socket => {
            const startTime = Date.now();
          
            socket.on('connect', () => {
              socket.write('PING '); // Send a simple PING message
            });
          
            socket.on('data', data => {
              const endTime = Date.now();
              const rtt = endTime - startTime;
          
              msg.reply(`*Pong received from ${host} in ${rtt} ms*`);
          
              socket.end(); // Close the socket after receiving the pong
              msg.react(settings.doneEmoji);
            });
          
            socket.on('error', err => {
              msg.reply(`*Error pinging ${host}:* `+ err);
              socket.end();
              msg.react(settings.errorEmoji);
            });
          });
          
          pingServer.listen(0, () => {
            const port = pingServer.address().port;
            console.log(`Pinging ${host} on port ${port}`);
          
            const client = net.createConnection({ port, host }, () => {
              client.end(); // Immediately close the client connection after initiating the ping
            });
          });

    
    }*/ else if (msg.body === settings.prefix + 'alive'){
        const text = `${svmsg.aliveMsg}\n\n> ${settings.markEmoji} WhatsApp Channel :\nhttps://whatsapp.com/channel/0029Va8orhgBPzjcYCCHAR3s\n> ${settings.markEmoji} YT : \nhttps://youtube.com/@WEBPICXGRAPHY\n> ${settings.markEmoji} GitHub : \nhttps://github.com/XTALKBOTS/XTALKBOTS\n\n*${settings.botName}*`;
        msg.reply(text, null, { linkPreview: true });

    } else if (msg.body.startsWith === settings.prefix + 'fb '){
        const message = msg.body.slice(3).trim();
        let URL = await ndown(message);
        //const video = await MessageMedia.fromUrl(URL);
        client.sendMessage(msg.from, URL);
    }
    
});

client.on('change_state', state => {
    console.log('CHANGE STATE', state);
});


if (settings.rejectCalls === "true"){
client.on('call', async (call) => {
    
    await call.reject();
    //await client.sendMessage(call.from, `[${call.fromMe ? 'Outgoing' : 'Incoming'}] Phone call from ${call.from}, type ${call.isGroup ? 'group' : ''} ${call.isVideo ? 'video' : 'audio'} call. ${rejectCalls ? 'This call was automatically rejected by the script.' : ''}`);
    client.sendMessage(call.from, svmsg.rejectCallsMsg);
});
}

client.on('message_ciphertext', (msg) => {
    // Receiving new incoming messages that have been encrypted
    // msg.type === 'ciphertext'
    msg.body = 'Waiting for this message. Check your phone.';
    msg.react('⌛')
});

const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => res.type('html').send(html));

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`
