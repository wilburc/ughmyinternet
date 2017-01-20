// Set the dimensions of the canvas / graph
var margin = {top:0, right:80, bottom: 80, left:80},
    width = 960,
    height = 500;
 
// Parse the date/time
var parseDate = d3.timeParse("%m/%d/%y");

// define axes
var x = d3.scaleTime()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

// colors

var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.messages); });

var svg = d3.select("#distribution-graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// relax function from:
// https://www.safaribooksonline.com/blog/2014/03/11/solving-d3-label-placement-constraint-relaxing/  
function relax(){
    var again = false;
    var alpha = 4;
    var spacing = 10;
    svg.selectAll(".name").each(function (d, i) {
      a = this;
      da = d3.select(a);
      y1 = da.attr("y");
      svg.selectAll(".name").each(function (d, j){
        b = this;
        if (a == b) return;
        db = d3.select(b);
        y2 = db.attr("y");
        deltaY = y1 - y2;
        if (Math.abs(deltaY) > spacing) return;
        again = true;
        sign = deltaY > 0 ?  1 : -1;
        adjust = sign * alpha;
        da.attr("y",+y1 + adjust);
        db.attr("y",+y2 - adjust);
        if(again){
          setTimeout(relax,20)
        }

      })
    })
  };


var filename = 'files/datecounts.csv'

d3.csv(filename, function(error, data) {
  if (error) throw error;
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date" && key !== "Total"; }));
  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });

  var members = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, messages: +d[name]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([
    0,
    d3.max(members, function(c) { return d3.max(c.values, function(v) { return v.messages; }); })
  ]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .attr("fill","#000")
      // .style("text-anchor", "end")
      .text("Messages");

  member = svg.selectAll(".member")
      .data(members)
      .enter().append("g")
      .attr("class", "member");


  member.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

  member.append("text")
      .attr("class","name")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.messages) + ")"; })
      .attr("x", 6)
      .attr("dy", ".35em")
      .text(function(d) { return d.name.split(" ")[0]; })
      .style("stroke", function(d) { return color(d.name); });
  relax();
});

function updateData(value) {
  d3.csv(filename, function(error, data) {
    if (error) throw error;
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    if (value == 'individual'){
      color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date" && key !== "Total"} ));
    } else {
      color.domain(d3.keys(data[0]).filter(function(key) { return key == "Total"} ));
    }

    data.forEach(function(d) {
      d.date = parseDate(d.date);

    });
    var members = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {date: d.date, messages: +d[name]};
        })

      }
    });
    x.domain(d3.extent(data, function(d) { return d.date;}));
    y.domain([
      0,
      d3.max(members, function(c) { return d3.max(c.values, function(v) { return v.messages; }); })
      ]);
    var svg = d3.select("#distribution-graph").transition();
    svg.select(".y.axis")
      .duration(750)
      .call(d3.axisLeft(y));
    svg = d3.select("#distribution-graph").selectAll("svg").select("g");
    svg.selectAll("g.member").remove();
    member = svg.selectAll(".member")
      .data(members)
      .enter().append("g")
      .attr("class", "member");


    member.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

    member.append("text")
      .attr("class", "name")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.messages) + ")"; })
      .attr("x", 6)
      .attr("dy", ".35em")
      .text(function(d) { return d.name.split(" ")[0]; })
      .style("stroke", function(d) { return color(d.name); });
    member.exit().remove();
    relax();
  } 
)};


