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
		var canvas		= _p5.createCanvas( window.parent.screen.width, window.parent.screen.height*2);
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



// 問題1.7.1 半円筒面_______________________________________
var q171 = function(_p5)
{
	var engine;
	var world;
	var g	= 0.001;
	var dt	= 50/3;
	var pointO, ball;
	var R = 60;

	var L, d, theta, h1_0, h2_0, Dy;
	var m, v, h1, h2, L1, L2, v_0;
	var v_01;
	var r, e_r, NN, W;

	var cnt=0, Np=0, X, Xp=0;
	var logx = [],
		logy = [];
	var x_stop, y_stop, theta_stop;

	_p5.setup =function()
	{
		var canvas = _p5.createCanvas(300, 260);
		engine	= Engine.create();
		world	= engine.world;
		setTimeout( engineRun, 3500 );
		world.gravity = {x:0, y:0, scale:0};
		_p5.noFill();
		_p5.strokeWeight(1.5);
		_p5.stroke(0);

		v_0		= _p5.sqrt(7*g*R/2)*dt*1.011;
		v_01	= v_0 / dt;
		pointO	= new fixedPoint( _p5.width/2, _p5.height*(9/10)-R, 1.2, 'black' );
		ball	= new Particle( _p5.width*(8/10), _p5.height*(9/10), 5);
		Body.setVelocity( ball.body, { x:-v_0, y:0 } );
	};

	_p5.draw =function()
	{
		_p5.background(255);
		_p5.push();
			_p5.translate( _p5.width*(8/10), _p5.height*(9/10) );
			_p5.ellipse( 0, 0, 10, 10 );
			_p5.push();
				_p5.strokeWeight(1);
				_p5.line( 5, 0, 0, 5 );
				_p5.line( -5, 0, 0, -5 );
				_p5.rotate( -_p5.PI/4 );
				_p5.line( -5, 0, 5, 0 );
			_p5.pop();
			_p5.translate( 0, -15);
			_p5.line( -15, 0, 15, 0 );
			_p5.triangle( -15,0, -10,2, -10,-2 );
		_p5.pop();
		
		//drawing half pipe
		_p5.push();
			dotedLine( _p5.width/2, _p5.height*(9/10)-R, _p5.width/2-R-5, _p5.height*(9/10)-R, R/2 );
			dotedLine( _p5.width/2, _p5.height*(9/10)-2*R-5, _p5.width/2, _p5.height*(9/10)+5, R );
		_p5.pop();
		_p5.line( _p5.width/2, _p5.height*(9/10)+6, _p5.width*(9/10), _p5.height*(9/10)+6 );
		_p5.arc( _p5.width/2, _p5.height*(9/10)-R, 2*(R+6), 2*(R+6), _p5.HALF_PI, (3/2)*_p5.PI );

		//right angle
		_p5.push();
			_p5.strokeWeight(1.2);
			_p5.translate( _p5.width/2, _p5.height*(9/10)+4 );
			_p5.line( 7, 0, 7, -7);
			_p5.line( 0, -7, 7, -7);
			_p5.translate( 0, -R-3 );
			_p5.line( -7, 0, -7, 7);
			_p5.line( 0, 7, -7, 7);
		_p5.pop();

		//drawing arrow for d
		_p5.push();
				_p5.translate( pointO.body.position.x*(6/5), pointO.body.position.y );
				_p5.line( 0, 0, 0, -R/4 );
				_p5.line( 0, -R*(3/4), 0, -R );
				_p5.triangle( 0, 0, R/40, -R/20, -R/40, -R/20 );
				_p5.translate( 0, -R );
				_p5.triangle( 0, 0, R/40, R/20, -R/40, R/20 );
		_p5.pop();

		//drawing point A,B,C
		_p5.push();
			_p5.fill('black');
			_p5.translate( pointO.body.position.x, pointO.body.position.y );
			_p5.ellipse( 0, R+6, 3, 3 );
			_p5.ellipse( 0, -R-6, 3, 3 );
			_p5.ellipse( -R-6, 0, 3, 3 );
		_p5.pop();

		if( 0<_p5.asin(Dy/R) && _p5.asin(Dy/R) <_p5.HALF_PI && cnt<3 )
		{
			dotedLine( pointO.body.position.x, pointO.body.position.y, ball.body.position.x, ball.body.position.y, R/2 );
			_p5.arc( pointO.body.position.x, pointO.body.position.y, 30, 30, _p5.PI, _p5.PI+_p5.asin(Dy/R) );
			x_stop		= ball.body.position.x;
			y_stop		= ball.body.position.y;
			theta_stop	= _p5.asin(Dy/R);
		}
		if(3<=cnt)
		{
			dotedLine( pointO.body.position.x, pointO.body.position.y, x_stop, y_stop, R/2 );
			_p5.arc( pointO.body.position.x, pointO.body.position.y, 30, 30, _p5.PI, _p5.PI+theta_stop );
			_p5.push();
				_p5.fill('black');
				_p5.ellipse( x_stop-3, y_stop-3, 3, 3 );
			_p5.pop();
			if( cnt==3 )
				f();
		}

		if( ball.body.position.y<_p5.height*(9/10) && cnt>=3 )
		{
			logx.push( ball.body.position.x );
			logy.push( ball.body.position.y );

			for( var j=0; j<logy.length; j++ )
			{
				if( j%2 )
					_p5.ellipse( logx[j], logy[j], 0.5, 0.5 );
			}
		}

		if ( _p5.height*(9/10)-R*(3/2) < ball.body.position.y && cnt>=3 )
		{
			World.clear(world, true);
		}


		m	= ball.body.mass;
		Dy	= pointO.body.position.y - ball.body.position.y;

		r	= Vector.add( ball.body.position, Vector.neg(pointO.body.position) );
		e_r	= Vector.normalise( r );
		R1	= Vector.magnitude( r );
		N	= (m/R)*( v_01*v_01 - g*(2*R+3*Dy) );
		NN	= Vector.mult( e_r, -N );
		W	= Vector.create( 0, m*g );

		if( N*Np < 0)
			cnt+=2;
		Np	= N;

		X = ball.body.position.x - _p5.width/2;
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
		{
			ball.body.force = W;
			_p5.push();
				_p5.strokeWeight(1);
				_p5.textSize(11);
				_p5.text( "30°", 110, 170 );
			_p5.pop();
		}

		if( cnt==0 || cnt==2 )
		{
			ball.body.force.x = 0;
			ball.body.force.y = 0;
		}

		pointO.show();
		ball.show();
	};


	function engineRun()
	{
		Engine.run(engine);
	}

	// my functions____________________________________________
	function dotedLine(x1, y1, x2, y2, n)
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

	function dotedArc( x, y, r, start, stop, n )
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



// 問題1.7.2 振り子と杭_______________________________________
var q172 = function(_p5)
{
	var engine;
	var world;
	var g = 0.001;

	var ball, p1, p2;

	var L, d, theta, h1_0, h2_0;
	var m, h1, h2, L1, L2;
	var r1, r2, e_r1, e_r2, T1, T2, W;

	var cnt =0, vp=0, v;

	var rotated = false;
	var n=5;

	_p5.setup =function()
	{
		var canvas = _p5.createCanvas(180, 180);
		engine	= Engine.create();
		world	= engine.world;
		//Engine.run(engine);
		setTimeout( engineRun, 3500 );
		world.gravity = {x:0, y:0, scale:0};
		_p5.noFill();
		_p5.strokeWeight(1.5);
		_p5.stroke(0);

		//default
		L		= 120;
		d		= 3*L/5;
		theta	= _p5.PI/5;

		p1		= new fixedPoint( _p5.width/2, _p5.height/n, 1.5, 0 );
		p2		= new fixedPoint( _p5.width/2, _p5.height/n+d, 2, 255 );
		ball	= new Particle( _p5.width/2-L*_p5.sin(theta), _p5.height/n+L*_p5.cos(theta), 5);

		h1_0	= ball.body.position.y - p1.body.position.y;
		h2_0	= ball.body.position.y - p2.body.position.y;
	};


	_p5.draw =function()
	{
		_p5.background('white');
		m	= ball.body.mass;
		h1	= ball.body.position.y - p1.body.position.y;
		h2	= ball.body.position.y - p2.body.position.y;

		r1	= Vector.add( ball.body.position, Vector.neg(p1.body.position) );
		r2	= Vector.add( ball.body.position, Vector.neg(p2.body.position) );
		e_r1	= Vector.normalise( r1 );
		e_r2	= Vector.normalise( r2 );
		L1	= Vector.magnitude( r1 );
		L2	= Vector.magnitude( r2 );

		T1	= Vector.mult( e_r1, -(m*g/L)*(3*h1-2*h1_0) );
		T2	= Vector.mult( e_r2, -(m*g/(L-d))*(3*h2-2*h2_0) );
		W	= Vector.create( 0, m*g );

		_p5.push();
			_p5.arc( p1.body.position.x, p1.body.position.y, 40, 40, _p5.HALF_PI, _p5.HALF_PI+theta );
			_p5.line( p1.body.position.x, p1.body.position.y, _p5.width/2-L*_p5.sin(theta), _p5.height/n+L*_p5.cos(theta) );
			//d
			_p5.push();
				_p5.translate( p1.body.position.x*(6/5), p1.body.position.y );
				_p5.line( 0, 0, 0, d );
				_p5.triangle( 0, 0, d/40, d/20, -d/40, d/20 );
				_p5.translate( 0, d );
				_p5.triangle( 0, 0, d/40, -d/20, -d/40, -d/20 );
			_p5.pop();
			_p5.fill('white');
			_p5.ellipse( _p5.width/2-L*_p5.sin(theta), _p5.height/n+L*_p5.cos(theta), 10 );
			dotedLine( p1.body.position.x, p1.body.position.y, p1.body.position.x, p1.body.position.y+L, 60 );
			//dotedLine( _p5.width/2-L*_p5.sin(theta), _p5.height/n+L*_p5.cos(theta), _p5.width/2+L*_p5.sin(theta), _p5.height/n+L*_p5.cos(theta), 50 );
		_p5.pop();

		if( ball.body.position.x < _p5.width/2  &&  rotated == false )
		{
			if( L1 < L*(80/100) || L*(150/100) < L1 )
				ball.body.force = W;
			else
			{
				ball.body.force = Vector.add( W, T1 );
				dotedLine(  p1.body.position.x, p1.body.position.y, ball.body.position.x, ball.body.position.y, 60 );
				dotedArc( p1.body.position.x, p1.body.position.y, L, _p5.acos(h1_0/L)+_p5.PI/2, _p5.acos(h1/L)+_p5.PI/2, 30*( 1 - _p5.acos(h1/L) / _p5.acos(h1_0/L) ) );
			}
		}
		else
		{
			if( L2 < (L-d)*(80/100) || (L-d)*(150/100) < L2 )
				ball.body.force = W;
			else
			{
				ball.body.force = Vector.add( W, T2 );
				dotedLine( p2.body.position.x, p2.body.position.y, ball.body.position.x, ball.body.position.y, 30 );
				dotedArc( p2.body.position.x, p2.body.position.y, L-d, _p5.PI/2, _p5.PI/2-_p5.acos(h2/(L-d)), 30*( _p5.acos(h2/(L-d)) / _p5.acos(h2_0/(L-d)) ) );
			}
			dotedArc( p1.body.position.x, p1.body.position.y, L, _p5.acos(h1_0/L)+_p5.PI/2, _p5.PI/2, 30 );
		}

		if( ball.body.position.y<p2.body.position.y && ball.body.velocity.x<0 )
			rotated = true;

		v	= ball.body.velocity.y;
		if( v*vp < 0)
			cnt++;
		vp	= v;

		if(2<=cnt)
			World.clear( world, true);

		ball.show();
		p1.show();
		p2.show();
	};

	// my functions____________________________________________
	function dotedLine(x1, y1, x2, y2, n)
	{
		for( var i=0; i<n; i++)
		{
			lx = x2 - x1;
			ly = y2 - y1;
			_p5.push();
				_p5.translate( x1, y1 );
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

	function dotedArc( x, y, r, start, stop, n )
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

	function engineRun()
	{
		Engine.run(engine);
	}
};
var myp5_2 = new p5(q172, 'q_172_img');


showBox();
var timerId;
// ボックスを表示して、タイマーを開始
function showBox() {
   document.getElementById("loading").style.display = "block"; // ボックスを表示
   timerId = setTimeout( closeBox , 3000 ); // タイマーを開始
}
// ボックスを消して、タイマーを終了
function closeBox() {
   document.getElementById("loading").style.display = "none"; // ボックスを消す
   document.getElementById("contents").style.display = "block";
   clearTimeout( timerId ); // タイマーを終了
}
