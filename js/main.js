/**
 * Created by skyler on 14-8-5.
 */
enchant();

window.onload=function(){
    var game= new Game(320, 400);
    game.preload('res/BG.png');
    game.fps= 30;
    game.scale= 1;
    game.onload=function(){
        console.log('hi, ocean!');
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
        //开始场景
        game.pushScene(scene);
    };
    game.start();
};