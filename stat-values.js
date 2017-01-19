function summaryStats(data){
  // latest date (date property of last object)
  var latest_date = data[data.length - 1]['date']

  // # of messages
  var message_count = 0;
  for (var i = 0; i < data.length; i++){
    message_count = message_count + data[i]['total']
  }
  var message_count_str = message_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  // # of members
  var member_count = Object.keys(data[0]).length - 2;

  // # of days
  var day_count = Object.keys(data).length - 1;
  var day_count_str = day_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  // # average messages per day
  var average_daily_messages = message_count/day_count;
  var average_daily_messages_str = Math.round(average_daily_messages).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  // insert values into document
  document.getElementById('message-count').innerHTML = message_count_str;
  document.getElementById('day-count').innerHTML = day_count_str;
  document.getElementById('member-count').innerHTML = member_count;
  document.getElementById('daily-average').innerHTML = average_daily_messages_str;
  document.getElementById('last-updated').innerHTML = latest_date;
}

function loadData(filename){
  Papa.parse(filename, {
    download: true,
    dynamicTyping: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results){
      var datecounts = results.data;
      summaryStats(datecounts);
    }
  })
}

var datecount_file = 'files/datecounts.csv';
loadData(datecount_file);
