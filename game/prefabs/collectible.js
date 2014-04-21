'use strict';

var Collectable = function(game, x, y, frame) {
    Phaser.Sprite.call(this, game, x, y, 'star', frame);

    this.anchor.setTo(0.5, 0.5);

    this.game.physics.arcade.enableBody(this);

    this.body.bounce.y = 0.3;


};

Collectable.prototype = Object.create(Phaser.Sprite.prototype);
Collectable.prototype.constructor = Collectable;

Collectable.prototype.update = function() {

  // write your prefab's specific update code here

};

module.exports = Collectable;
