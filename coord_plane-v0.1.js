
function kjs_coord_plane(f) {
	//var a = 1;
	this.layer = f.layer;

	this.width = typeof f.width !== 'undefined' ? f.width : 500;  	//in pixels
	this.height = typeof f.height !== 'undefined' ? f.height : 500; //in pixels
	//this.padding = typeof f.padding !== 'undefined' ? f.padding : 0; //to scale axes

	this.x0 = typeof f.x0 !== 'undefined' ? f.x0 : Math.floor(this.width/2);	//in pixels
	this.y0 = typeof f.y0 !== 'undefined' ? f.y0 : Math.floor(this.height/2);	//in pixels

	this.xmin = typeof f.xmin !== 'undefined' ? f.xmin : -10;
	this.xmax = typeof f.xmax !== 'undefined' ? f.xmax : 10;
	
	this.ymin = typeof f.ymin !== 'undefined' ? f.ymin : -10;
	this.ymax = typeof f.ymax !== 'undefined' ? f.ymax : 10;

	this.dx = typeof f.dx !== 'undefined' ? f.dx : 1;
	this.dy = typeof f.dy !== 'undefined' ? f.dy : 1;

	this.xSigFigs = typeof f.xSigFigs !== 'undefined' ? f.xSigFigs : 1;
	this.ySigFigs = typeof f.ySigFigs !== 'undefined' ? f.ySigFigs : 1;

	this.input_div_id = typeof f.input_div_id !== 'undefined' ? f.input_div_id : "input"; //to scale axes
	this.input_div = "#"+this.input_div_id;

	this.xy_scale = typeof f.xy_scale !== 'undefined' ? f.xy_scale : 1; //to scale axes
	this.set_scale();
	
	this.active_interface = "none";
	
	//draw axes
	this.draw_xaxis({});
	this.draw_yaxis({});
	//alert('adding layer');
	
	this.point_labels = [];
	
	//set up for lines
	this.polys = [];
	this.npolys = 0;
	
	this.points = [];
	this.npoints = 0;
	this.active_point = null;
}



kjs_coord_plane.prototype.set_scale = function() {
	this.x_scale = 	this.width/(this.xmax-this.xmin);
	this.y_scale = 	this.height/(this.ymax-this.ymin);
}

kjs_coord_plane.prototype.xpx = function(x) { 
	//alert("x= "+x+" : "+ this.x0 + " : "+this.x_scale+" : "+ (this.x0+(x*this.x_scale))); 
	return this.x0+(x*this.x_scale);	
}
kjs_coord_plane.prototype.ypx = function(y) {  return this.y0-(y*this.y_scale);	}
      
kjs_coord_plane.prototype.xval = function(xpx) {  return (xpx-this.x0)/this.x_scale;	}
kjs_coord_plane.prototype.yval = function(ypx) {  return (this.y0-ypx)/this.y_scale;	}


kjs_coord_plane.prototype.draw_xaxis = function(f) {
	var dx = typeof f.dx !== 'undefined' ? f.dx : this.dx;
		
	var l_tics = typeof f.l_tics !== 'undefined' ? f.l_tics : true;
	var l_grid = typeof f.l_grid !== 'undefined' ? f.l_grid : true;
	
	//Draw axis line
	var xline = new Kinetic.Line({
    	points: [this.xpx(this.xmin), this.ypx(0), this.xpx(this.xmax), this.ypx(0)],
    	//points: [0, 250, 500, 250],
    	stroke: "black",
    	strokeWidth: 3,
    	lineCap: "square",
    });
	this.layer.add(xline);
	
	if (l_tics) {
		for (var x=this.xmin; x<=this.xmax; x+=dx) {
			//alert ("x= "+x+" "+this.plane.xpx(x));
			var tick = new Kinetic.Line({
    			points: [this.xpx(x),this.ypx(0), this.xpx(x), this.ypx(0)+7],
    			stroke: "black",
    			strokeWidth: 1,
    			lineCap: "square",
    		});
    		this.layer.add(tick);
    		
    		
    		if (x != 0) {
				if (l_grid) {
					var gridline = new Kinetic.Line({
	    				points: [this.xpx(x),this.ypx(this.ymin), this.xpx(x), this.ypx(this.ymax)],
	    				stroke: "#aaa",
	    				strokeWidth: 1,
	    				lineCap: "square",
	    			});
	    			this.layer.add(gridline);

					
				}
				
				var tic_label = new Kinetic.Text({
		    		x: this.xpx(x) ,
		    		y: this.ypx(0)+15,
		    		text: this.format_axis_number(x),
		    		fontSize: 10,
		    		fontFamily: "Calibri",
		    		textFill: "green",
		    		align: 'center',
		    	});
	    		this.layer.add(tic_label);




    		}

	
		}	
		
	}
	

		
}

kjs_coord_plane.prototype.draw_yaxis = function(f) {
	var dy = typeof f.dy !== 'undefined' ? f.dy : this.dy;
	var l_tics = typeof f.l_tics !== 'undefined' ? f.l_tics : true;
	var l_grid = typeof f.l_grid !== 'undefined' ? f.l_grid : true;
	
	//alert("x(-10): "+this.plane.xpx(this.xmin));
	var yline = new Kinetic.Line({
    	points: [this.xpx(0), this.ypx(this.ymin), this.xpx(0), this.ypx(this.ymax)],
    	//points: [0, 250, 500, 250],
    	stroke: "black",
    	strokeWidth: 3,
    	lineCap: "square",
    });
	this.layer.add(yline);

	if (l_tics) {
		//alert("dy = "+dy);
		for (var y=this.ymin; y<=this.ymax; y+=dy) {
			//alert ("y= "+y+" "+this.ypx(y)+" dy= "+dy);
			var tick = new Kinetic.Line({
    			points: [this.xpx(0),this.ypx(y), this.xpx(0)-7, this.ypx(y)],
    			stroke: "black",
    			strokeWidth: 1,
    			lineCap: "square",
    		});
    		this.layer.add(tick);
    		
    		if (Math.abs(y) >= dy/100) {
				if (l_grid) {
					var gridline = new Kinetic.Line({
	    				points: [this.xpx(this.xmin),this.ypx(y), this.xpx(this.xmax), this.ypx(y)],
	    				stroke: "#aaa",
	    				strokeWidth: 1,
	    				lineCap: "square",
	    			});
	    			this.layer.add(gridline);
				}

	    		var tic_label = new Kinetic.Text({
		    		x: this.xpx(0)-30 ,
		    		y: this.ypx(y)-5,
		    		text: this.format_axis_number(y) ,//parseInt(y), //y.toPrecision(this.ySigFigs), //this.graph.Xval(x).toPrecision(2) ,
		    		fontSize: 10,
		    		fontFamily: "Calibri",
		    		textFill: "green",
		    		align: 'left',
		    	});
	    		this.layer.add(tic_label);
    		}

	
		}	
		
	}
		
}


kjs_coord_plane.prototype.format_axis_number = function(n) {
	var nt = (dx%1.0);
	if (Math.abs(nt) >= 0.1) {
		return n.toFixed(1);
	} else {
		return parseInt(n);
	}
}

kjs_coord_plane.prototype.label_point = function(x, y) {
	
	var xtxt = x+"";
	var ytxt = y+"";
	var label_text = "("+xtxt+","+ytxt+")";
	
	//alert(label_text);
	
	var pt_label = new Kinetic.Text({
 		x: this.xpx(x)+15 ,
 		y: this.ypx(y)-15,
 		text: label_text, //this.graph.Xval(x).toPrecision(2) ,
 		fontSize: 10,
 		fontFamily: "Calibri",
 		textFill: "blue",
 		align: 'center',
 	});
	this.layer.add(pt_label);
	this.point_labels.push(pt_label);
	this.layer.draw();
}

kjs_coord_plane.prototype.add_numerical_integrator = function(f) {
	var f = typeof f !== 'undefined' ? f : {};
	var params = typeof f.params !== 'undefined' ? f.params : [0, 0, 1];
	//alert(f[0]+' : '+f[1]+' : '+f[2]);
	this.integrator = new kjs_numerical_integrator({
		interface_div_id: this.input_div,
		f: this.polys[this.polys.length-1],
		layer: this.layer,
		coords: this,
		a: parseInt(f.params[0]),
		b: parseInt(f.params[1]),
		n: parseInt(f.params[2]),
	});
	this.integrator.build_interface();
	this.integrator.draw();
	
}

kjs_coord_plane.prototype.add_polynomial = function(f) {
	//draw a polynomial: y = a_n x^n + ... + a0
	//defaults to a parabola
	
	//alert("in add_polynomial: "+ this.npolys);
	
	this.npolys += 1;

	var f = typeof f !== 'undefined' ? f : {};
	var poly_name = typeof f.name !== 'undefined' ? f.name : this.npolys+"";
	var a = typeof f.a !== 'undefined' ? f.a : [0, 0, 0];
	var dx = typeof f.dx !== 'undefined' ? f.dx : 0.1;
	var layer = typeof f.layer !== 'undefined' ? f.layer : this.layer;
	
	//alert(a);

	this.polys.push( new kjs_polynomial({
		a: a,
		dx: dx,
		xmin: this.xmin,
		xmax: this.xmax,
		layer: layer,
		coords: this,
		name: poly_name,
	}));
	
	//this.polys[poly_name].draw();
		
	return this.polys[this.polys.length-1];
	
}


kjs_coord_plane.prototype.add_points_from_list = function(f) {
	//default is comma (",") delimited
	var delimiter = typeof f.delimiter !== 'undefined' ? f.delimiter : ",";
	var xy = f.pts.split(delimiter);
	
	//var x = [];
	//var y = [];
	for (var i = 0; i < xy.length; i+=2) {
		//x.push(xy[i]);
		//y.push(xy[i+1]);
		this.add_point({
			x: xy[i],
			y: xy[i+1],
		});
	}
	this.draw_points();
	this.fill_point_select_menu();
	//return {x:x, y:y};
}


kjs_coord_plane.prototype.add_point = function(f) {
	//draw a point
	//defaults to a parabola

	var x = typeof f.x !== 'undefined' ? f.x : 0;
	var y = typeof f.y !== 'undefined' ? f.y : 0;
	var layer = typeof f.layer !== 'undefined' ? f.layer : this.layer;
	var shape = typeof f.shape !== 'undefined' ? f.shape : "circle";

	this.points.push( new kjs_point({
		x:x,
		y:y,
		layer: layer,
		coords: this,
		shape: shape,
		id: this.points.length,
		//note: if we remove points we'll need to renumber the id's
	}));
	
	//this.polys[poly_name].draw();
	//alert(this.points[this.points.length-1].x);
	return this.points[this.points.length-1];
	
}

kjs_coord_plane.prototype.draw_points = function() {
	for (var i = 0; i < this.points.length; i++){
		this.points[i].draw();
	}
}




kjs_coord_plane.prototype.build_function_type_interface = function(f) {
	var div = "#"+f.div_id;
	
	var selected_function = typeof f.selected_function !== 'undefined' ? f.selected_function : false;
	
	this.fselect_id = "function_type";
	var m = '<select id="'+this.fselect_id+'" style="position:absolute;top:0px;">';
	
	//add in the options
	m += '<option value ="none">Inputs (none)</option>';
	m += '<optgroup label="Function Type">';
	m += '<option value ="polynomial">polynomial</option>';
	m += '<option value ="points">points</option>';
	m += '</optgroup>';
	m += '<optgroup label="Calculus">';
	m += '<option value ="numerical-integration">numerical integration</option>';
	m += '</optgroup>';
	m += '</select>';
	
	$(div).append(m);
	$(div).css("height",7);
	
	//alert(selected_function);
	if (selected_function == "polynomial") {
		//alert("hello");
		$("#"+this.fselect_id).val(selected_function);
		this.build_poly_interface();
	} else if (selected_function == "points") {
		$("#"+this.fselect_id).val(selected_function);
		//alert("build poly interface");
		this.build_points_interface();
	} else if (selected_function == "numerical-integration") {
		$("#"+this.fselect_id).val(selected_function);
		//alert("build poly interface");
		this.build_integration_interface();
	} else {
		$("#"+this.fselect_id).val("none");
	}
	
	if (typeof this.integrator !== 'undefined' && selected_function != "numerical-integration" ) {
		//alert(this.integrator.keep);
		if (this.integrator.keep === false) {
			this.integrator.clear();
		}
	}
	
	$("#"+this.fselect_id).change({coords:this}, function(g){
		//alert($(this).val());
		if ($(this).val() === "polynomial") {
			//alert(g.data.coords.input_div_id);
			//*************************************************************//
			//g.data.coords.polys[g.data.coords.polys.length-1].build_poly_interface(g.data.coords.input_div_id);
			g.data.coords.build_poly_interface();
		} else if ($(this).val() === "points") {
			g.data.coords.build_points_interface();
			
		} else if ($(this).val() === "numerical-integration") {
			g.data.coords.build_integration_interface();
			
		} else {
			$(g.data.coords.input_div).html("");
		}
		
		if (typeof g.data.coords.integrator !== 'undefined' && $(this).val() !== "numerical-integration") {
			
			if (g.data.coords.integrator.keep === false) {
				g.data.coords.integrator.clear();
			}
		}
	});
	

}

kjs_coord_plane.prototype.build_integration_interface = function(f) {

	var f = typeof f !== 'undefined' ? f : {};
	var div_id = typeof f.div_id !== 'undefined' ? f.div_id : this.input_div;
			var func = typeof f.func !== 'undefined' ? f.func : this.polys[this.polys.length-1];
	var layer = typeof f.layer !== 'undefined' ? f.layer : this.layer;
		
	if (typeof this.integrator === 'undefined') {
		this.integrator = new kjs_numerical_integrator({
			interface_div_id: div_id,
			f: func,
			layer: layer,
			coords: this,
		});
	}
	
	this.integrator.build_interface();
	this.integrator.clear();
	this.integrator.draw();
	
}


kjs_coord_plane.prototype.build_points_interface = function(div_id) {
	
	var div = typeof div_id !== 'undefined' ? "#"+div_id : this.input_div;
	
	this.input_x_id = "point_x_" + this.points.length;
	this.input_y_id = "point_y_" + this.points.length;
	this.add_point_id = "add_point";
	var size = 2;
	
	this.last_x = 0;
	this.last_y = 0;
	if (this.points.length > 0) { //then load last point
		this.last_x = this.points[this.points.length-1].x;
		this.last_y = this.points[this.points.length-1].y;
	}
	
	var m = "(x, y) = (";
	m += '<input id="'+this.input_x_id+'" type="text" size="'+size+'" value="'+this.last_x+'" ></input>';
	m += ", ";
	m += '<input id="'+this.input_y_id+'" type="text" size="'+size+'" value="'+this.last_y+'" ></input>';
	m += ")";
	m += '<input id="'+this.add_point_id+'" type="button" value="Add"></input>';
	
	$(div).html(m);

	//validate
	$("#"+this.input_x_id).change({coords:this}, function(g) {
		if (isNaN($(this).val())){
			alert($(this).val()+ " is not a number. \n\n Only numbers please");
			$(this).val(g.data.coords.last_x);
		}
	});
	$("#"+this.input_y_id).change({coords:this}, function(g) {
		if (isNaN($(this).val())){
			alert($(this).val()+ " is not a number. \n\n Only numbers please");
			$(this).val(g.data.coords.last_y);
		}
	});

	$("#"+this.add_point_id).click({coords:this}, function(g) {
		//alert("adding");
		var x = $("#"+g.data.coords.input_x_id).val();
		var y = $("#"+g.data.coords.input_y_id).val();
		g.data.coords.add_point({
			x: x,
			y: y,
		}).draw();
		g.data.coords.fill_point_select_menu();

	});
	
	
	//select  point
	this.point_select_id = "point_select_id";
	var m = '<span id="point_selection_menu">';
	m += '&nbsp&nbsp&nbsp Select Point: ';
	m += '<select id="'+this.point_select_id+'" >';
	m += '</select>';
	m += '</span>';
	
	$(div).append(m);	
	
	this.fill_point_select_menu();
	
	$('#'+this.point_select_id).change({coords:this}, function(g){
		if ($(this).val() !== "none") {
			var i = parseInt($(this).val().split("_")[1]);		
			g.data.coords.select_point(i);
		}

	});
	
}

kjs_coord_plane.prototype.select_point = function(i) {
	//alert("i = "+ i);
	if ((i >= this.points.length) || (i < 0)) {
		alert("Point not defined: " + i );
	}
	
	//deactivate old active point
	if ((this.active_point !== null) && (this.active_point < this.points.length)) {	
		//alert(this.active_point);
		this.points[this.active_point].point.setStrokeEnabled(false);
	}

	//select new point
	this.points[i].point.setStrokeEnabled(true);
	this.active_point = i;
	$("#"+this.point_select_id).val("pt_"+i);
	//redraw layer
	this.layer.draw();
	
	//alert($("#"+this.point_select_id));
}

kjs_coord_plane.prototype.fill_point_select_menu = function() {
	
	$('#'+this.point_select_id).empty();
	var m = '<option value ="none" >Point # (x,y)</option>';
	//add in the options
	for (var i = 0; i < this.points.length; i++) {
		var pt_val = "pt_"+i;
		var pt_name = (i+1) + ": (" + this.points[i].x + ", " + this.points[i].y + ")";
		m += '<option value ="'+pt_val+'">'+pt_name+'</option>';
	}
	
	$('#'+this.point_select_id).html(m);
	
	if ((this.active_point !== null) && (this.active_point < this.points.length) && (this.active_point >= 0)) {
		this.select_point(this.active_point);
	}

}

kjs_coord_plane.prototype.build_poly_interface = function(div_id) {
	if (this.polys.length == 0) {
		//alert("adding");
		this.add_polynomial().draw();
	}
	this.polys[this.polys.length-1].build_poly_interface();
}

kjs_coord_plane.prototype.change_last_poly_a = function(a) {
	// a needs to b an input array of coefficients for the polynomial
	var poly = this.polys[this.polys.length-1];
	poly.a = a;
	if (animate) {
		poly.backup_a();					
		poly.draw({
			animate: true, 
			start_a: poly.old_a,
		});
	} else {
		poly.draw();
	}
}


















function kjs_point(f){
	this.x = typeof f.x !== 'undefined' ? f.x : 0;
	this.y = typeof f.y !== 'undefined' ? f.y : 0;
	this.shape = typeof f.shape !== 'undefined' ? f.shape : "circle";
	this.layer = f.layer;		
	this.coords = f.coords;		
	this.id = f.id;
		
}

kjs_point.prototype.draw = function() {
	
	if (this.shape === "circle") {
		this.point = new Kinetic.Circle({
			x: this.coords.xpx(this.x),
			y: this.coords.ypx(this.y),
			radius: 5,
			fill: 'red',
			//draggable: true,
			stroke: 'black',
			strokeWidth: 2,
			strokeEnabled: false,
			draggable: false,
		});
	}
	this.point.coords = this.coords;
	this.point.pt_id = this.id;
	this.layer.add(this.point);
	
	this.point.on("click", function() {
		this.coords.select_point(this.pt_id);
	});
		
	this.layer.draw();
}






function kjs_polynomial(f){
	//draw a polynomial: y = a_0 x^0 + ... + a_n x^n 
	//defaults to a straight line
	
	this.a = typeof f.a !== 'undefined' ? f.a : [0];
	this.dx = typeof f.dx !== 'undefined' ? f.dx : 0.1;
	this.xmin = typeof f.xmin !== 'undefined' ? f.xmin : -10.0;
	this.xmax = typeof f.xmax !== 'undefined' ? f.xmax : 10.0;
	this.name = typeof f.name !== 'undefined' ? f.name : "george";
	this.layer = f.layer;
	this.coords = f.coords;
	
	this.x = arange(this.xmin, this.xmax, this.dx);
	
		
}

kjs_polynomial.prototype.duplicate = function(x) {
	return new kjs_polynomial({
		a: this.a,
		dx: this.dx,
		xmin: this.xmin,
		xmax: this.xmax,
		name: this.name,
		layer: this.layer,
		coords: this.coords,
	});
}

kjs_polynomial.prototype.get_y = function(x) {
	var y = [];
	for (var n = 0; n = this.x.length; n++){
		y.push(this.y_val(this.x[n]));
	}
	return y;
}

kjs_polynomial.prototype.y_val = function(x) {
	var y = 0;
	for (var n = 0; n < this.a.length; n++){
		y += this.a[n] * Math.pow(x, n);
	}
	return y;
}

kjs_polynomial.prototype.draw = function(f) {
	
	
	var f = typeof f !== 'undefined' ? f : {};
	var animate = typeof f.animate !== 'undefined' ? f.animate : false;
	
	if (animate) {
		if (typeof f.start_a !== 'undefined' ) {
			this.start_a = f.start_a;
			this.final_a = [];
			for (var i=0; i<this.a.length; i++) {
				this.final_a.push(this.a[i]);
			}
		} else {
			this.start_a = [];
			this.final_a = [];
			for (var i=0; i<this.a.length; i++) {
				this.start_a.push(0);
				this.final_a.push(this.a[i]);
			}
		}
	}


	
	var pts = [];

	for (var n = 0; n < this.x.length; n++){
		//alert(n+" "+this.x[n]+" ");
		//alert(n+" "+this.x[n]+" "+this.y_val(this.x[n]));
		//alert(n+" "+this.coords.xpx(this.x[n])+" "+ this.coords.ypx(this.y_val(this.x[n])) );
		//pts.push( [ this.coords.xpx(this.x[n]), this.coords.ypx(this.y_val(this.x[n])) ] );
		pts.push( this.coords.xpx(this.x[n]) );
		pts.push( this.coords.ypx(this.y_val(this.x[n])) );
	}	
	
	if (animate) {
		//create a temporary duplicates of a
		this.old_a = typeof this.old_a !== 'undefined' ? f : {};
		
		this.old_poly = this.duplicate();
		//this.old_poly.draw();
		this.endtime = 2000;
		this.t = 0;
		this.dt = 50;
		
		tmp_poly = this;
		
		this.timer_id = setInterval(function() {
			
			tmp_poly.t += tmp_poly.dt;
			
			tmp_poly.interpolate_a(tmp_poly.t/tmp_poly.endtime);
			/*
			var outt = tmp_poly.t+':\n';
			for (var i=0; i<tmp_poly.a.length; i++) {
				outt += i+' '+tmp_poly.start_a[i]+' '+tmp_poly.final_a[i]+' '+tmp_poly.a[i]+'\n';
			}
			*/
			//alert(outt)
			
	       	tmp_poly.draw();
	       	
	       	if (tmp_poly.t >= tmp_poly.endtime) {
				//cleanup
				for (var i=0; i<tmp_poly.a.length; i++) {
					tmp_poly.a[i] = tmp_poly.final_a[i];
				}
	       		tmp_poly.draw();
				delete tmp_poly.start_a;
				delete tmp_poly.final_a;	       	
	       		clearInterval(tmp_poly.timer_id);
	       	}
	    }, this.dt);
		
		
	} else {
		if (typeof this.line !== 'undefined') {
			this.line.remove();
		}
		this.line = new Kinetic.Line({
	 		points: pts, //[0, 100, 200, 100],
	 		stroke: "red",
	 		strokeWidth: 3,
	 		lineCap: "square",
	 	});
		
		this.layer.add(this.line);
	
		this.layer.draw();
	}
	
	
	
}

kjs_polynomial.prototype.interpolate_a = function(w) {
	//w is the weighing factor
	//var outt = w + ":\n";
	for (var i = 0; i < this.a.length; i++){
		this.a[i] = ((1-w) * this.start_a[i]) + ((w)*this.final_a[i]);
		
		//outt += i+' '+this.start_a[i]+' '+this.final_a[i]+' '+this.a[i]+'\n';

	}
	//alert(outt);
}

function arange(start, end, dx) {	
    var foo = [];
    for (var i = start; i <= end; i+=dx)
        foo.push(i);
    return foo;
}


kjs_polynomial.prototype.build_poly_interface = function (div){
	//var order = typeof f.order !== 'undefined' ? f.order : 3;
	this.active_interface = "polynomial";
	var div = typeof div !== 'undefined' ? div : this.coords.input_div_id;
	var eqn_div = "#"+ div;
	var a = this.a;
	var order = this.a.length;
	var order_id = "poly_order_"+this.name;
	var poly_id = "poly_eqn_"+this.name;
	var size = 2;
	
	$(eqn_div).html("");
	var t = 'Order: <input id="'+order_id+'" type="text" size="'+size+'" value="'+(order-1)+'"></input>';
	$(eqn_div).append(t);
	
	$("#"+order_id).change({poly:this, div:div}, function (f){
		//alert($(this).val()+" "+f.data.poly.a.length);
		// validate if a number
		if (isNaN($(this).val())){
			alert($(this).val()+ " is not a number. \n\n Only integer numbers greater than or equal to 0.");
			$(this).val(f.data.poly.a.length);
		} else {
			var order = parseInt($(this).val())+1;
			//alert(order);
			if (order < f.data.poly.a.length) {
				f.data.poly.a = f.data.poly.a.slice(0, order);	
			} else if (order > f.data.poly.a.length) {
				for (var i = f.data.poly.a.length; i < order; i++) {
					f.data.poly.a.push(0);
				}
			}
			f.data.poly.build_poly_interface(div);
			f.data.poly.draw();
		}
	});
			
	$(eqn_div).append('<br> ');
			
	t = '<div id="'+poly_id+'" style="background-color:#fdd; padding:5px;border-radius:5px;font-size:1.5em;"></div>';
	$(eqn_div).append(t);

	$("#"+poly_id).empty();
	//alert("check");
	t = "y = ";
	$("#"+poly_id).append(t);
	for (var i=order-1; i>=0; i--) {
		//alert(i);
		if (i !== order-1){ 
			t = " + "; 
		} else {
			t = "";
		}
		if (i === 0) {
			t += '<input id="a'+i+'" type="text" size="'+size+'" value="'+a[i]+'" class="text_input"></input>';
			$("#"+poly_id).append(t);
		} else if (i === 1) {
			t += '<input id="a'+i+'" type="text" size="'+size+'" value="'+a[i]+'" class="text_input"></input> x';
			$("#"+poly_id).append(t);			
		} else {
			t += '<input id="a'+i+'" type="text" size="'+size+'" value="'+a[i]+'" class="text_input"></input> x <sup>'+i+'</sup>';
			$("#"+poly_id).append(t);						
		}
		
		$("#a"+i).change({poly:this, i:i}, function(f){
			// validate if a number
			if (isNaN($(this).val())){
				alert($(this).val()+ " is not a number. \n\n Only numbers please");
				$(this).val(f.data.poly.a[f.data.i]);
			} else {
				if (animate) {
					//stash old polynomial
					f.data.poly.backup_a();					
					//alert($(this).val()+" "+f.data.i);
					f.data.poly.a[f.data.i] = $(this).val();
					//alert(i+" "+f.data.poly.a[f.data.i]);
					//f.data.poly.line.remove();
					f.data.poly.draw({animate:true, start_a:f.data.poly.old_a});
				} else {
					f.data.poly.a[f.data.i] = $(this).val();
					f.data.poly.draw();
				}
				
			}
		});

	}	
	
}


kjs_polynomial.prototype.backup_a = function(){
	this.old_a = [];
	for (var i = 0; i < this.a.length; i++){
		//alert(this.a[i]);
		this.old_a.push(this.a[i]);
	}
}

kjs_polynomial.prototype.reset_a_array = function(a){
	this.a = a;
	this.draw;
}


/*
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}
*/

function kjs_numerical_integrator(f) {

	this.interface_div = $(f.interface_div_id);
	this.f = f.f;
	this.layer = f.layer;
	this.coords = f.coords;
	
	this.a = typeof f.a !== 'undefined' ? f.a : 0;
	this.b = typeof f.b !== 'undefined' ? f.b : 5;
	this.n = typeof f.n !== 'undefined' ? f.n : 5;
	
	this.keep = typeof f.keep !== 'undefined' ? f.keep : false;
	
	this.boxes = [];
	
}

kjs_numerical_integrator.prototype.build_interface = function(f) {
	var f = typeof f !== 'undefined' ? f : {};
	
	this.a = typeof f.a !== 'undefined' ? f.a : this.a;
	this.b = typeof f.b !== 'undefined' ? f.b : this.b;
	this.keep = typeof f.keep !== 'undefined' ? f.keep : this.keep;
	
	if (typeof f.n !== 'undefined') {
		this.n = f.n;
	} else {
		this.n = typeof this.n !== 'undefined' ? this.n : 5;
	}
	this.dx = (this.b - this.a)/this.n;

	
	this.a_id = "int_a";
	this.b_id = "int_b";
	this.n_id = "int_n";
	this.clear_id = "int_clear";
	this.keep_id = "int_keep";
	this.dx_id = "int_dx";
	this.Area_id = "int_Area";
	var size = 2;
	this.Area = this.numerically_integrate(this.a, this.b, this.dx, this.f);
	
	var m = 'a = <input id="'+this.a_id+'" type="text" size="'+size+'" value="'+this.a+'" title="left boundary of area of integration" ></input>';
	m += ", ";
	m += 'b = <input id="'+this.b_id+'" type="text" size="'+size+'" value="'+this.b+'" title="right boundary of area of integration" ></input>';
	m += ", ";
	m += 'n = <input id="'+this.n_id+'" type="text" size="'+size+'" value="'+this.n+'" title="number of trapezoids for integration" ></input>';
	m += '&nbsp &nbsp';
	m += '<input id="'+this.clear_id+'" type="button" value="Clear" title="clear the trapezoids from the graph" ></input>';
	m += ", ";
	m += '&nbsp &nbsp';
	m += '<input id="'+this.keep_id+'" type="checkbox" value="Clear" title="Keep the integration shown even you select other things" >Keep</input>';
	m += ", ";
	m += "<br>";
	m += 'dx = <input id="'+this.dx_id+'" type="text" size="'+size+'" value="'+this.dx+'" title="width of trapezoids" class="text_output" readonly></input>';
	m += 'Area = <input id="'+this.Area_id+'" type="text" size="'+size*3+'" value="'+this.Area+'" title="Area under curve" class="text_output" readonly></input>';
	
	$(this.interface_div).html(m);
	
	if (this.keep) {
		$("#"+this.keep_id).prop('checked', true);
	} else {
		$("#"+this.keep_id).prop('checked', false);
	}
	
	$("#"+this.a_id).change({integrator: this}, function(e) {
		e.data.integrator.a = parseFloat($(this).val());
		//alert($(this).val());
		e.data.integrator.update_dx();
		//e.data.integrator.redraw();
		//alert("hello");
	});
	$("#"+this.b_id).change({integrator: this}, function(e) {
		e.data.integrator.b = parseFloat($(this).val());
		e.data.integrator.update_dx();
	});
	$("#"+this.n_id).change({integrator: this}, function(e) {
		e.data.integrator.n = parseInt($(this).val());
		e.data.integrator.update_dx();
	});

	$("#"+this.clear_id).click({integrator: this}, function(e) {
		e.data.integrator.clear();
	});

	$("#"+this.keep_id).change({integrator: this}, function(e) {
		//alert($(this).is(':checked'));
		if ($(this).is(':checked')) {
			e.data.integrator.keep = true;
		} else {
			e.data.integrator.keep = false;
		}
		
	});

}

kjs_numerical_integrator.prototype.update_dx = function(n) {
	this.dx = (this.b - this.a)/this.n;
	//alert(this.dx_id);
	$("#"+this.dx_id).val(this.dx);
	$("#"+this.Area_id).val(this.numerically_integrate());
	this.redraw();
}

kjs_numerical_integrator.prototype.redraw = function() {

	this.clear();
	this.draw();
	
}

kjs_numerical_integrator.prototype.clear = function() {
	
	for (var i = 0; i < this.boxes.length; i++) {
		//alert(i);
		this.boxes[i].remove();
	}
	
	//delete this.boxes;
	this.layer.draw();
	
}

kjs_numerical_integrator.prototype.draw = function() {
	this.boxes = [];
	
	//alert(this.n+" : "+this.dx+" : "+this.a+" : "+this.b);
	
	for (var i = 1; i <= this.n; i++) {
		//alert(i);
		var pts = [];
		var x0 = this.a + (i-1)*this.dx ;
		var x1 = this.a + i*this.dx ;
		//alert(i+ ' : '+this.a+ ' : '+this.dx+ ' : '+x0+ ' : '+x1);
		pts.push( this.coords.xpx(x0));
		pts.push( this.coords.ypx(0));
		pts.push( this.coords.xpx(x0));
		//alert(this.f.y_val(0));
		pts.push( this.coords.ypx(this.f.y_val(x0)));
		pts.push( this.coords.xpx(x1));
		pts.push( this.coords.ypx(this.f.y_val(x1)));
		pts.push( this.coords.xpx(x1));
		pts.push( this.coords.ypx(0));
		
	 	
	 	this.boxes.push(new Kinetic.Polygon({
	 		points: pts, //[0, 100, 200, 100],
	 		fill: "#ccc",
	 		stroke: "red",
	 		strokeWidth: 2,
	 		lineCap: "square",
	 		opacity: 0.5,
	 	}));
	 	/*
	 	this.boxes.push(new Kinetic.Polygon({
        	points: [73, 192, 73, 160, 340, 23, 500, 109, 499, 139, 342, 93],
        	fill: '#00D2FF',
        	stroke: 'black',
        	strokeWidth: 5
		}));
		*/	 	
	}

	for (var i = 0; i < this.boxes.length; i++) {
		//alert(this.layer);
		this.layer.add(this.boxes[i]);
	}
	this.layer.draw();
	
}


kjs_numerical_integrator.prototype.numerically_integrate = function (a, b, dx, f) {
	var a = this.a;
	var b = this.b;
	var dx = this.dx;
	var f = this.f;
	
	// calculate the number of trapezoids
	n = (b - a) / dx;
	
	// define the variable for area
	Area = 0;
	
	//loop to calculate the area of each trapezoid and sum.
	for (i = 1; i <= n; i++) {
		//the x locations of the left and right side of each trapezpoid
		x0 = a + (i-1)*dx;
		x1 = a + i*dx;
		
		// the area of each trapezoid
		Ai = dx * (f.y_val(x0) + f.y_val(x1))/ 2.;
		
		// cumulatively sum the areas
		Area = Area + Ai	
		
	} 
	return Area;
}
			
