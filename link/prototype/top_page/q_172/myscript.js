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


// 問題1.7.2 振り子と杭_______________________________________
var q172 = function(_p5)
{
	//about create world
	var canvas, engine, world;
	var g	= 0.001;
	//bodies
	var ball, p1, p2;

	var L		= 200,
		d		= 40,
		theta	= Math.PI/9,
		h1_0, 
		h2_0;

	var cnt		= 0,
		Xp		= 0,
		vp  	= 0,
		reached	= 0;

	var EngineSwitch	= 0,
		L_fixed			= 0;

	_p5.setup =function()
	{
		canvas			= _p5.createCanvas(500, 500);
		engine			= Engine.create();
		world			= engine.world;
		world.gravity	= {x:0, y:0, scale:0};
		
		_p5.noFill();
		_p5.strokeWeight(1.5);
		_p5.stroke(0);

		p1		= new fixedPoint( _p5.width/2, _p5.height/5, 1.5, 0 );
		p2		= new fixedPoint( _p5.width/2, _p5.height/5+d, 2, 255 );
		ball	= new Particle( _p5.width/2-L*Math.sin(theta), _p5.height/5+L*Math.cos(theta), 5);

		//create slider for theta
		slider_theta = _p5.createSlider( Math.PI/9, Math.PI/2, Math.PI/9, Math.PI/360 );
		slider_theta.position( _p5.width/6, _p5.height-140);
		slider_theta.style('width', '200px');

		//create slider for L
		slider_L = _p5.createSlider( 80, 200, 200, 1 );
		slider_L.position( _p5.width/6, _p5.height-100 );
		slider_L.style('width', '200px');

		//L-fix button
		button_L = _p5.createButton('OK');
		button_L.position( _p5.width-170, _p5.height-105 );
		button_L.mousePressed(L_FIX);
		function L_FIX()
		{
			if( L_fixed == 0 )
				L_fixed = 1;
		}

	};


	_p5.draw =function()
	{
		_p5.background('white');

		if( EngineSwitch==0 )
		{
			if ( L_fixed == 0)
			{
				L		= slider_L.value();
				theta	= slider_theta.value();
				d		= (3/5)*L;
				p2.body.position.y = p1.body.position.y + d;
				Body.setPosition( ball.body, {x:_p5.width/2 - L*Math.sin(theta), y:_p5.height/5 + L*Math.cos(theta)} );
			}
			if( L_fixed == 1 )
			{
				slider_d = _p5.createSlider( (1/5)*L, (4/5)*L, (3/5)*L, (1/100)*L );
				slider_d.position( _p5.width/6, _p5.height-60 );
				slider_d.style('width', '200px');

				//start button
				button_RUN = _p5.createButton('RUN');
				button_RUN.position( _p5.width/6 -100, _p5.height-100 );
				button_RUN.mousePressed(RUN);
				function RUN()
				{
					if( EngineSwitch == 0 )
					{
						Engine.run(engine);
						EngineSwitch = 1;
					}
				}

				L_fixed++;
			}
			if( L_fixed >= 1 )
			{
				d = slider_d.value();
				p2.body.position.y = p1.body.position.y + d;
				h1_0	= ball.body.position.y - p1.body.position.y;
				h2_0	= ball.body.position.y - p2.body.position.y;
			}
		}
		var n_theta = theta/Math.PI*362;
		_p5.text( n_theta.toFixed(0), 340, 360 );
		var	n_d = d/L*5;
		_p5.text( n_d.toFixed(1), 345, 440 );

		document.getElementById("kui").style.top = p1.body.position.y + d -30 +"px";
		document.getElementById("d").style.top = p1.body.position.y + d/2 -30 +"px";
		var mx = p1.body.position.x -L*_p5.sin(theta) -22*_p5.sin(theta),
			my = p1.body.position.y +L*_p5.cos(theta)-30 +22*_p5.cos(theta);
		document.getElementById("m").style.left = mx +"px";
		document.getElementById("m").style.top = my +"px";
		var Lx = p1.body.position.x -L*_p5.sin(theta)/2 -35*Math.cos(theta),
			Ly = p1.body.position.y +L*_p5.cos(theta)/2 -35*Math.sin(theta);
		document.getElementById("L").style.left = Lx +"px";
		document.getElementById("L").style.top = Ly +"px";
		var thx = p1.body.position.x -10*_p5.sin(theta)-20*Math.sin(theta),
			thy = p1.body.position.y +10*_p5.cos(theta);
		document.getElementById("theta").style.left = thx +"px";
		document.getElementById("theta").style.top = thy +"px";


		var m		= ball.body.mass,
			h1		= ball.body.position.y - p1.body.position.y,
			h2		= ball.body.position.y - p2.body.position.y,

			r1		= Vector.add( ball.body.position, Vector.neg(p1.body.position) ),
			r2		= Vector.add( ball.body.position, Vector.neg(p2.body.position) ),
			e_r1	= Vector.normalise( r1 ),
			e_r2	= Vector.normalise( r2 ),
			L1		= Vector.magnitude( r1 ),
			L2		= Vector.magnitude( r2 ),

			T1		= Vector.mult( e_r1, -(m*g/L)*(3*h1-2*h1_0) ),
			T2		= Vector.mult( e_r2, -(m*g/(L-d))*(3*h2-2*h2_0) ),
			W		= Vector.create( 0, m*g ),
			X		= ball.body.position.x - _p5.width/2;

		//default drawing
		_p5.push();
			//default position
			_p5.translate( p1.body.position.x, p1.body.position.y );
			_p5.push();
				_p5.fill('white');
				_p5.arc( 0, 0, 40, 40, Math.PI/2, Math.PI/2+theta );
				_p5.stroke('silver');
				_p5.line( 0, 0, -L*_p5.sin(theta), L*_p5.cos(theta) );
				_p5.ellipse( -L*_p5.sin(theta), L*_p5.cos(theta), 10 );
			_p5.pop();
			//arrow of R
			_p5.push();
				_p5.translate( 20, 0 );
				_p5.line( 0, 0, 0, d );
				_p5.triangle( 0, 0, 2, 5, -2, 5 );
				_p5.translate( 0, d );
				_p5.triangle( 0, 0, 2, -5, -2, -5 );
			_p5.pop();
			//perpendicular line
			dottedLine( 0, 0, 0, L, L/2 );
		_p5.pop();

		//counter
		if( X*Xp<0 && p2.body.position.y<ball.body.position.y )
		{
			if( 0<X )	cnt++;
			else		cnt--;
		}
		Xp	= X;

		//apply force
		var theta1 = Math.acos( h1/L );
		var theta2 = Math.acos( h2/(L-d) );
		if( cnt==0 )
		{
			if( L1 < L*(80/100) || L*(150/100) < L1 )
			{
				ball.body.force = W;
				World.clear( world, true );
			}
			else
			{
				ball.body.force = Vector.add( W, T1 );
				_p5.line( p1.body.position.x, p1.body.position.y, ball.body.position.x, ball.body.position.y);
			}
		}
		
		if( 1<=cnt )
		{
			if( L2 < (L-d)*(95/100) || (L-d)*(150/100) < L2 )
			{
				ball.body.force = W;
				setTimeout( WorldClear , 200 );
			}
			else
			{
				ball.body.force = Vector.add( W, T2 );
				_p5.line( p2.body.position.x, p2.body.position.y, ball.body.position.x, ball.body.position.y );
				
				_p5.push();
					_p5.translate( p1.body.position.x, p1.body.position.y );
					_p5.line( 0, 0, 0, d );
				_p5.pop();
				var	v	= ball.body.velocity.x;
				if( v*vp<0 && p2.body.position.y<ball.body.position.y )
				{
					WorldClear();
					reached++;
				}
				vp = v;
			}
		}

		if( reached == 1 )
		{
			_p5.push();
				_p5.stroke('teal');
				var def_x = p1.body.position.x-L*_p5.sin(theta),
					def_y = p1.body.position.y+L*_p5.cos(theta);
				dottedLine( def_x, def_y, ball.body.position.x, ball.body.position.y, L/4 );
			_p5.pop();
		}

		ball.show();
		p1.show();
		p2.show();
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
				_p5.ellipse( this.body.position.x, this.body.position.y, 2*r);
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

	function WorldClear()
	{
		World.clear( world, true );
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
