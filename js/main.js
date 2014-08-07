/**
 * Created by skyler on 14-8-5.
 */
enchant();

window.onload=function(){
    var game= new Game(320, 400);
    game.preload(
        'res/BG.png',
        'res/penguinSheet.png',
        'res/Ice.png',
        'res/Hit.mp3',
        'res/bgm.mp3'
    );
    game.fps= 30;
    game.scale= 1;
    game.onload=function(){
        console.log('hi, ocean!');
/*
        var scene, label, bg;
        //新场景
        scene= new Scene();
        //添加标签
        label= new Label('Hi, ocean!');
        //背景
        bg= new Sprite(320,440);
        bg.image= game.assets['res/BG.png'];
        //添加项,添加的时候注意层次，后添加的在上面
        scene.addChild(bg);
        scene.addChild(label);
*/
        //开始场景
        var scene= new gameScene();
        game.pushScene(scene);
    };
    game.start();
    window.scrollTo(0, 0);

    var gameScene= Class.create(Scene,{
        initialize: function(){
            var game, label, bg, penguin, iceGroup;
            Scene.apply(this);
            game= Game.instance;

            label = new Label('得分<br>0');
            label.x = 9;
            label.y = 32;
            label.color = 'white';
            label.font = '16px strong';
            label.textAlign = 'center';
            label._style.textShadow ="-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black";
            this.scoreLabel = label;

            bg= new Sprite(320,440);
            bg.image= game.assets['res/BG.png'];

//            penguin= new Sprite(30,43);
//            penguin.image= game.assets['res/penguinSheet.png'];
            penguin= new Penguin();
            penguin.x= game.width/2 - penguin.width/2;
            penguin.y= 280;
            this.penguin= penguin;

            iceGroup= new Group;
            this.iceGroup= iceGroup;


            this.addChild(bg);
            this.addChild(iceGroup);
            this.addChild(label);
            this.addChild(penguin);

            this.addEventListener(Event.TOUCH_START,this.handleTouchControl);
            this.addEventListener(Event.ENTER_FRAME,this.update);

            this.generateIceTimer = 0;
            this.scoreTimer=0;
            this.score=0;
            this.bgm = game.assets['res/bgm.mp3'];
            this.bgm.play();

        },
        handleTouchControl: function(ev){
            var laneWidth, lane;
            laneWidth= 320/3;
            lane= Math.floor(ev.x/laneWidth);
            lane= Math.max(Math.min(2,lane),0);
            this.penguin.switchToLaneNumber(lane);
        },
        update: function(ev) {
            this.scoreTimer += ev.elapsed * 0.001;
            if (this.scoreTimer >= 1) {
                this.setScore(this.score + 1);
                this.scoreTimer -= 1;
            }
            this.generateIceTimer += ev.elapsed * 0.001;
            if (this.generateIceTimer >= 1) {
                var ice;
                this.generateIceTimer -= 1;
                ice = new Ice(Math.floor(Math.random()*3));
                this.iceGroup.addChild(ice);
            }
            for (var i = this.iceGroup.childNodes.length - 1; i >= 0; i--) {
                var ice;
                ice = this.iceGroup.childNodes[i];
                if (ice.intersect(this.penguin)){
                    var game = Game.instance;
                    game.assets['res/Hit.mp3'].play();
                    this.iceGroup.removeChild(ice);
                    this.bgm.stop();
                    game.replaceScene(new SceneGameOver(this.score));
                    break;
                }
            }
            if (this.bgm.currentTime >= this.bgm.duration ){
                this.bgm.play();
            }

        },
        setScore:function(value){
            this.score= value;
            this.scoreLabel.text='得分<br>'+this.score;
        }
    });

    var Penguin= Class.create(Sprite,{
        initialize:function(){
            Sprite.apply(this,[30,43]);
            this.image= Game.instance.assets['res/penguinSheet.png'];
            this.animationDuration= 0;
            this.addEventListener(Event.ENTER_FRAME, this.updateAnimation);
        },
        updateAnimation:function(ev){
            this.animationDuration+= ev.elapsed * 0.001;
            if (this.animationDuration>=0.25){
                this.frame=(this.frame+1)%2;
                this.animationDuration-=0.25;
            }
        },
        switchToLaneNumber: function(lane){
            var targetX = 160 - this.width/2 + (lane-1)*90;
            this.x = targetX;
        }
    });

    var Ice= Class.create(Sprite,{
        initialize:function(lane){
            Sprite.apply(this, [48,49]);
            this.image= Game.instance.assets['res/Ice.png'];
            this.rotationSpeed=0;
            this.setLane(lane);
            this.addEventListener(Event.ENTER_FRAME, this.update);
        },
        setLane:function(lane){
            var game, distance;
            game= Game.instance;
            distance= 90;

            this.rotationSpeed= Math.random() *100 -50;
            this.x= game.width/2- this.width/2 + (lane-1)*distance;
            this.y= -this.height;
            this.rotation= Math.floor(Math.random()*360);
        },
        update: function(ev) {
            var ySpeed, game;

            game = Game.instance;
            ySpeed = 300;

            this.y += ySpeed * ev.elapsed * 0.001;
            this.rotation += this.rotationSpeed * ev.elapsed * 0.001;
            if (this.y > game.height) {
                this.parentNode.removeChild(this);
            }
        }
    });
    var SceneGameOver= Class.create(Scene,{
        initialize:function(score){
            var gameOverLabel, scoreLabel;
            Scene.apply(this);
            this.backgroundColor='black';

            gameOverLabel = new Label("游戏结束<br><br>点击重新开始");
            gameOverLabel.x = 8;
            gameOverLabel.y = 128;
            gameOverLabel.color = 'white';
            gameOverLabel.font = '16px strong';
            gameOverLabel.textAlign = 'center';

            scoreLabel = new Label('得分<br>' + score);
            scoreLabel.x = 9;
            scoreLabel.y = 32;
            scoreLabel.color = 'white';
            scoreLabel.font = '16px strong';
            scoreLabel.textAlign = 'center';

            this.addChild(gameOverLabel);
            this.addChild(scoreLabel);
            this.addEventListener(Event.TOUCH_START, this.touchToRestart);

        },
        touchToRestart: function(ev) {
            var game = Game.instance;
            game.replaceScene(new gameScene());
        }


    })

};