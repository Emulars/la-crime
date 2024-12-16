'''
Write a python script that starting from a LA crime dataset composed of:

DateTime	District	Crime subtype	Crime type	Age	Gender	Ethnicity	Weapon	Weapon Type	Status	Street	Coordinates 
2020-03-01T21:30:00Z	Wilshire	VEHICLE - STOLEN	VEHICLE STOLEN	0	M	O	NONE	NONE	AA	1900 S  LONGWOOD                     AV	34.0375
2020-02-08T18:00:00Z	Central	BURGLARY FROM VEHICLE	BURGLARY	47	M	O	NONE	NONE	IC	1000 S  FLOWER                       ST	34.0444
2020-11-04T17:00:00Z	Southwest	BIKE - STOLEN	VEHICLE STOLEN	19	X	X	NONE	NONE	IC	1400 W  37TH                         ST	34.021
2020-03-10T20:37:00Z	Van Nuys	SHOPLIFTING-GRAND THEFT ($950.01 & OVER)	THEFT	19	M	O	NONE	NONE	IC	14000    RIVERSIDE                    DR	34.1576
...


Will create other dataset in the form:

1. Year, Total number of crime in the year, Month, Total number of crime in the month, Avg number of crime in the month

2. Year, District, Total number of crime in the year in that district, most frequent crime type in that year in that district, number of crime with the most frequent crime type in that year in that district 


'''