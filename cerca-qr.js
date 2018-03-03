/*global require,module,console*/
const Markup = require('telegraf/markup');
const model = require('../model')

module.exports = async Scene => {
    const index = new Scene('Cerca tramite QR Code')
        , certs = await model.retieveCert()
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
        ctx.reply('Invia la foto del QR Code:', sceneKeyboard);
    });

    index.on('photo', async (ctx) => {
        var indice = Math.floor(Math.random() * (59 - 0 + 1)) + 0;
        ctx.session.cert = certs[indice]
        console.info(`Navigation from Cerca QR to Dettaglio Certificato`);
                    await index.leave();
                    await ctx.scene.enter('Iniziale');
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
