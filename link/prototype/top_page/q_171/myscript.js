// module aliases
var Engine		= Matter.Engine,
	World		= Matter.World,
	Constraint	= Matter.Constraint,
	Body		= Matter.Body,
	Bodies		= Matter.Bodies,
	Vector		= Matter.Vector,
	Vertices	= Matter.Vertices;


// loading________________________________________________
var loading = function(_p5)
{
	var engine;
	var world;
	var g = 0.001;
	var ball, p1, spring;
	_p5.setup =function()
	{
		var canvas		= _p5.createCanvas( window.parent.screen.width, window.parent.screen.height );
		engine			= Engine.create();
		world			= engine.world;
		world.gravity	= {x:0, y:0, scale:0};
		Engine.run(engine);
		ball	= new Particle( 450, 200, 5 );
		p1		= new fixedPoint( 450, 150, 1.5 );
	};

	_p5.draw =function()
	{
		_p5.background('black');
		_p5.strokeWeight(1.5);
		_p5.stroke('white');
		_p5.push();
			_p5.fill('white');
			_p5.noStroke();
			_p5.textSize(15);
			_p5.text("Loading...", 350, 200 );
		_p5.pop();

		ball.body.force.y = ball.body.mass*g;
		spring	= new Spring( p1.body, ball.body, 0, 5, 0.000005, 60 );
		spring.show();
		ball.show();
		p1.show();
	};

	function Particle( x, y, r )
	{
		var options=
		{
			friction: 0,
			frictionAir: 0
		}
		this.r =r;
		this.body = Bodies.circle(x, y, r, options);
		World.add(world, this.body);

		this.show = function()
		{
			var pos = this.body.position;
			var angle = this.body.angle;

			_p5.push();
				_p5.translate(pos.x, pos.y);
				_p5.rotate(angle);
				_p5.fill('black');
				_p5.ellipseMode( _p5.CENTER );
				_p5.ellipse(0, 0, r*2);
			_p5.pop();
		}
	}
	function Spring( bodyA, bodyB, offsetA, offsetB, k, l_0 )
	{
		//redefine reveaved parameters for "this."
		this.k		= k;
		this.l_0	= l_0;

		//vector B to A		:r_AB
		//nomalised r_AB	:u_AB
		//length of spring	:l
		this.r_AB	= Vector.add( bodyA.position, Vector.neg(bodyB.position) );
		this.u_AB	= Vector.normalise( this.r_AB );
		this.l		= Vector.magnitude( this.r_AB );
		this.F		= k*( this.l - l_0 );
		//force
		var otherFA	= Vector.create( bodyA.force.x, bodyA.force.y );
		var otherFB	= Vector.create( bodyB.force.x, bodyB.force.y );
		bodyA.force	= Vector.add( otherFA, Vector.mult( this.u_AB, -this.F ) );
		bodyB.force	= Vector.add( otherFB, Vector.mult( this.u_AB,  this.F ) );

		this.show = function()
		{
			_p5.push();
				_p5.fill('black');
				_p5.translate( bodyA.position.x, bodyA.position.y );
				if( bodyA.position.x < bodyB.position.x )
					_p5.rotate( _p5.atan(this.r_AB.y / this.r_AB.x) );
				else
					_p5.rotate( _p5.PI + _p5.atan(this.r_AB.y / this.r_AB.x) );
				//define const for drawing
				var ex		= 10;
				var n		= 6;
				var l_wound	= this.l - ( 2*ex + offsetA + offsetB );
				//draw liner part
				_p5.line( offsetA, 0, offsetA+ex, 0 );
				_p5.line( this.l-(offsetB+ex), 0, this.l-offsetB, 0 );
				//draw wound part
				for( var i=0; i<n; i++)
						_p5.arc( (offsetA+ex) + l_wound*( (i+1)/n - 1/(2*n) ), 0, l_wound/n, 20, _p5.PI, _p5.TWO_PI );
			_p5.pop();
		}
	}
	function fixedPoint( x, y, r )
	{
		var options=
		{
			isStatic		:true,
			collisionFilter	:0
		}
		this.body = Bodies.circle(x, y, 0.5, options);
		World.add(world, this.body);

		this.show = function()
		{
			_p5.push();
				_p5.fill( 'white' );
				_p5.ellipseMode( _p5.CENTER );
				_p5.ellipse(x, y, 2*r);
			_p5.pop();
		}
	}
};
var myp5_0 = new p5(loading, 'loading');


// main img_______________________________________________
var q171 = function(_p5)
{
	//about create world
	var canvas, engine, world;
	var g	= 0.001,
		dt	= 50/3;
	//bodies
	var pointO, ball;
	//default parameters
	var R 		= 80,
		size	= 5,
		V0		= Math.sqrt(7*g*R/2)*dt*0.988,
		V0_crct	= V0 / dt;
	//dynamic parameter
	var x_record = [],
		y_record = [];
	var x_stop, y_stop, theta_stop;
	var Xp	= 0, Np	= 0;
	var cnt	= 0;
	var sw_r = 0;

	_p5.setup =function()
	{
		canvas			= _p5.createCanvas(400, 300);
		engine			= Engine.create();
		world			= engine.world;
		world.gravity	= { x:0, y:0, scale:0 };
		_p5.noFill();
		_p5.strokeWeight(1.5);
		_p5.stroke('black');

		pointO	= new fixedPoint( _p5.width/2, _p5.height/2, 1.2, 'black' );
		ball	= new Particle( _p5.width/2 + 2*R, _p5.height/2+R, size );
		//slider
		slider = _p5.createSlider( 0, 10, 7, 0.01 );
		slider.position( _p5.width/3, _p5.height);
		slider.style('width', '200px');
		//button
		button1 = _p5.createButton('RUN');
		button1.position( _p5.width/3 -50, _p5.height );
		button1.mousePressed(run);
		function run()
		{
			if(sw_r == 0 )
			{
				Body.setVelocity( ball.body, { x:-V0, y:0 } );
				Engine.run(engine);
				sw_r = 1;
			}
		}
	};

	_p5.draw =function()
	{
		_p5.background(255);
		var val = slider.value();
		V0		= Math.sqrt(val*g*R/2)*dt*0.988;
		V0_crct	= V0 / dt;
		_p5.text(  val.toFixed(1), 370, 170 );


		//default position
		_p5.push();
			//ball
			_p5.translate( _p5.width/2 + 2*R, _p5.height/2+R );
			_p5.push();
				_p5.stroke( 'silver' );
				_p5.ellipse( 0, 0, 10, 10 );
				_p5.strokeWeight(1);
				_p5.line( size, 0, 0, size );
				_p5.line( -size, 0, 0, -size );
				_p5.rotate( -_p5.PI/4 );
				_p5.line( -size, 0, size, 0 );
			_p5.pop();
			//arrow of V0
			_p5.translate( 0, -15);
			_p5.line( -15, 0, 15, 0 );
			_p5.triangle( -15,0, -10,2, -10,-2 );
		_p5.pop();

		//drawing half pipe
		_p5.push();
			//course
			_p5.translate( _p5.width/2, _p5.height/2 );
			_p5.line( 0, R+size, (R+size)*2, R+size );
			_p5.arc( 0, 0, 2*(R+size), 2*(R+size), _p5.HALF_PI, (3/2)*_p5.PI );
			//dotted lines
			dottedLine( 0, 0, -(R+size), 0, R/2 );
			dottedLine( 0, -(R+size), 0, (R+size), R );
			//drawing point A,B,C
			_p5.ellipse( 0, R+size, 3, 3 );
			_p5.ellipse( 0, -(R+size), 3, 3 );
			_p5.ellipse( -(R+size), 0, 3, 3 );
			//right angle mark
			_p5.strokeWeight(1.2);
			var sq =7;
			_p5.line( 0, sq, -sq, sq );
			_p5.line( -sq, sq, -sq, 0 );
			_p5.push();
				_p5.translate( 0, R+size );
				_p5.line( 0, -sq, sq, -sq );
				_p5.line( sq, -sq, sq, 0 );
			_p5.pop();
			//arrow of R
			_p5.push();
				_p5.translate( R/4, 0 );
				_p5.line( 0, 0, 0, -(R+size)/3 );
				_p5.line( 0, -(R+size)*(2/3), 0, -(R+size) );
				_p5.triangle( 0, 0, R/40, -R/20, -R/40, -R/20 );
				_p5.translate( 0, -(R+size) );
				_p5.triangle( 0, 0, R/40, R/20, -R/40, R/20 );
			_p5.pop();
		_p5.pop();

		//dynamic theta drawing
		var Dy		= pointO.body.position.y - ball.body.position.y;
		var theta	= Math.asin(Dy/R);
		//followig
		if( 0<theta && theta<Math.PI/2 && cnt<3 )
		{
			_p5.push();
				_p5.translate( pointO.body.position.x, pointO.body.position.y );
				dottedLine( 0, 0, -R*Math.cos(theta), -Dy, R/2 );
				_p5.arc( 0, 0, 30, 30, Math.PI, Math.PI+theta );
			_p5.pop();
			x_stop		= -R*Math.cos(theta);
			y_stop		= -Dy;
			theta_stop	= theta;

			var offset = 0 ;
			if( theta< Math.PI/12 ) offset=30;
			var Px = pointO.body.position.x - R*Math.cos(theta)- 30*Math.cos(theta) +offset;
				Py = pointO.body.position.y - Dy - 30*Math.sin(theta) -offset/2;
			document.getElementById("P").style.left = Px +"px";
			document.getElementById("P").style.top = Py +"px";
		}
		//after release
		if( 3<=cnt )
		{
			_p5.push();
				_p5.translate( pointO.body.position.x, pointO.body.position.y );
				dottedLine( 0, 0, x_stop, y_stop, R/2 );
				_p5.arc( 0, 0, 30, 30, Math.PI, Math.PI+theta_stop );
				//release point: P
				_p5.fill('black');
				_p5.ellipse( x_stop-size*Math.cos(theta_stop), y_stop-size*Math.sin(theta_stop), 3, 3 );
				if( cnt==3 ) f();
			_p5.pop();
			//engine stop when ball collide with ground
			if( _p5.height/2+R-size < ball.body.position.y )
				World.clear(world, true);
			var y_in = Math.sqrt( R*R - (pointO.body.position.x-ball.body.position.x)*(pointO.body.position.x-ball.body.position.x) );
			if( ball.body.position.x<pointO.body.position.x && pointO.body.position.y+y_in-size < ball.body.position.y )
				World.clear(world, true);
		}

		//ball's afterimage
		if( ball.body.position.y < _p5.height/2+R+size  &&  3<=cnt )
		{
			x_record.push( ball.body.position.x );
			y_record.push( ball.body.position.y );
			for( var j=0; j<y_record.length; j++ )
			{
				if( j%2 )
				{
					_p5.push();
					_p5.stroke('darkslateblue');
					_p5.ellipse( x_record[j], y_record[j], 1, 1 );
					_p5.pop();
				}
			}
		}

		var m		= ball.body.mass,
			r		= Vector.add( ball.body.position, Vector.neg(pointO.body.position) ),
			e_r		= Vector.normalise( r ),
			R_now	= Vector.magnitude( r ),
			N		= (m/R)*( Math.pow(V0_crct,2) - g*(2*R+3*Dy) ),
			NN		= Vector.mult( e_r, -N ),
			W		= Vector.create( 0, m*g ),
			X		= ball.body.position.x - _p5.width/2;

		if( N*Np < 0)
			cnt+=2;
		Np	= N;

		if( X*Xp < 0)
		{
			if( pointO.body.position.y < ball.body.position.y )
				cnt++;
			else
				cnt+=2;
		}
		Xp	= X;

		if( cnt == 1 )
			ball.body.force = Vector.add( W, NN );
		if( cnt>=3 )
			ball.body.force = W;
		if( cnt==0 || cnt==2 )
		{
			ball.body.force.x = 0;
			ball.body.force.y = 0;
		}

		pointO.show();
		ball.show();
	};

	// my functions____________________________________________
	function dottedLine(x1, y1, x2, y2, n)
	{
		for( var i=0; i<n; i++)
		{
			lx = x2 - x1;
			ly = y2 - y1;
			_p5.push();
				_p5.translate( x1, y1 );
				_p5.stroke('dimgray');
				_p5.strokeWeight(1);
				_p5.fill(0);
				if(i%2)
					_p5.ellipse( lx*(i/n), ly*(i/n), 0.5 );
			_p5.pop();
		}
	}
	function Particle( x, y, r )
	{
		var options=
		{
			friction: 0,
			frictionAir: 0
		}
		this.r =r;
		this.body = Bodies.circle(x, y, r, options);
		World.add(world, this.body);

		this.show = function()
		{
			var pos = this.body.position;
			var angle = this.body.angle;

			_p5.push();
				_p5.translate(pos.x, pos.y);
				_p5.rotate(angle);
				_p5.fill('white');
				_p5.ellipseMode( _p5.CENTER );
				_p5.ellipse(0, 0, r*2);
				_p5.push();
					_p5.strokeWeight(1);
					_p5.line( r, 0, 0, r );
					_p5.line( -r, 0, 0, -r );
					_p5.rotate( -_p5.PI/4 );
					_p5.line( -r, 0, r, 0 );
				_p5.pop();
			_p5.pop();
		}
	}
	function fixedPoint( x, y, r, c )
	{
		var options=
		{
			isStatic		:true,
			collisionFilter	:0
		}
		this.body = Bodies.circle(x, y, 0.5, options);
		World.add(world, this.body);

		this.show = function()
		{
			_p5.push();
				_p5.fill( c );
				_p5.ellipseMode( _p5.CENTER );
				_p5.ellipse(x, y, 2*r);
			_p5.pop();
		}
	}
	function dottedArc( x, y, r, start, stop, n )
	{
		for( var i=0; i<n; i++)
		{
			var delta	= stop - start;
			_p5.push();
				_p5.translate( x, y );
				_p5.fill(0);
				if(i%2)
					_p5.ellipse( r*_p5.cos( start + delta*(i/n) ), r*_p5.sin( start + delta*(i/n) ), 0.5 );
			_p5.pop();
		}
	}
};
var myp5_1 = new p5(q171, 'q_171_img');


showBox();
var timerId;
// ボックスを表示して、タイマーを開始
function showBox() {
   document.getElementById("loading").style.display = "block"; // ボックスを表示
   timerId = setTimeout( closeBox , 5000 ); // タイマーを開始
}
// ボックスを消して、タイマーを終了
function closeBox() {
   document.getElementById("loading").style.display = "none"; // ボックスを消す
   document.getElementById("contents").style.display = "block";
   clearTimeout( timerId ); // タイマーを終了
}
