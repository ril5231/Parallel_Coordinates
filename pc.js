//setting the margin, width and height for the canvas 
var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
	
//setting the x and y coordinates ffor the pc 
var x = d3.scale.ordinal().rangePoints([0, 480], 1),
    y = {};

//setting the x and y coordinates for the xyplot 	
var x = d3.scale.linear().range([480, width]),
    y = d3.scale.linear().range([height-20,0]);
	
//setting the x and y axis for the xyplot 
	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left");
	
//setting the axis for the pc 
	var axis = d3.svg.axis().orient("left");


//define the function to convert points into a polyline 
var line = d3.svg.line() 
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate("linear");//line style. 

//setting the chart margin, width and attributes 
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
//arrayylist to load the 'cars' dataset 
var cars=[];

//reading the data from car.csv 
d3.csv("cars.csv", type, function(error, data) {
    cars = data;
	
//drawing the two graphs
    drawPC();
	drawXY();
});

//the function to draw the pc 
function drawPC() {
	
//setting the x and y scale 
	var x = d3.scale.ordinal().rangePoints([0, 480], 1),
   y= {};
    
// Extract the list of dimensions and create a scale for each.
    for (var dim in cars[0]) {
	   if (dim != "name") {
		  y[dim] = d3.scale.linear()
			 .domain([d3.min(cars, function(d) { return +d[dim]; }), d3.max(cars, function(d) { return +d[dim]; })])
		      .range([height,0]);
	   }
    }
    
//setting the x domain dimensions
    x.domain(dimensions = d3.keys(cars[0]).filter(function(d) { return d != "name";}));

//draw polylines
    for (var i=1; i< cars.length; i++) { 

//prepare the coordinates for a polyline
	   var lineData = []; //initialize an array for coordinates of a polyline
	   for (var prop in cars[0]) { //get each dimension
	       if (prop != "name" ) { //skip the name dimension
	           var point = {}; //initialize a coordinate object
	           var val = cars[i][prop]; //obtain the value of a car in a dimension
		      point['x'] = x(prop); //x value: mapping the dimension  
	           point['y'] = y[prop](val);//y value: mapping the value in that dimension
	           lineData.push(point); //add the object into the array 
	       }
	   }

//draw a polyline based on the coordindates 
        chart.append("g")
	       .attr("class", "polyline")
	       .append("path") // a path shape
		  .attr("d", line(lineData)) //line() is a function to turn coordinates into SVG commands
	
//the mouseover function that changes the strokes to red when the mouse is over them
	.on("mouseover", function(){
			d3.select(this)
		.style("stroke","red")
	 })
//the mouseout function that changes the strokes back to their original color
	.on("mouseout", function(){
		d3.select(this)
		.style("stroke",null)
		
})
    }

//draw individual dimension lines
//position dimension lines 
    var g = chart.selectAll(".dimension")
	   .data(dimensions)
	   .enter().append("g")
	   .attr("class", "dimension")
	   .attr("transform", function(d) { return "translate(" + x(d) + ")"; }) //translate each axis

	
// Add an axis and title.
    g.append("g")
	   .attr("class", "axis")
	   .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
	   .append("text")
	   .style("text-anchor", "middle")
	   .attr("y", -4)
	   .text(function(d) { return d; });
	   
    
};

//the function that draws the xyplot graph
function drawXY(){
//setting the x and y domains
    x.domain([d3.min(cars, function(d) { return d.year; }), d3.max(cars, function(d) { return d.year; })]);
    y.domain([d3.min(cars, function(d) { return d.power; }), d3.max(cars, function(d) { return d.power; })]);

//setting the yPosition 
    var yPos = height -20;
//creating the x-Axis
    chart.append("g")
	   .attr("class", "xaxis")
	   .attr("transform", "translate(0," + yPos + ")")
	   .call(xAxis);
//creating the Y-axis
    chart.append("g")
	   .attr("class", "yaxis")
	   .attr("transform", "translate(480,0)")
	   .call(yAxis);

     
//selecting ths dot 
//adding attributes	
    chart.selectAll(".dot")
	   .data(cars)
	   .enter().append("circle")
	   .attr("class", "dot")
	   .attr("cx", function(d) { return x(d.year); })
	   .attr("cy", function(d) { return y(d.power); })
	   .attr("r", 3)
	   
//the mouseover function that fills the dots red when the mouse is over them
	 .on("mouseover", function(){
			d3.select(this)
			.attr("fill", "red")
	 })
//the mouseout function that changes the dots back to normal color
	.on("mouseout", function(){
		d3.select(this)
		.attr("fill", "black")
		
})
	
  
}  





//this function coerces numerical data to numbers  
function type(d) {
    d.economy = +d.economy; // coerce to number
    d.displacement = +d.displacement; // coerce to number
    d.power = +d.power; // coerce to number
    d.weight = +d.weight; // coerce to number
    d.year = +d.year;
    return d;
}




