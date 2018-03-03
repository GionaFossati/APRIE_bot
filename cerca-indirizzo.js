/*global require,module,console*/
const Markup = require('telegraf/markup');
const model = require('../model')

module.exports = async Scene => {
    const index = new Scene('Cerca in base all\'indirizzo')
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
        ctx.reply('Scrivi l\'indirizzo:', sceneKeyboard);
    });

    index.on('message', async (ctx) => {
        var indirizzoCercato = ctx.message.text  
        if (indirizzoCercato !== "Indietro") {
        var certificatiMatch= []
        for (let i=0; i<60; i++) {
            if (certs[i].indirizzo === indirizzoCercato) {
                ctx.session.cert = certs[i]  
                console.info(`Navigation from Cerca in base all\'indirizzo to Dettaglio Certificato`);
                await index.leave();
                await ctx.scene.enter('Dettaglio certificato');
            } else 
            if (certs[i].indirizzo.search(indirizzoCercato) != -1){
                certificatiMatch.push(certs[i])
            }
        }
        var indirizziMatch = []
        for (let i=0; i<certificatiMatch.length; i++){
            indirizziMatch.push(certificatiMatch[i].indirizzo)
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
