

function get_top(data,count){
  var sorted_data = data.slice();
  sorted_data = sorted_data.sort(function (a,b){
    return b.messages - a.messages
  })
  return sorted_data.slice(0,count);
}
  
function strnum(num){
  if (!isNaN(num)){
    var stringed_num = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    var stringed_num = 'N/A';
  }
  return stringed_num;
}

function drawGraph(filename){
  var margin = {top: 20,right: 80,bottom: 80,left: 80,},
      width = 960,
      height = 450;
  
  var parseDate = d3.timeParse('%Y-%m-%d');
  var formatDate = d3.timeFormat('%b %d, ’%y');


  d3.select('#datecounts_total').append('svg')
    .attr('id','svg1')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  var svg = d3.select('#svg1')
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var x = d3.scaleTime()
    .range([0, width]);

  var y = d3.scaleLinear()
    .range([height, 0]);

  var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.messages); });

  d3.csv(filename, function(error, data){
    if (error) throw error;

    // var color = d3.scaleOrdinal(d3.schemeCategory20);
    var color = d3.scaleOrdinal().range(["#b2e4b9",
      "#dab2db",
      "#a5c18b",
      "#8bc5ed",
      "#e9b198",
      "#82d9d6",
      "#ddd4a2"
    ])
    color.domain(d3.keys(data[0]).filter(function(key){
      return key == 'Total';
    }));

    var members = color.domain().map(function(name){
        return{
        name: name,
        values: data.map(function(d) {
          return {
            date: parseDate(d.Date),
            messages: +d[name]
          }
        })
      }});

    x.domain(d3.extent(members[0].values, function(d){ return d.date; }));
    y.domain([
      0, 
      d3.max(members, function(m){ 
        return d3.max(m.values, function(g) { return g.messages; }) + 100; 
        }) 
    ]);

    var top = get_top(members[0]['values'],3);

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    svg.append('g')
        .attr('class', 'y axis')
        .call(d3.axisLeft(y))
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x',-10)
        .attr('y', 6)
        .attr('dy', '.71em')
        .attr('fill', '#000000')
        .text('Messages');

    member = svg.selectAll('.member')
        .data(members)
        .enter().append('g')
        .attr('class', 'member');

    member.append('path')
        .attr('class', 'line')
        .attr('d', function(d){
          return line(d.values);
        })
        .style('stroke', function(d){
          return color(d.name);
        });  

    var label = member.selectAll('.member line')
        .data(top)
        .enter().append('line');

    var label_line = label
        .style('stroke','black')
        .attr('x1', function(d) { return x(d.date) })
        .attr('y1', function(d) { return y(d.messages) })
        .attr('x2', function(d) { return x(d.date) + 15})
        .attr('y2', function(d) { return y(d.messages) - 15 })
        // .attr('x', function(d) { return x(d.date) } )
        // .attr('y', function(d) { return y(d.messages)})
        .attr('transform', 'translate(0,-3)');

    var text = member.selectAll('.member text')
        .data(top)
        .enter().append('text');

    var label_text = text
        .attr('transform', 'translate(0,0)')
        .attr('x', function(d) { return x(d.date) + 18 } )
        .attr('y', function(d) { return y(d.messages) - 20})
        .attr('dy', '0')
        .attr('fill', '#000000')
        .text(function (d) { return formatDate(d.date) + ': ' + strnum(d.messages) + ' messages '});
        ;
    })
}



var filename = 'files/datecounts.csv';

drawGraph(filename);
