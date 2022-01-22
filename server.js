const mineflayer = require('mineflayer')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const bot = mineflayer.createBot({
    host: 'play.rinaorc.com',
    username: 'Nigeriaann4',
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
        bot.chat("/register " + loginCode)
        console.log("Successfully registered !")
    } if (message.includes("login")) {
        setTimeout(function() {
            bot.chat("/login " + loginCode)
            logged = true;
            console.log("Successfully logged !")
        }, milisecondeBeforeLogin)
    }
})

/* LOOP MOVEMENT */
let lastControlState = 0
let controleStateArray = ['forward', 'back', 'left', 'right']

function movement() {
    if(logged) {
        lastControlState++
        if(lastControlState > 3) {
            lastControlState = 0
        }
        console.log(controleStateArray[lastControlState])
        bot.setControlState(controleStateArray[lastControlState], true)
        setTimeout(function() {
            bot.clearControlStates()
        }, 2000)
    }
}
setInterval(movement, 3*60*1000)

/* LOOP CHECKER */
function obese() {
    if(logged) {
        if (obeseChecked >= obesePersonToCheck.length) {
            obeseChecked = 0;
        }
        bot.chat("/ignore " + obesePersonToCheck[obeseChecked])
        obeseChecked++;
    }
}
setInterval(obese, 1500)

/* LOOP RECEIVER */
bot.on('message', jsonMsg => {
    const message = jsonMsg.getText()
    const actualPerson = obesePersonToCheck[obeseChecked - 1]
    const actualPersonIndex = obesePersonToCheck.indexOf(actualPerson)
    if (logged) {
        if (message.includes("Joueur introuvable")) {
            if (obesePerson.includes(actualPerson)) {
                obesePerson.splice(actualPersonIndex, 1)
            }
        }
        if (message.includes("n'ignorez plus les messages")) {
            if(!obesePerson.includes(actualPerson)) {
                obesePerson.push(actualPerson)
            }
        }
        if (message.includes("ignorez désormais les messages")) {
            if(!obesePerson.includes(actualPerson)) {
                obesePerson.push(actualPerson)
            }
        }
    }
})
/* SET LOGIN METHOD */
bot.on('windowOpen', (window) => {
    bot.clickWindow(11, 0, 0)
})

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
