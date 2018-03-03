/*global require,module,console*/
const Markup = require('telegraf/markup');
const model = require('../model')

module.exports = async Scene => {
  const index = new Scene('Cerca Certificato')
    , certs = await model.retieveCert()
    , sceneMenu = [
      'Cerca in base all\'indirizzo',
      'Cerca con il numero',
      'Cerca tramite QR Code',
      'Indietro'
    ]
    , sceneKeyboard = Markup
      .keyboard(sceneMenu)
      .resize()
      .extra();



  index.enter(ctx => {
    console.info(`Serving Cerca certificato to ${ctx.session.username}`);

    ctx.session.certs = certs
    ctx.reply('Scegli la tipologia di ricerca:', sceneKeyboard);
  });

  sceneMenu.forEach(elm => {
    index.hears(elm, async ctx => {
      if (elm == "Indietro") {

          console.info(`Navigation from Cerca in base all\'indirizzo to ${elm}`);
          await index.leave();
          await ctx.scene.enter("Iniziale");
  
      } else {

      console.info(`Navigation from Cerca certificato to ${elm}`);
      await index.leave();
      await ctx.scene.enter(elm);
      }
    });
  });

  return index;
};
