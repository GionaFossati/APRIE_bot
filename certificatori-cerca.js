/*global require,module,console*/
const Markup = require('telegraf/markup');
const model = require('../model')

module.exports = async Scene => {
    const index = new Scene('Cerca Certificatori')
        , certs = model.certificatori()
        , sceneMenu = [
            'Indietro'
        ]
        , sceneKeyboard = Markup
            .keyboard(sceneMenu)
            .resize()
            .extra();


    index.enter(ctx => {
        console.info(`Serving Cerca in base all\'indirizzo to ${ctx.session.username}`);

        ctx.session.certs = certs
        ctx.reply('In che comuni desideri cercare il Tecnico?', sceneKeyboard);
    });

    index.on('message', async (ctx) => {
        var indirizzoCercato = ctx.message.text
        if (indirizzoCercato !== "Indietro") {
            var certificatiMatch = []
            for (let i = 0; i < certs.length; i++) {
                if (certs[i].comune.search(indirizzoCercato.charAt(0).toUpperCase()) != -1) {
                    const message = [
                        'Certificatore trovato!',
                        'Nome:',
                        certs[i].nome + " " + certs[i].cognome ,
                        'Telefono:',
                        certs[i].telefono
                    ].join('\r\n')
                    ctx.reply(message, sceneKeyboard);
                    var ricerca = true
                    i=60;
                } else
                    ricerca = false;
            }            
        } else {
            console.info(`Navigation from Cerca in base all\'indirizzo to Cerca Certificato`);
            await index.leave();
            await ctx.scene.enter('Iniziale');
        }

        if (ricerca == false) {
            ctx.reply('Non ci sono certificatori per questo Comune, prova a cercare i Comuni limitrofi.')
        }
    })

    sceneMenu.forEach(elm => {

        if (elm !== "Indietro") {
            index.hears(elm, async ctx => {

                console.info(`Navigation from Cerca in base all\'indirizzo to ${elm}`);
                await index.leave();
                await ctx.scene.enter(elm);
            });
        }


    });

    return index;
};
