var margin = {top: 30, right: 30, bottom: 30, left: 70},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

window.SVGmargin=margin;
var x = d3.scale.linear()
.range([0, width]);

var y = d3.scale.linear()
.range([height, 0]);

window.SVGx=x;
window.SVGy=y;

var color = d3.scale.category20();

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom");
var yAxis = d3.svg.axis()
.scale(y)
.orient("left");

 var tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) { return '<span>(' + d.object_id+','+d.frame_number + ')</span>' })
      .offset([-12, 0])

var svg = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.select("svg").on("mousemove",SVGmousemove)
.on("mousedown",SVGmousedown)
.on("mouseup",SVGmouseup);


d3.csv("trackingOutput.csv")
.get(function(error, data) { 
  if(error) console.error(error);
        //visulization ..........
        data.forEach(function(d) {
          d.x_bottom_right=+d.x_bottom_right;
          d.y_bottom_right=+d.y_bottom_right;
          d.x_top_left=+d.x_top_left;
          d.y_top_left=+d.y_top_left;
          d.x_center = (+d.x_bottom_right+d.x_top_left)/2;
          d.y_center = (+d.y_bottom_right+d.y_top_left)/2;
          d.object_id=+d.object_id;
            // console.log(d);
        });

         window.SVGdata=data;

        x.domain(d3.extent(data, function(d) { return d.x_center; })).nice();
        y.domain(d3.extent(data, function(d) { return d.y_center; })).nice();

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Sepal Width (cm)");

        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Sepal Length (cm)")

        svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.x_center); })
        .attr("cy", function(d) { return y(d.y_center); })
        .attr("opacity",1)
        .on("mouseover",tip.show)
        .on("mouseout",tip.hide)
        .style("fill", function(d) { return color(d.object_id%20); });

        

        var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

        legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
          // console.log(data);
      });