// module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Constraint = Matter.Constraint,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Vector = Matter.Vector,
    Vertices = Matter.Vertices,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;


var imgW = document.getElementById('topLogo').clientWidth;
var imgH = document.getElementById('topLogo').clientHeight;

//sketch1
var sketch1 = function (p) {

    var engine;
    var world;
    var g = 0.001;
    var ball, ground, wallL, wallR, ceiling;
    var mConstraint;
    //setup____________________
    p.setup = function () {
        var canvas = p.createCanvas(imgW, imgH);

        //matter
        engine = Engine.create();
        world = engine.world;
        world.gravity = {
            x: 0,
            y: 0,
            scale: 0
        };
        Engine.run(engine);
        ball = new Particle(imgW * 0.725, imgH * 0.4, 8);
        ground = new Rect(imgW / 2, imgH * 1.49, imgW * 2, imgH);
        wallL = new Rect(-100, imgH / 2, 200, imgH);
        wallR = new Rect(imgW + 100, imgH / 2, 200, imgH);
        ceiling = new Rect(imgW / 2, -imgH / 2, imgW * 2, imgH);


        var canvasmouse = Mouse.create(canvas.elt);
        canvasmouse.pxelRatio = p.pixelDensity();

        var options = {
            mouse: canvasmouse
        }

        mConstraint = MouseConstraint.create(engine, options);
        World.add(world, mConstraint);
    };


    //draw____________________
    p.draw = function () {

        var x0 = imgW * 0.425;
        var y0 = imgH * 0.805;
        var ra = imgH * 0.1;
        p.background("white");
        p.stroke("black");
        p.strokeWeight(1);
        p.fill("black");
        if (p.sqrt(p.pow((x0 - ball.body.position.x), 2) + p.pow((y0 - ball.body.position.y), 2)) > ra) {
            p.line(x0, y0, ball.body.position.x, ball.body.position.y);
            var theta = p.atan((ball.body.position.y - y0) / (ball.body.position.x - x0));
            if (ball.body.position.x >= x0)
                p.arc(x0, y0, ra, ra, -p.PI / 2, theta);
            else
                p.arc(x0, y0, ra, ra, -p.PI / 2, theta + p.PI);
        }
        //matter
        ball.body.force.y = ball.body.mass * g;
        ball.body.collisionFilter.group = 2;
        ball.show();

        ground.body.collisionFilter.group = 2;
        ground.show();

        wallL.body.collisionFilter.group = 2;
        wallL.show();
        wallR.body.collisionFilter.group = 2;
        wallR.show();
        ceiling.body.collisionFilter.group = 2;
        ceiling.show();
    };

    //Particle____________________
    function Particle(x, y, r) {
        var options = {
            friction: 0.1,
            frictionAir: 0,
            restitution: 0.9
        }
        this.r = r;
        this.body = Bodies.circle(x, y, r, options);
        World.add(world, this.body);

        this.show = function () {
            var pos = this.body.position;
            var angle = this.body.angle;

            p.push();
            p.translate(pos.x, pos.y);
            p.rotate(angle);
            p.fill("black");
            p.ellipseMode(p.CENTER);
            p.ellipse(0, 0, r * 2);
            p.pop();
        }
    }

    //Rect___________________
    function Rect(x, y, w, h) {
        var options = {
            friction: 0.01,
            frictionAir: 0,
            isStatic: true
        }
        this.w = w;
        this.h = h;
        this.body = Bodies.rectangle(x, y, w, h, options)
        World.add(world, this.body);

        this.show = function () {
            var pos = this.body.position;
            var angle = this.body.angle;

            p.push();
            p.translate(pos.x, pos.y);
            p.rotate(angle);
            p.strokeWeight(0);
            p.noFill();
            p.rectMode(p.RADIUS);
            p.rect(0, 0, w / 2, h / 2);
            p.pop();
        }
    }

};
new p5(sketch1, "container1");

/*

$(document).ready(function () {
    $(window).scroll(function () {

        var CoHeight = $('body').height(); //ページ全体の高さ代入
        var Scrolly = $(window).scrollTop(); //スクロール位置代入

        var percent1 = CoHeight / 100; //1%を計算
        var percentAll = (Scrolly * 1.6) / percent1; //スクロール位置を1％で割る＆誤差補正

        var percentFin = Math.round(percentAll); //小数点を四捨五入
        if (percentFin > 100) percentFin = 100; //100%以上加算されないように制御

        $(".percent_text").html("<span>" + percentFin + "</span>%"); //パーセントを数字で表示
        $(".percent_block .string").css("height", percentFin + "%"); //パーセントをバーで表示
        $(".opposite_block .string").css("height", 100 - percentFin + "%"); //パーセントをバーで表示
    });
});

*/
