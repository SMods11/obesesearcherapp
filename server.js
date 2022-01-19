const mineflayer = require('mineflayer')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const bot = mineflayer.createBot({
    host: 'play.rinaorc.com',
    username: 'ObeseSearcher123',
    version: '1.8.9'
})

/* VARIABLES */
const loginCode = 'obeseSearched123';
let logged = false;
const obesePersonToCheck = ["YukimichikaYato", "logremo", "Hallox", "shika258", "ArtemisRing", "Flyern", "Weslink", "adrien2431", "Laelia59", "Juju_02", "kingnat40", "Antadiama", "frozles", "Thebest21_", "_Arava_", "Ygroxie", "SpaD0xi", "T2F_Yarhtisay", "Akie", "Corsac", "Chamukuuy", "xdredstone2", "Dutax", "comiksdj", "Natok", "HqtShekn_n", "SoWooh", "Lieee_"]
let obesePerson = [];
let obeseChecked = 0;
const milisecondeBeforeLogin = 500;

const port = process.env.PORT || 5000;
const app = express()

/* LOGIN */
bot.on('chat', (username, message) => {
    if(message.includes("register")) {
        const captcha = message.split(" ")[2].replaceAll("\"", "")
        console.log("Captcha code found : " + captcha)
        bot.chat("/register " + loginCode + " " + captcha)
    } if (message.includes("login")) {
        const captcha = message.split(" ")[2].replaceAll("\"", "")
        log("Captcha code found : " + captcha)
        setTimeout(function() {
            bot.chat("/login " + loginCode + " " + captcha)
            logged = true;
            log("Successfully logged !")
        }, milisecondeBeforeLogin)
    }
})

/* LOOP CHECKER */
function obese() {
    if(logged) {
        if (obeseChecked >= obesePersonToCheck.length) {
            obeseChecked = 0;
        }
        bot.chat("/party invite " + obesePersonToCheck[obeseChecked])
        obeseChecked++;
    }
}
setInterval(obese, 1500);

/* LOOP RECEIVER */
bot.on('message', jsonMsg => {
    const message = jsonMsg.getText()
    const actualPerson = obesePersonToCheck[obeseChecked - 1]
    const actualPersonIndex = obesePersonToCheck.indexOf(actualPerson)
    if (logged) {
        if (message.includes("Joueur hors-ligne")) {
            if (obesePerson.includes(actualPerson)) {
                obesePerson.splice(actualPersonIndex, 1)
            }
        }
        if (message.includes("Joueur déjà dans un groupe")) {
            if(!obesePerson.includes(actualPerson)) {
                obesePerson.push(actualPerson)
            }
        }
        if (message.includes("vient d'inviter")) {
            if(!obesePerson.includes(actualPerson)) {
                obesePerson.push(actualPerson)
            }
        }
    }
})

/* LOGGER */
function log(message) {
    console.log("[" + bot.username + "]" + " : " + message)
}

/* ERROR HANDLER */
bot.on('kicked', console.log)
bot.on('error', console.log)

/* API */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/", (req, res) => {
    res.status(200).json({
        working: true,
        methods: ["getobese"]
    });
})

app.get("/api/:methods", (req, res) => {
    if(req.params.methods === "getobese") {
        res.status(200).json({
            success: true,
            obese: obesePerson
        });
    } else {
        res.status(404).json({
            success: false,
            error: "bad_methods",
            methods: ["getobese"]
        });
    }
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(port)