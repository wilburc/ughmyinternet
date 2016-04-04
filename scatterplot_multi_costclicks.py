import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

csv1 = np.genfromtxt ('cost_to_clicks_cpc.csv', delimiter=",", usecols=(1,2))
csv2 = np.genfromtxt ('cost_to_clicks_cpm.csv', delimiter=",", usecols=(1,2))


files = [csv1, csv2]
colors = ['Greens', 'Reds', 'Blues']
counter = 0
for csv in files:
	array1 = [] #delivered clicks
	array2 = [] #cost


	for row in csv:
		array1.append(row[0]) #clix
		array2.append(row[1]) #cost


	
	x = array1
	y = array2
=
	plt.scatter(x, y, s=50, cmap = colors[counter], lw = 0.1, alpha=0.7)	
	counter += 1




quarters = [90,180,270]
plt.xticks(quarters)
plt.ylabel('Avg. CTR')
plt.xlabel('Day of Year')
plt.title('Average CTR')
plt.xlim(0,10000)
plt.ylim(0,10000)
colors = ['#ffffff', '#ffffff', '#ffffff', '#ffffff']
border = '#c8c8c8'
plt.axvspan(0,31, facecolor=colors[0], alpha=0.05, edgecolor=border)
plt.axvspan(31,59, facecolor=colors[0], alpha=0.1, edgecolor=border)
plt.axvspan(59,90, facecolor=colors[0], alpha=0.15, edgecolor=border)
plt.axvspan(90,120, facecolor=colors[1], alpha=0.05, edgecolor=border)
plt.axvspan(120,151, facecolor=colors[1], alpha=0.1, edgecolor=border)
plt.axvspan(151,181, facecolor=colors[1], alpha=0.15, edgecolor=border)
plt.axvspan(181,212, facecolor=colors[2], alpha=0.05, edgecolor=border)
plt.axvspan(212,243, facecolor=colors[2], alpha=0.1, edgecolor=border)
plt.axvspan(243,273, facecolor=colors[2], alpha=0.15, edgecolor=border)
plt.axvspan(273,304, facecolor=colors[3], alpha=0.05, edgecolor=border)
plt.axvspan(304,334, facecolor=colors[3], alpha=0.1, edgecolor=border)
plt.axvspan(334,365, facecolor=colors[3], alpha=0.15, edgecolor=border)
plt.show()






