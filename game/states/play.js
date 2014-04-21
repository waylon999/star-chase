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