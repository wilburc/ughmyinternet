time.strptime("30 Nov 00", "%d %b %y")   
Monday, February 29, 2016 at 6:17pm CST
a      d  b    y   h m s
'Thu, 28 Jun 2001 14:17:15 +0000'

day_of_week = date[0][0:3]
month = date[1][0:3]
year = date[3]
time = date[5].split(':')
	if time[1][-2:] == 'pm':
		hour = int(time[0]) + 12
	else:
		hour = int(time[0])
	minute  = time[1][0:2]



import time

for date in dates:
day_of_week = ""
month = ""
day = ""
year = ""
hour = ""
minute = ""
date = date.split(' ')
day_of_week = date[0][0:3]
month = date[1][0:3]
year = date[3][-2]
time = date[5].split(':')
if time[1][-2:] == 'pm':
	hour = int(time[0]) + 12
else:
	hour = int(time[0])
date = time.strptime(hour + " " + minute + " " + day_of_week + " " + month + " " + year, "%H %m %a %b %y ")

Fri Jul  1 8 


timestamp = (time.strptime(dates[2], '%A, %B %d, %Y at %I:%M%p %Z'))

import pandas

data = pandas.read_csv("test.csv", header=0)
col_a = list(data.a)
col_b = list(data.b)
col_c = list(data.c)

def timeify(tstamp):
	if tstamp != 'date':
		day_of_week = ""
		month = ""
		day = ""
		year = ""
		hour = ""
		minute = ""
		print tstamp
		tstamp = tstamp.split(' ')
		# print thing
		day_of_week = tstamp[0][0:3]
		month = tstamp[1][0:3]
		day = tstamp[2][:-1]
		year = tstamp[3][-2:]
		time = tstamp[5].split(':')
		if time[1][-2:] == 'pm' and time[0] != '12':
			hour = int(time[0]) + 12
		else:
			hour = int(time[0])
		if hour < 10:
			hour = "0" + str(hour)
		minute = (time[1][0:2])
		# print day_of_week, month, day, year, hour, minute
		tstamp = datetime.strptime(str(str(hour) + " " + str(minute) + " " + str(day_of_week) + " " + str(day) + " " + str(month) + " " + str(year)), "%H %M %a %d %b %y")
		# print thing
	else:
		pass
	return tstamp

	
def timeify_row(row):
	return [timeify(row[1])]

with open('chatlog.csv', 'rb') as infile, open('newfile.csv', 'wb') as outfile:
	writer = csv.writer(outfile)
	writer.writerows((row[0], timeify(row[1]), row[2]) for row in csv.reader(infile))

with open('newfile.csv', 'rb') as infile, open('datecounts_all.csv', 'wb') as outfile:
	thao_counts = {}
	wilb_counts = {}
	josh_counts = {}
	total_counts = {}
	writer = csv.writer(outfile)
	writer.writerow(['date','wilb', 'thao', 'josh', 'total'])
	for row in csv.reader(infile):
		if row[1] != 'date':
			datez = row[1].split(" ")
			datez = datez[0]
			if row[0] == 'Thao Nguyen':
				
				# if int(datez.split("/")[0]) > 10:
				# 	datez = "0" + datez
				if datez in thao_counts:
					thao_counts[datez] += 1
				else:
					thao_counts[datez] = 1
			elif row[0] == 'Wilbur Chen':
				
		
				# if int(datez.split("/")[0]) > 10:
				# 	datez = "0" + datez
				if datez in wilb_counts:
					wilb_counts[datez] += 1
				else:
					wilb_counts[datez] = 1
			else:
				
			
				# if int(datez.split("/")[0]) > 10:
				# 	datez = "0" + datez
				if datez in josh_counts:
					josh_counts[datez] += 1
				else:
					josh_counts[datez] = 1
			if datez in total_counts:
				total_counts[datez] += 1
			else:
				total_counts[datez] = 1

		else:
			pass
	for key, value in wilb_counts.items():
		if key in thao_counts:
			thao_count = thao_counts[key]
		else:
			thao_count = 0
		if key in josh_counts:
			josh_count = josh_counts[key]
		else:
			josh_count = 0

		writer.writerow([key, value, thao_count, josh_count])



with open('newfile.csv', 'rb') as infile, open('daytrend.csv', 'wb') as outfile:
	timecounts = {}
	writer = csv.writer(outfile)
	writer.writerow(['time','count'])
	for row in csv.reader(infile):
		if row['date'] = (0,0,0,0)
		



	

