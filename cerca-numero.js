/*global require,module,console*/
const Markup = require('telegraf/markup');
const model = require('../model')

module.exports = async Scene => {
    const index = new Scene('Cerca con il numero')
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
        ctx.reply('Scrivi il numero dell\'impianto', sceneKeyboard);
    });

    index.on('message', async (ctx) => {
        var numeroCercato = ctx.message.text
        var presente = true;
        if (numeroCercato !== "Indietro") {
            var certificatiMatch = []
            for (let i = 0; i < 60; i++) {
                if (certs[i].c_istat == numeroCercato) {
                    console.info(`Navigation from Cerca con il numero to Dettaglio Certificato`);
                    ctx.session.cert = certs[i]
                    presente = true
                    await index.leave();
                    await ctx.scene.enter('Dettaglio certificato');
                }
             }
        } else {
            console.info(`Navigation from Cerca in base al numero to Cerca Certificato`);
            await index.leave();
            await ctx.scene.enter('Iniziale');
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
