'use strict';

var Baddie = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'baddie', frame);

  this.anchor.setTo(0.5, 0.5);

  this.game.physics.arcade.enableBody(this);
  this.animations.add('fly', [0, 1, 2, 3], 20, true);
  this.animations.play('fly');
  this.body.moves = false;

};

Baddie.prototype = Object.create(Phaser.Sprite.prototype);
Baddie.prototype.constructor = Baddie;

Baddie.prototype.update = function() {

  // write your prefab's specific update code here

};

module.exports = Baddie;
