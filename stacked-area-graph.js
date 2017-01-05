
    // Set the dimensions of the canvas / graph
  var margin = {top:0, right:80, bottom: 80, left:80},
      width = 960,
      height = 500;
   
  // Parse the date / time
  var parseDate = d3.time.format("%m/%d/%y").parse;
   
  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.category10();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");
  var area = d3.svg.area()
      .interpolate("basis")
      .x(function(d) { return x(d.date); })
      .y0(function(d) { return y(d.y0); })
      .y1(function(d) { return y(d.y0 + d.y); });

  var stack = d3.layout.stack()
      .values(function(d) { return d.values; });

  var line = d3.svg.line()
      .interpolate("basis") //remove this if you want the actual values to be shown. 
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.messages); });

  var svg = d3.select("#distribution-graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  function relax(){
    var again = false;
    var alpha = 4;
    var spacing = 20;
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
  }
  d3.select("#distribution-graph").attr("align","center");

  var filename = 'files/datecounts.csv'

  d3.csv(filename, function(error, data) {
    if (error) throw error;
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date" && key !== "total"; }));

    data.forEach(function(d) {

      d.date = parseDate(d.date);
    });

    // var members = color.domain().map(function(name) {
    //   return {
    //     name: name,
    //     values: data.map(function(d) {
    //       return {date: d.date, messages: +d[name]};
    //     })
    //   };
    // });
    var members = stack(color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {date: d.date, messages: parseInt(d[name]), y: parseInt(d[name])};
        })
      };
    }));
    console.log(members);
    x.domain(d3.extent(data, function(d) { return d.date; }));

    y.domain([
      0,3000
    ]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Messages");

    member = svg.selectAll(".member")
        .data(members)
        .enter().append("g")
        .attr("class", "member");


    member.append("path")
        .attr("class", "area")
        .attr("d", function(d) { return area(d.values); })
        .style("fill", function(d) { return color(d.name); });

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
  // svg = d3.select("#distribution-graph").transition();
  //     member.exit().remove();
  d3.csv(filename, function(error, data) {
    if (error) throw error;
    
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date";}));


    data.forEach(function(d) {
      d.date = parseDate(d.date);

    });
    var members = stack(color.domain().map(function(name) {
      return {
        name : name,
        values: data.map(function(d){
          return {date: d.date, messages: +d[name]};
        })
      };
    }));
    console.log(members);
    if (value == 'individual') {
      members = members.filter(function(key) { return key.name !== "total";});
    } else if (value == 'total') {
      members = members.filter(function(key) { return key.name == "total";});
    } 
    console.log(members);
    x.domain(d3.extent(data, function(d) { return d.date;}));
    y.domain([
      d3.min(members, function(c) { return d3.min(c.values, function(v) { return v.messages; }); }),
      d3.max(members, function(c) { return d3.max(c.values, function(v) { return v.messages; }); })
      ]);

    var svg = d3.select("#distribution-graph").transition();
      // svg.select(".x.axis")
      //   .duration(750)
      //   .call(xAxis)
      svg.select(".y.axis")
        .duration(750)
        .call(yAxis);


    svg = d3.select("#distribution-graph").selectAll("svg").select("g");
    svg.selectAll("g.member").remove();
    var member = svg.selectAll(".member")
      .data(members);

    member.enter()
      .append("g")
      .attr("class", "member");
      // .attr("class", "member");
    // member.enter()
    //   .append("g")
    //   .attr("class", "member");
    
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
;
 

    relax();
    member.exit().remove();

} 
)};


