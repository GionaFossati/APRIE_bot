/*global require,module,console*/
const Markup = require('telegraf/markup');

module.exports = async Scene => {
    const index = new Scene('Dettaglio certificato')
        , sceneMenu = [
            'Indietro'
        ]
        , sceneKeyboard = Markup
            .keyboard(sceneMenu)
            .resize()
            .extra();


    index.enter(ctx => {
        console.info(`Serving Cerca in base all\'indirizzo to ${ctx.session.username}`);
        const message = [
            'Dettaglio del certificato:',
            'Classe Energetica:',
            ctx.session.cert.classificazione,
            'Consumo annuale:',
            ctx.session.cert.energia_globale_ubicazione + ' KwH/mq annui',
            'Gradi Giorno:',
            ctx.session.cert.gradi_giorno,
        ].join('\r\n')
        ctx.reply(message, sceneKeyboard);
    });

    index.hears('Indietro', async ctx => {

        console.info(`Navigation from Cerca in base all\'indirizzo to Cerca certificato`);
        await index.leave();
        await ctx.scene.enter('Iniziale');
    });
    return index;
};
