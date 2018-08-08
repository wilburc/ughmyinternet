var hour_filename = 'files/hour_stats.csv';
var day_filename = 'files/day_stats.csv';
var week_filename = 'files/hdd.csv';

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

function hourToHour(hour){
    var h = parseInt(hour);
    if (h == 0){
        var hs = '12am';
    } else if (h < 12){
        var hs = h + 'am';
    } else if(h == 12) {
        var hs = '12pm';
    } else {
        var hs = (h - 12).toString() + 'pm';
    }
    return hs
}

var files = {
  'Day':{
    file : 'files/day_stats.csv',
    xcol : 'Day'
  },
  'Hour':{
    file : 'files/hour_stats.csv',
    xcol : 'Hour'
  },
  'Day + Hour':{
    file : 'files/hdd.csv',
    xcol : 'DayHour'
  }
}

function weeklyBreakdownGraph(){
  // var type = 'Day + Hour';
  var type = document.getElementById('wb_select_timeframe').value;
  var xcol = files[type]['xcol'];
  // var ycol = 'Total';
  var ycol = document.getElementById('wb_select_metric').value;
  var filename = files[type]['file']
  var margin = {top: 20,right: 80,bottom: 80,left: 80,},
    width = 960,
    height = 500;

  var x = d3.scaleBand()
    .range([0, width])
    // .align(0.01)
    // .paddingInner(0.5)
    // .paddingOuter(0.5)
    .padding(0.2);

  // var x = d3.scaleTime()
  //   .range([0, width]);

  var y = d3.scaleLinear()
    .range([height, 0]);

    
  var parseDate = d3.timeParse('%Y-%m-%d');
  var formatDate = d3.timeFormat('%b %d ’%y');
  // var parseTime = d3.timeParse('%A %I %p %m/%Y');

  d3.select('#weekly_breakdown').append('svg')
    .attr('id','svg2')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  var svg = d3.select('#svg2')
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  
  var tooltip = d3.select('body').append("div").attr("class", "toolTip");


  d3.csv(filename, function(error, data){
    if (error) throw error;
    console.log(data);
    // filter out the columns we dont want
    var bars = data.map(function(d){
      if (type == 'Day'){
        return {
          day:d[xcol],
          val:+d[ycol]
        }
      } else if (type == 'Day + Hour'){
          return {
            day: d[xcol],
            val:+d[ycol],
            actual_day: (d['Day'])
          }
        } else {
            return {
             day: hourToHour(d[xcol]),
             val:+d[ycol]
            }
        }

      });


    var colors = [
        "#94d9df",
        "#f6a39f",
        "#82ebde",
        "#ddb1e5",
        "#dcedab",
        "#b9b5f3",
        "#a6c285",
        "#8abdf2",
        "#f6d89e",
        "#5ecee9",
        "#ebb08e",
        "#73c7c0",
        "#ebaec8",
        "#b2e6b6",
        "#c0bbe4",
        "#c1ba85",
        "#a3c6e7",
        "#cdd19e",
        "#e3aba7",
        "#89c39d",
        "#eec6a8",
        "#b5e6d1",
        "#c9ae8e",
        "#e4deb7"
            ];

    var days = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];

    function getDayColor(day,days,color){
        var di = days.indexOf(day);
        return colors[di]
    }


    // do domains
    x.domain(bars.map(function(d) { return d['day']; }));
    // x.domain(d3.extent(bars, function(d){ return d.val['dh']; }));

    y.domain([0, d3.max(bars, function(d) { return d['val']; }) * 1.1]);
    if (type != 'Day + Hour'){
      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));
    } else {
       svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x)
          .tickFormat(function(d,i){
            if ((i-12)%24){
              return '';
            } else {
              return d.split(' ')[0];
            }
          }))
      var ticks = svg.select('.x.axis').selectAll(".tick");
      ticks.selectAll('text')
        .style('fill', function(d){
          var day = (d.split(' ')[0]);

          return getDayColor(day,days,colors);
          // return colors[day];
          // return '#ffffff';
          // return '#' + color.slice(6 * i, (6 * i) + 6);
        });
      ticks.selectAll("line")
        .attr('opacity',function(d,i){
          if (i%1){
            return 1
          } else {
            return 0;
          }
        });

      // for (var i=0;i<7;i++){
      //   var rx = 0 + (i*(width/7));
      //   var ry = 0;
      //   var fill = colors[i];
      //   var rectangle = svg.append('rect')
      //     .attr('x',rx)
      //     .attr('y',ry)
      //     .attr('width',width/7)
      //     .attr('height',height)
      //     .attr('fill', fill);
      //     // .attr('opacity',0.2)
      // }
    };
   

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

    svg.selectAll('.bar')
        .data(bars)
        .enter().append('rect')
            .attr('class','bar')
            .attr('x', function(d) { return x(d['day']); })
            .attr('y', function(d) { return y(d['val']); })
            .attr('width', x.bandwidth())
            .attr('height', function(d) { return height - y(d['val']); })
            .attr('fill', function(d,i){
                if (type == 'Day'){
                    return getDayColor(d['day'],days,colors);
                } else if(type == 'Day + Hour') {
                    return getDayColor(d['actual_day'],days,colors);
                } else {
                    return colors[i];
                }
            })
            .on("mouseover", function(){
              d3.select(this)
                .style('opacity', 0.5);
            })
            .on("mouseout", function(d, i) {
              tooltip.style('display', 'none'),
              d3.select(this)
                .style('opacity',1);
            })
            .on("mousemove", function(d){
                tooltip
                  .style("left", d3.event.pageX - 50 + "px")
                  .style("top", d3.event.pageY - 150 + "px")
                  .style("display", "inline-block")
                  .html('<strong>' + d['day'] + '</strong><br> ' + strnum(d['val'].toFixed()) + ' Messages');
            })
        });
};

function updateWeeklyBreakdownGraph(){
// var type = 'Day + Hour';
  var type = document.getElementById('wb_select_timeframe').value;
  var xcol = files[type]['xcol'];
  // var ycol = 'Total';
  var ycol = document.getElementById('wb_select_metric').value;
  var filename = files[type]['file']
  var margin = {top: 20,right: 80,bottom: 80,left: 80,},
    width = 960,
    height = 500;

  var x = d3.scaleBand()
    .range([0, width])
    .padding(0.2);

  var y = d3.scaleLinear()
    .range([height, 0]);

    
  var parseDate = d3.timeParse('%Y-%m-%d');
  var formatDate = d3.timeFormat('%b %d ’%y');
  // var parseTime = d3.timeParse('%A %I %p %m/%Y');


  var svg = d3.select('#svg2')
    .transition();
  
  var tooltip = d3.select('body').append("div").attr("class", "toolTip");


  d3.csv(filename, function(error, data){
    if (error) throw error;
    // filter out the columns we dont want
    var bars = data.map(function(d){
      if (type == 'Day'){
        return {
          day:d[xcol],
          val:+d[ycol]
        }
      } else if (type == 'Day + Hour'){
          return {
            day: d[xcol],
            val:+d[ycol],
            actual_day: (d['Day'])
          }
        } else {
            return {
             day: hourToHour(d[xcol]),
             val:+d[ycol]
            }
        }

      });


    var colors = [
        "#94d9df",
        "#f6a39f",
        "#82ebde",
        "#ddb1e5",
        "#dcedab",
        "#b9b5f3",
        "#a6c285",
        "#8abdf2",
        "#f6d89e",
        "#5ecee9",
        "#ebb08e",
        "#73c7c0",
        "#ebaec8",
        "#b2e6b6",
        "#c0bbe4",
        "#c1ba85",
        "#a3c6e7",
        "#cdd19e",
        "#e3aba7",
        "#89c39d",
        "#eec6a8",
        "#b5e6d1",
        "#c9ae8e",
        "#e4deb7"
            ];

    var days = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    var hours = [
      '12am',
      '1am',
      '2am',
      '3am',
      '4am',
      '5am',
      '6am',
      '7am',
      '8am',
      '9am',
      '10am',
      '11am',
      '12pm',
      '1pm',
      '2pm',
      '3pm',
      '4pm',
      '5pm',
      '6pm',
      '7pm',
      '8pm',
      '9pm',
      '10pm',
      '11pm',
    ]

    function getDayColor(day,days,color){
        var di = days.indexOf(day);
        return colors[di]
    }
    function getHourColor(hour,hours,color){
      var hi = hours.indexOf(hour);
      return colors[hi];
    }

    // do domains
    x.domain(bars.map(function(d) { return d['day']; }));
    y.domain([0, d3.max(bars, function(d) { return d['val']; }) * 1.1]);

    if (type == 'Hour'){
      var ticks = svg.select('.x.axis')
        .selectAll('.tick');
      console.log(ticks);
      ticks.remove();
      svg.select('.x.axis')
        .transition(750)
        .call(d3.axisBottom(x));

      var ticks = svg.select('.x.axis')
        .selectAll('.tick');
      console.log(ticks)
      ticks.select('text')
        .style('fill',function(d){
          return getHourColor(d,hours,colors);
        });
    } else {
      svg.select('.x.axis')
        .transition(750)
        .call(d3.axisBottom(x)
        .tickFormat(function(d,i){
          if (type == 'Day + Hour'){
            if ((i-12)%24){
              // this.remove();
              return '';
            } else {
              return d.split(' ')[0];
            }
          } else {
            return d;
          }
          
        }));
      var ticks = svg.select('.x.axis').selectAll(".tick");
      ticks.selectAll('text')
        .style('fill', function(d){
          if (type == 'Day + Hour'){
            var day = (d.split(' ')[0]);
          } else {
            var day = d;
          }
          return getDayColor(day,days,colors);
        });
      ticks.selectAll("line")
        .attr('opacity',function(d,i){
          if (i%1){
            return 1
          } else {
            return 0;
          }
        });
    } 
   

    svg.select('.y.axis')
      .duration(750)
      .call(d3.axisLeft(y));
    svg = d3.select('#svg2');
    var bs = svg.select('g').selectAll('rect.bar')
      .remove().exit()
      .data(bars).enter().append('rect')
            .attr('class','bar')
            .attr('x', function(d) { return x(d['day']); })
            .attr('y', function(d) { return y(d['val']); })
            .attr('width', x.bandwidth())
            .attr('height', function(d) { return height - y(d['val']); })
            .attr('fill', function(d,i){
                if (type == 'Day'){
                    return getDayColor(d['day'],days,colors);
                } else if(type == 'Day + Hour') {
                    return getDayColor(d['actual_day'],days,colors);
                } else {
                    return colors[i];
                }
            })
            .on("mouseover", function(){
              d3.select(this)
                .style('opacity', 0.5);
            })
            .on("mouseout", function(d, i) {
              tooltip.style('display', 'none'),
              d3.select(this)
                .style('opacity',1);
            })
            .on("mousemove", function(d){
                tooltip
                  .style("left", d3.event.pageX - 50 + "px")
                  .style("top", d3.event.pageY - 150 + "px")
                  .style("display", "inline-block")
                  .html('<strong>' + d['day'] + '</strong><br> ' + strnum(d['val'].toFixed()) + ' Messages');
            })
        });

}
// var timeframe_select = document.getElementById('wb_select_timeframe');
// var metric_select = document.getElementById('wb_select_metric');
// timeframe_select.addEventListener('change', weeklyBreakdownGraph());
// metric_select.onChange = weeklyBreakdownGraph();

weeklyBreakdownGraph();










