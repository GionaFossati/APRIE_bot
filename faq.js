/*global require,module,console*/
const Markup = require('telegraf/markup');
const model = require('../model')

module.exports = async Scene => {
    const index = new Scene('FAQ')
        , certs = await model.retieveCert()
        , sceneMenu = [
            'Quesiti Tecnico Procedurali',
            'Soggetti Certificatori',
            'Certificazione Energetica',
            'Indietro',
        ]
        , sceneKeyboard = Markup
            .keyboard(sceneMenu)
            .resize()
            .extra();


    index.enter(ctx => {
        console.info(`Serving Cerca in base all\'indirizzo to ${ctx.session.username}`);

        ctx.session.certs = certs
        ctx.reply('Scrivi una parola chiave:', sceneKeyboard);
    });

    index.on('message', async (ctx) => {
        var categoria = ctx.message.text
        if (categoria !== "Indietro") {
            var categoriaMatch = []
            for (let i = 0; i < ; i++) {
                if (certs[i].indirizzo === categoria) {
                    ctx.session.cert = certs[i]
                    console.info(`Navigation from Cerca in base all\'indirizzo to Dettaglio Certificato`);
                    await index.leave();
                    await ctx.scene.enter('Dettaglio certificato');
                } else
                    if (certs[i].indirizzo.search(categoria) != -1) {
                        categoriaiMatch.push(certs[i])
                    }
            }
            var indirizziMatch = []
            for (let i = 0; i < categoriaiMatch.length; i++) {
                indirizziMatch.push(categoriaiMatch[i].indirizzo)
            }
            ctx.reply('Seleziona l\'indirizzo:', Markup.keyboard(indirizziMatch).resize().extra())
        } else {
            console.info(`Navigation from Cerca in base all\'indirizzo to Cerca Certificato`);
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
