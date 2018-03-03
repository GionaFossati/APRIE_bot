const Firebase = require('firebase')
const config = {
    apiKey: "AIzaSyCjItp5e0FyBmQwLmbawDpUGSrDkynqVak",
    projectId: "aprie-bot",
    authDomain: "aprie-bot.firebaseapp.com",
    databaseURL: "https://aprie-bot.firebaseio.com"
}

Firebase.initializeApp(config)

module.exports = {
    certificatori(){
        const aldo = require('./datatecnici.json')
        return Object.values(aldo)
    },

    faq(){
        const a = require("./faq.json")
        const appoggio = Object.values(a)

    },
    async retieveCert(){
        var certs = []
            , fecthData = index => new Promise((resolve, reject) => {
                Firebase.database().ref(index).on('value', (snapshot) => {
                    return resolve(snapshot.val());
                })
            });
        for (let i=0; i<60; i++) {
            certs.push(fecthData(i));
        }
        return Promise.all(certs);
    }

}

