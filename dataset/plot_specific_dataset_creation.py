'''
The script processes the given LA crime dataset and produces the required datasets for analysis. Key outputs include:

Yearly and Monthly Crime Summary:
- Total crimes per year and month.
- Average monthly crimes per year.

District-specific Crime Analysis:
- Total crimes, most frequent crime type, and a computed district crime index.

Hourly Crime and Weapon Usage:
- Average crimes per hour in each district.
- Most frequent weapon type in crimes for specific hour ranges.

Victim Statistics:
- Counts of victims grouped by gender, ethnicity, and age ranges.
'''

import pandas as pd
from collections import Counter
from datetime import datetime
import numpy as np

def danger_index(alpha, beta, crime_severity, crime_count, area):
    weighted_crime_index = sum([crime_severity[crime] * crime_count[crime] for crime in crime_severity]) / max([crime_severity[crime] * crime_count[crime] for crime in crime_severity])
    crime_density = sum(crime_count.values()) / area
    return (alpha * weighted_crime_index) + (beta * crime_density)

# Load dataset
data = pd.read_csv("crime-data-2010-2024.tsv", sep="\t")

# Preprocess data
data['DateTime'] = pd.to_datetime(data['DateTime'])
data['Year'] = data['DateTime'].dt.year
data['Month'] = data['DateTime'].dt.month
data['Hour'] = data['DateTime'].dt.hour

# 1. Year, Total number of crimes, Month, Total number of crimes in the month, Avg number of crimes in the month
crime_summary = data.groupby(['Year', 'Month']).size().reset_index(name='MonthlyCrimeCount')
avg_monthly_crime = crime_summary.groupby('Year')['MonthlyCrimeCount'].mean().reset_index(name='AvgMonthlyCrime')
crime_summary = crime_summary.merge(avg_monthly_crime, on='Year')

# 2. Year, District, Crime analysis by district
def analyze_district(df):
    results = []
    district_indexes = []
    for (year, district), group in df.groupby(['Year', 'District']):
        total_crimes = len(group)
        crime_type_counts = Counter(group['Crime type'])
        most_frequent_crime, crime_count = crime_type_counts.most_common(1)[0]
        area = group['DistrictKm2'].iloc[0]
        crime_severity = dict(zip(group['Crime type'], group['Crime Value']))
        crime_count_dict = dict(Counter(group['Crime type']))
        district_index = danger_index(0.6, 0.4, crime_severity, crime_count_dict, area)
        district_indexes.append(district_index)
        results.append([year, district, total_crimes, most_frequent_crime, crime_count, district_index])
    # Normalize DistrictIndex
    max_index = max(district_indexes)
    min_index = min(district_indexes)
    for result in results:
        result[-1] = (result[-1] - min_index) / (max_index - min_index) if max_index > min_index else 0
    return pd.DataFrame(results, columns=['Year', 'District', 'TotalCrimes', 'MostFrequentCrime', 'CrimeCount', 'DistrictIndex'])

district_summary = analyze_district(data)

# 3. Avg crimes by hour range per district, and weapon analysis
def analyze_hourly(df):
    results = []
    for (year, district), group in df.groupby(['Year', 'District']):
        hourly_counts = group.groupby('Hour').size().reindex(range(24), fill_value=0)
        hourly_weapon_usage = group[group['Weapon Type'] != 'NONE'].groupby('Hour').size().reindex(range(24), fill_value=0)
        hourly_weapon_percentage = (hourly_weapon_usage / hourly_counts.replace(0, np.nan) * 100).fillna(0)
        hourly_most_used_weapon = group[group['Weapon Type'] != 'NONE'].groupby('Hour')['Weapon Type'].apply(lambda x: Counter(x).most_common(1)[0][0] if len(x) > 0 else None).reindex(range(24), fill_value=None)
        results.append([year, district] + hourly_counts.tolist() + hourly_weapon_percentage.tolist() + hourly_most_used_weapon.tolist())
    columns = ['Year', 'District'] + [f'Hour_{i}' for i in range(24)] + [f'Hour_{i}_WeaponPercentage' for i in range(24)] + [f'Hour_{i}_MostUsedWeapon' for i in range(24)]
    return pd.DataFrame(results, columns=columns)

hourly_summary = analyze_hourly(data)

# 4. Victim stats by gender, ethnicity, and age range
# def age_range(age):
#     if pd.isna(age) or age == 0:
#         return 'Unknown'
#     return f"{(age // 10) * 10}-{(age // 10) * 10 + 9}"

# data['AgeRange'] = data['Age'].apply(age_range)

# def analyze_victim_stats(df):
#     results = []
#     for year, group in df.groupby('Year'):
#         gender_counts = group['Gender'].value_counts()
#         ethnicity_counts = group['Ethnicity'].value_counts()
#         age_counts = group['AgeRange'].value_counts()
#         row = {'Year': year}
#         row.update({f'Gender_{gender}': count for gender, count in gender_counts.items()})
#         row.update({f'Ethnicity_{ethnicity}': count for ethnicity, count in ethnicity_counts.items()})
#         row.update({f'AgeRange_{age_range}': count for age_range, count in age_counts.items()})
#         results.append(row)
#     return pd.DataFrame(results)

# victim_stats = analyze_victim_stats(data)


def prepare_victim_demographics(df):
    """
    Prepare victim demographic data for alluvial visualization with strict ordering
    to prevent circular links.
    """
    def age_range(age):
        if pd.isna(age) or age == 0:
            return 'Unknown'
        return f"{(age // 10) * 10}-{(age // 10) * 10 + 9}"
    
    # Create working copy and age ranges
    data = df.copy()
    data['AgeRange'] = data['Age'].apply(age_range)
    
    # Add column position for each category to enforce ordering
    category_positions = {
        'Gender': 0,
        'Ethnicity': 1,
        'AgeRange': 2
    }
    
    # Create nodes dataframe with explicit positioning
    nodes_list = []
    
    # Gender nodes (first column)
    for gender in data['Gender'].unique():
        nodes_list.append({
            'id': f"Gender_{gender}",
            'name': gender,
            'category': 'Gender',
            'column': category_positions['Gender']
        })
    
    # Ethnicity nodes (second column)
    for ethnicity in data['Ethnicity'].unique():
        nodes_list.append({
            'id': f"Ethnicity_{ethnicity}",
            'name': ethnicity,
            'category': 'Ethnicity',
            'column': category_positions['Ethnicity']
        })
    
    # Age range nodes (third column)
    for age_range in data['AgeRange'].unique():
        nodes_list.append({
            'id': f"AgeRange_{age_range}",
            'name': age_range,
            'category': 'AgeRange',
            'column': category_positions['AgeRange']
        })
    
    nodes = pd.DataFrame(nodes_list)
    
    # Create links with proper node references
    links_list = []
    
    # Gender to Ethnicity links
    gender_ethnicity = data.groupby(['Gender', 'Ethnicity']).size().reset_index(name='value')
    for _, row in gender_ethnicity.iterrows():
        links_list.append({
            'source': f"Gender_{row['Gender']}",
            'target': f"Ethnicity_{row['Ethnicity']}",
            'value': row['value'],
            'source_category': 'Gender',
            'target_category': 'Ethnicity'
        })
    
    # Ethnicity to Age Range links
    ethnicity_age = data.groupby(['Ethnicity', 'AgeRange']).size().reset_index(name='value')
    for _, row in ethnicity_age.iterrows():
        links_list.append({
            'source': f"Ethnicity_{row['Ethnicity']}",
            'target': f"AgeRange_{row['AgeRange']}",
            'value': row['value'],
            'source_category': 'Ethnicity',
            'target_category': 'AgeRange'
        })
    
    links = pd.DataFrame(links_list)
    
    # Calculate percentages
    total_victims = len(data)
    links['percentage'] = (links['value'] / total_victims * 100).round(2)
    
    return nodes, links

nodes_df, links_df = prepare_victim_demographics(data)

# Save to JSON for D3
nodes_df.to_json('nodes.json', orient='records')
links_df.to_json('links.json', orient='records') 

# Save the datasets
crime_summary.to_csv("yearly_monthly_crime_summary.csv", index=False)
district_summary.to_csv("district_crime_analysis.csv", index=False)
hourly_summary.to_csv("hourly_crime_analysis.csv", index=False)
#victim_stats.to_csv("victim_stats_analysis.csv", index=False)



