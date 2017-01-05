import re
import csv
from collections import Counter

Idaho Falls-Pocatello, ID
Mobile, AL-Pensacola (Ft. Walton Beach), FL
Davenport,IA-Rock Island-Moline,IL
Chicago, IL
Paducah, KY-Cape Girardeau, MO-Harrisburg-Mount Vernon, IL




with open('geo_dma.csv') as csvfile:
	reader = csv.DictReader(csvfile)
	state_list = []
	regex = re.compile('[^a-zA-Z]')
	for row in reader:
		states = row['states']
		states = regex.sub(' ', states)
		states = states.rstrip()
		states = states.lstrip()
		states = states.replace("   ", "")
		if states:
			states = states.split(" ")
			for state in states:
				state_list.append(state)
	freqs = Counter(state_list)
	with open('state_frequencies.csv', 'wb') as outfile:
		writer = csv.writer(outfile)
		writer.writerow(['state','frequency'])
		for state,freq in freqs.iteritems():
			writer.writerow([state,freq])
