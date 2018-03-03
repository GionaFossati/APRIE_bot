/*global require,module,console*/
const Markup = require('telegraf/markup');
const model = require('../model')

module.exports = async Scene => {
    const index = new Scene('Iniziale')
        , certs = await model.retieveCert()
        , sceneMenu = [
            'Cerca Certificatori',
            'Cerca Certificato',
        ]
        , sceneKeyboard = Markup
            .keyboard(sceneMenu)
            .resize()
            .extra();



    index.enter(ctx => {
        console.info(`Serving Iniziale to ${ctx.session.username}`);

        ctx.session.certs = certs
        ctx.reply('Cosa vuoi fare?', sceneKeyboard);
    });

    sceneMenu.forEach(elm => {

        index.hears(elm, async ctx => {

            console.info(`Navigation from Iniziale to ${elm}`);
            await index.leave();
            await ctx.scene.enter(elm);
        });
    });

    return index;
};
