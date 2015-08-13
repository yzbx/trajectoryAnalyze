var div = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);


var listener = new window.keypress.Listener();
listener.simple_combo("shift s", function() { 
  console.log("You pressed shift and s"); 
  div.transition()
  .duration(200)
  .style("opacity", .9);

  div.html("hello"+ "<br/>" )
  .style("left", margin.left+ "px")
  .style("top", (height+margin.top+margin.bottom ) + "px");

});

listener.simple_combo("alt f", function() { 
  alert("You pressed alt and f"); 
  div.transition()
  .duration(1500)
  .style("opacity", 0);
});
listener.simple_combo("alt m", function() { alert("You pressed alt and m"); });