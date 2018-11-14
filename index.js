const WebSocket = require('ws');
var http = require("http");

GET((data) => {
    data = data.substring(5)
    console.log(JSON.parse(data)['sid'])
    let sid = JSON.parse(data)['sid']
    // let sid = "qxhkdi5kHpCGC7N8AECI"

// curl "http://queue.csc.kth.se/socket.io/?EIO=3&transport=polling&t=1542231008429"

const time = new Date().getTime()

const ws = new WebSocket('ws://queue.csc.kth.se/socket.io/?EIO=3&transport=websocket&sid=' + sid, [], {
        'headers' : {
            "Cookie": "io=" + sid + "; "
            + "__utma=208713933.1600763072.1499939648.1501619977.1501624913.2; "
            + "AMCV_4D6368F454EC41940A4C98A6%40AdobeOrg=2096510701%7CMCIDTS%7C17416%7CMCMID%7C17531102242428657013954678375240293606%7CMCAAMLH-1505293038%7C6%7CMCAAMB-1505293038%7CNRX38WO0n5BH8Th-nqAG_A%7CMCOPTOUT-1504695438s%7CNONE%7CMCAID%7CNONE%7CMCSYNCSOP%7C411-17423%7CvVersion%7C2.0.0; "
            + "s_pers=%20v8%3D1504688284328%7C1599296284328%3B%20v8_s%3DFirst%2520Visit%7C1504690084328%3B%20c19%3Dsd%253Aproduct%253Ajournal%253Aarticle%7C1504690084334%3B%20v68%3D1504688284793%7C1504690084342%3B; "
            + "AMCV_774C31DD5342CAF40A490D44%40AdobeOrg=793872103%7CMCIDTS%7C17422%7CMCMID%7C17520116692012069033955847290166940852%7CMCAAMLH-1505808309%7C6%7CMCAAMB-1505808309%7CNRX38WO0n5BH8Th-nqAG_A%7CMCAID%7CNONE; "
            + "_ga=GA1.2.1600763072.1499939648; "
            + "connect.sid=s%3AzvYwmuwB3MKgocZH3mZ2fCfhqEfXqMSC.BKyvYhkmXG6cZyPNQfxjY4CpnD4AhNo893eom%2FsIIzc; "
            + "SSO_SESSION_START=" + time,

        }
    });
// const ws = new WebSocket("wss://echo.websocket.org/")


ws.on('open', function open() {
    console.log("OPEN")
    ws.emit('probe');
    ws.emit('listen', 'INDA');
  });
  
ws.on('msg', function incoming(data) {
    console.log("MSG:")
    console.log(data);
});

ws.on('probe', function incoming(data) {
    console.log("PROBE:")
    console.log(data);
});

ws.on('3probe', function incoming(data) {
    console.log("PROBE:")
    console.log(data);
    ws.emit("5")
    ws.send("5")
});

ws.on("close", () => {
    console.log("BYE")
})

ws.on("serverMessage", (data) => {
    console.log("SERVER MESSAGE")
    console.log(data)
})

ws.onerror = error => {
    console.log(`WebSocket error: ${error}`)
    console.log(error)
}

 // Listen for a queue being locked.
 ws.on('lobbylock', function(queue) {
    console.log(queue + " was locked (lobby)");
  });

  // Listen for a queue being unlocked.
  ws.on('lobbyunlock', function(queue) {
    console.log(queue + " was unlocked (lobby)");
  });

  // Listen for a queue going to sleep.
  ws.on('lobbyhide', function(queue) {
    console.log(queue + " was sent to sleep (lobby)");
  });

  // Listen for a queue waking up.
  ws.on('lobbyshow', function(queue) {
    console.log(queue + " was awoken (lobby)");
  });

  // Listen for locking the queue
  ws.on('lock', function (){
    console.log("LOCKED")
  });

  // Listen for unlocking the queue
  ws.on('unlock', function (){
    console.log("UNLOCKED")
  });
})
function GET(callback){
    const time = new Date().getTime()
    console.log(time)

    http.get('http://queue.csc.kth.se/socket.io/?EIO=3&transport=polling&t=' + time, (res) => {
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            callback(rawData)
        })   
    });
}