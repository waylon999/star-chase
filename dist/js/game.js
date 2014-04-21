(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game1');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":5,"./states/gameover":6,"./states/menu":7,"./states/play":8,"./states/preload":9}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{"./collectible":4}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],6:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],7:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, '\'Allo, \'Allo!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],8:[function(require,module,exports){
/* global phaser */
  'use strict';

  var Collectible = require('../prefabs/collectible');
  var Baddie = require('../prefabs/baddie');
  var CollectableGroup = require('../prefabs/collectableGroup');

  var bulletTime = 0;
  var timesFired = 0;

  var playerLives = 3;
  var playerScore = 0;
  // we want to limit the number of collectables on screen at once
  var collectablesOnScreen = 0;

  var underDdosAttack = false;

  function collect(player, collectible) {
    playerScore += 100;

    collectablesOnScreen--;
    collectible.kill();
  }

  function enemyHitsHero(player, bullet) {
    bullet.kill();
    if (--playerLives === 0) {
        player.kill();
    }
  }


  function Play() {}
  Play.prototype = {
    create: function() {
        // start the physics engine
        this.game.physics.startSystem(Phaser.Physics.Arcade);
        this.game.physics.arcade.setBoundsToWorld();
        // give this world some gravity
        this.game.physics.arcade.gravity.y = 300;

        this.background = this.game.add.sprite(0, 0, 'sky');

        this.platformGroup = this.game.add.group(undefined, 'platformGroup', false, true, Phaser.Physics.ARCADE);

        // set to leftmost and bottom + 64px because we'll double the height
        var ground = this.platformGroup.create(0, this.game.world.height-64, 'platform');
        // double the height and width of the ground
        ground.scale.setTo(2, 2);

        this.platformGroup.create(0, this.game.world.height/2, 'platform').scale.setTo(.3, 1);
        this.platformGroup.create(400, 400, 'platform').scale.setTo(.25, 1);
        this.platformGroup.create(200, 400, 'platform').scale.setTo(.25, 1);
        this.platformGroup.create(500, 300, 'platform').scale.setTo(.25, 1);
        this.platformGroup.create(700, 300, 'platform').scale.setTo(.25, 1);
        this.platformGroup.create(400, 400, 'platform').scale.setTo(.25, 1);
        /**
        /**
        * If you have a Body that is being moved around the world via a tween or a Group motion, but its local x/y position never
        * actually changes, then you should set Body.moves = false. Otherwise it will most likely fly off the screen.
        * If you want the physics system to move the body around, then set moves to true.
        */
        //this.platformGroup.setAll('body.moves', false);
        this.platformGroup.setAll('body.allowGravity', false);
        // An immovable Body will not receive any impacts from other bodies.
        // An immovable Body will not receive any impacts from other bodies.
        this.platformGroup.setAll('body.immovable', true);

        this.hero = this.add.sprite(100, 400, 'hero');
        this.game.physics.arcade.enableBody(this.hero);

        // should go in a hero prefab, perhaps
        this.hero.animations.add('left', [1, 2, 3, 4, 5, 6], 10, true);
        this.hero.animations.add('right', [1, 2, 3, 4, 5, 6], 10, true);
        this.hero.animations.add('jump', [8], 2, true);
        //this.hero.animations.add('jump', [8], 1, true);

        this.hero.anchor.setTo(0.5, 1);
        this.hero.body.collideWorldBounds = true;

        // create some keys to move around
        this.cursors = this.game.input.keyboard.createCursorKeys();

        // add collectibles
        //this.collectible = new Collectible(this.game, 200, 200);
        //this.game.add.existing(this.collectible);

        this.collectables = this.game.add.group();
        this.generateCollectables();


        // add bad guys
        // single bad guy that always remains
        this.baddie = new Baddie(this.game, this.game.width / 2, 50);
        this.game.add.existing(this.baddie);

        // multiple bad guys for ddos attack
        this.ddosBaddies = this.game.add.group();
        for (var x = 0; x < 6; ++x) {
            var dbad = new Baddie(this.game, x * 150 + 20, -20);
            this.ddosBaddies.add(dbad);
        }

        // bullets
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 1);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
        // bullets should fly straight
        this.bullets.setAll('body.allowGravity', false);

        this.scoreText = this.game.add.text(50, 550, 'Score: ' + playerScore, { font: '34px Arial', fill: '#fff' });
        this.LivesText = this.game.add.text(650, 550, 'Lives: ' + playerScore, { font: '34px Arial', fill: '#fff' });
        this.stateText = this.game.add.text(this.game.world.centerX,this.game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
        this.stateText = this.game.add.text(this.game.world.centerX,this.game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
        this.stateText.anchor.setTo(0.5, 0.5);
        this.stateText.visible = false;
    },

    update: function() {
        this.checkScore();
        this.game.physics.arcade.collide(this.hero, this.platformGroup);
        this.game.physics.arcade.collide(this.bullets, this.platformGroup, function (bullet) {bullet.kill()})
        this.game.physics.arcade.collide(this.hero, this.bullets, this.enemyHitsHero, null, this);

        this.collectables.forEach(function (collectableGroup) {
            this.game.physics.arcade.collide(collectableGroup, this.platformGroup);
            this.game.physics.arcade.overlap(this.hero, collectableGroup, collect);
        }, this);

        if (collectablesOnScreen === 0) {
            this.generateCollectables();
        }

        this.hero.body.velocity.x = 0;
        if (this.cursors.left.isDown) {
            this.hero.scale.x = -1;
            this.hero.body.velocity.x = -180;
            this.hero.animations.play('left');
        } else if (this.cursors.right.isDown) {
            this.hero.scale.x = 1;
            this.hero.body.velocity.x = 180;
            this.hero.animations.play('right');
        }  else {
            this.hero.animations.stop();
            if (this.hero.body.velocity.y === 0) {
               this.hero.frame = 0;
            }
        }

        if (this.cursors.up.isDown && this.hero.body.touching.down) {
            //this.hero.frame = 8;
            this.hero.animations.play('jump');
            this.hero.body.velocity.y = -300;
        }

        // make the jumping motion if we are moving up or down
        if (this.hero.body.velocity.y !== 0) {
            this.hero.animations.stop();
            this.hero.frame = 8;
        }

        if (this.game.time.now > bulletTime) {
            this.bullet = this.bullets.getFirstExists(false);
            if (this.bullet) {
                this.bullet.reset(this.baddie.x, this.baddie.y);
                this.game.physics.arcade.moveToObject(this.bullet, this.hero, 350);

                bulletTime = this.game.time.now + 800;
                timesFired++;
            } else {
                this.bullets.setAll('exists', false);
            }

            if (timesFired > 3 && underDdosAttack === false) {
                underDdosAttack = true;
                var ddosAttack = this.game.add.tween(this.ddosBaddies).to({y: 50}, 1000, Phaser.Easing.Linear.None, true);
                ddosAttack.onComplete.add(function () {
                    for (var i = 0; i < this.ddosBaddies.children.length; ++i) {
                        // TODO: move this into a bullet method
                        var bbullet = this.bullets.getFirstExists(false);
                        if (!bbullet) {
                            console.log('Out of Bullets');
                            this.bullets.setAll('exists', false);
                            // horrible, I know. It's late....
                            bbullet = this.bullets.getFirstExists(false);
                        }
                        // y does not seem to get set correctly at this point
                        //bbullet.reset(this.ddosBaddies.children[i].x, this.ddosBaddies.children[i].y);
                        bbullet.reset(this.ddosBaddies.children[i].x, 50);
                        this.game.physics.arcade.moveToObject(bbullet, this.hero, 175);
                    }
                    this.game.add.tween(this.ddosBaddies).to({y: -20}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(function () {
                        underDdosAttack = false;
                    });
                }, this)
            }

        }


    },
    generateCollectables: function () {
        var collectGroup = this.collectables.getFirstExists(false);
        if (!collectGroup) {
            collectGroup = new CollectableGroup(this.game, this.collectables);
        }
        collectGroup.reset(0, 0);
        collectablesOnScreen = collectGroup.children.length;
        return collectGroup

    },
    enemyHitsHero: function (player, bullet) {
        bullet.kill();
        // oh, he dead
        if (--playerLives === 0) {
            player.kill();
            this.stateText.text = 'Game Over\nClick to Restart';
            this.stateText.visible = true;
            this.game.input.onTap.addOnce(this.restart, this);

        }
    },
    restart: function () {
        this.collectables.removeAll();
        this.bullets.setAll('exists', false);
        playerLives = 3;
        playerScore = 0;
        this.stateText.visible = false;
        this.hero.x = 100;
        this.hero.y = 400;
        this.hero.revive();
        this.generateCollectables();
    },
    checkScore: function () {
        this.scoreText.setText('Score: ' + playerScore);
        this.LivesText.setText('Lives: ' + playerLives);
    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };

  module.exports = Play;
},{"../prefabs/baddie":2,"../prefabs/collectableGroup":3,"../prefabs/collectible":4}],9:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);

    this.load.image('platform', 'assets/platform.png');
    this.load.image('sky', 'assets/sky.png');
    this.load.image('star', 'assets/star.png');
    //this.load.image('star', 'assets/say_med.png');
    this.load.image('bullet', 'assets/enemy-bullet.png');


    this.load.spritesheet('baddie', 'assets/invader32x32x4.png', 32, 32, 4);
    this.load.spritesheet('hero', 'assets/nerd.png', 32, 54, 9);

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      // this.game.state.start('menu');
      this.game.state.start('play');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])