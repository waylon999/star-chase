'use strict';
var Colellectable = require('./collectible');

var CollectableGroup = function(game, parent) {
  Phaser.Group.call(this, game, parent);

  // 3 collectables on screen at once
  this.col1 = new Colellectable(this.game, this.game.rnd.integerInRange(50, 750), 100);
  this.col2 = new Colellectable(this.game, this.game.rnd.integerInRange(50, 750), 100);
  this.col3 = new Colellectable(this.game, this.game.rnd.integerInRange(50, 750), 122);

  this.add(this.col1);
  this.add(this.col2);
  this.add(this.col3);
};

CollectableGroup.prototype = Object.create(Phaser.Group.prototype);
CollectableGroup.prototype.constructor = CollectableGroup;

CollectableGroup.prototype.update = function() {

  // write your prefab's specific update code here

};

CollectableGroup.prototype.reset = function() {
    this.col1.reset(this.game.rnd.integerInRange(50, 750), 100);
    this.col2.reset(this.game.rnd.integerInRange(50, 750), 100);
    this.col3.reset(this.game.rnd.integerInRange(50, 750), 200);

    this.exists = true;
}

module.exports = CollectableGroup;
