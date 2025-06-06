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

def danger_index(alpha, beta, crime_severity, crime_count, tot_crime_count, area, max_weighted_crime_index, max_crime_density, year):

    # Calcola l'indice pesato
    weighted_crime_values = [crime_severity[crime] * crime_count[crime] for crime in crime_severity]
    weighted_crime_index = sum(weighted_crime_values)
    normalized_weighted_crime_index = weighted_crime_index / max_weighted_crime_index if max_weighted_crime_index > 0 else 0

    # Calcola la densità di crimini e normalizzala
    crime_density = (tot_crime_count / area) / max_crime_density
    
    index = (alpha * normalized_weighted_crime_index) + (beta * crime_density)

    # Print all the values for 2023
    # if year == 2023:
    #     print("Crime Count: ", crime_count)
    #     print("Total Crimes: ", tot_crime_count)
    #     print("Area: ", area)
    #     print("Weighted Crime Index: ", weighted_crime_index)
    #     print("Normalized Weighted Crime Index: ", normalized_weighted_crime_index)
    #     print("Crime Density: ", crime_density)
    #     print("District Index: ", index)
    #     print("\n")

    return index

def compute_max_values(data):
    """
    Compute the maximum weighted crime index and maximum crime density
    across all years and districts in the dataset.

    Parameters:
    data (DataFrame): The input dataset with columns 'Year', 'District',
                      'Crime type', 'Crime Value', 'DistrictKm2'.

    Returns:
    tuple: (max_weighted_crime_index, max_crime_density)
    """
    max_weighted_crime_index = 0
    max_crime_density = 0

    for (year, district), group in data.groupby(['Year', 'District']):
        crime_severity = dict(zip(group['Crime type'], group['Crime Value']))
        crime_count = dict(Counter(group['Crime type']))
        total_crimes = len(group)
        area = group['DistrictKm2'].iloc[0]

        # Compute weighted crime index
        weighted_crime_values = [crime_severity[crime] * crime_count[crime] for crime in crime_severity]
        weighted_crime_index = sum(weighted_crime_values)
        max_weighted_crime_index = max(max_weighted_crime_index, weighted_crime_index)

        # Compute crime density
        crime_density = total_crimes / area
        max_crime_density = max(max_crime_density, crime_density)

    return max_weighted_crime_index, max_crime_density



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

    max_weighted_crime_index, max_crime_density = compute_max_values(df)

    for (year, district), group in df.groupby(['Year', 'District']):
        # Print the distric only for 2023
        total_crimes = len(group)
        crime_type_counts = Counter(group['Crime type'])
        most_frequent_crime, crime_count = crime_type_counts.most_common(1)[0]
        area = group['DistrictKm2'].iloc[0]
        crime_severity = dict(zip(group['Crime type'], group['Crime Value']))
        crime_count_dict = dict(Counter(group['Crime type']))
        district_index = danger_index(0.5, 0.5, crime_severity, crime_count_dict, total_crimes, area, max_weighted_crime_index, max_crime_density, year)
        district_indexes.append(district_index)
        results.append([year, district, total_crimes, most_frequent_crime, crime_count, district_index])
    
    return pd.DataFrame(results, columns=['Year', 'District', 'TotalCrimes', 'MostFrequentCrime', 'CrimeCount', 'DistrictIndex'])

district_summary = analyze_district(data)

# 3. Avg crimes by hour range per district, and weapon analysis
def analyze_hourly(df):
    results = []
    
    # Process each district
    for (year, district), group in df.groupby(['Year', 'District']):
        hourly_counts = group.groupby('Hour').size().reindex(range(24), fill_value=0)
        hourly_weapon_usage = group[group['Weapon Type'] != 'NONE'].groupby('Hour').size().reindex(range(24), fill_value=0)
        hourly_weapon_percentage = (hourly_weapon_usage / hourly_counts.replace(0, np.nan) * 100).fillna(0)
        hourly_most_used_weapon = group[group['Weapon Type'] != 'NONE'].groupby('Hour')['Weapon Type'].apply(
            lambda x: Counter(x).most_common(1)[0][0] if len(x) > 0 else None
        ).reindex(range(24), fill_value=None)
        results.append([year, district] + hourly_counts.tolist() + hourly_weapon_percentage.tolist() + hourly_most_used_weapon.tolist())
    
    # Process "All Districts" for each year
    for year, year_group in df.groupby('Year'):
        all_districts_hourly_counts = year_group.groupby('Hour').size().reindex(range(24), fill_value=0)
        all_districts_weapon_usage = year_group[year_group['Weapon Type'] != 'NONE'].groupby('Hour').size().reindex(range(24), fill_value=0)
        all_districts_weapon_percentage = (all_districts_weapon_usage / all_districts_hourly_counts.replace(0, np.nan) * 100).fillna(0)
        all_districts_most_used_weapon = year_group[year_group['Weapon Type'] != 'NONE'].groupby('Hour')['Weapon Type'].apply(
            lambda x: Counter(x).most_common(1)[0][0] if len(x) > 0 else None
        ).reindex(range(24), fill_value=None)
        results.append([year, 'All Districts'] + all_districts_hourly_counts.tolist() + all_districts_weapon_percentage.tolist() + all_districts_most_used_weapon.tolist())
    
    columns = ['Year', 'District'] + [f'Hour_{i}' for i in range(24)] + [f'Hour_{i}_WeaponPercentage' for i in range(24)] + [f'Hour_{i}_MostUsedWeapon' for i in range(24)]
    return pd.DataFrame(results, columns=columns)


hourly_summary = analyze_hourly(data)

# 4. Victim stats by gender, ethnicity, and age range

def prepare_victim_demographics(df):
    """
    Prepare victim demographic data for alluvial visualization with strict ordering
    and sorting: Gender, Ethnicity, and AgeRange by size or range.
    """

    def age_range(age):
        if pd.isna(age) or age == 0:
            return 'Unknown'
        return f"{(age // 10) * 10}-{(age // 10) * 10 + 9}"

    # Create working copy and age ranges
    data = df.copy()
    data['AgeRange'] = data['Age'].apply(age_range)

    # Filter Gender to include only 'M' and 'F'
    data = data[data['Gender'].isin(['M', 'F'])]

    # Group smaller ethnicities under "Other"
    ethnicity_counts = data['Ethnicity'].value_counts()
    data['Ethnicity'] = data['Ethnicity'].apply(
        lambda x: x if ethnicity_counts[x] >= 6000 else 'Other'
    )

    # Recompute ethnicity counts after grouping
    ethnicity_counts = data['Ethnicity'].value_counts()

    # Define order for AgeRange
    def age_range_sort_key(age_range):
        if age_range == 'Unknown':
            return float('inf')  # Put "Unknown" last
        start = int(age_range.split('-')[0])
        return start

    # Sort categories
    sorted_genders = data['Gender'].value_counts().index.tolist()
    sorted_ethnicities = ethnicity_counts.index.tolist()
    sorted_age_ranges = sorted(data['AgeRange'].unique(), key=age_range_sort_key)

    # Create category positions for sorted categories
    category_positions = {
        'Gender': 0,
        'Ethnicity': 1,
        'AgeRange': 2
    }

    # Create nodes dataframe with explicit positioning
    nodes_list = []

    # Gender nodes (first column)
    for gender in sorted_genders:
        nodes_list.append({
            'id': f"Gender_{gender}",
            'name': gender,
            'category': 'Gender',
            'column': category_positions['Gender']
        })

    # Ethnicity nodes (second column)
    for ethnicity in sorted_ethnicities:
        nodes_list.append({
            'id': f"Ethnicity_{ethnicity}",
            'name': ethnicity,
            'category': 'Ethnicity',
            'column': category_positions['Ethnicity']
        })

    # AgeRange nodes (third column)
    for age_range in sorted_age_ranges:
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

    # Ethnicity to AgeRange links
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

# 5. Victim stats by gender and age range for grouped bar chart
def prepare_victim_age_gender(df):
    """
    Prepara i dati per l'utilizzo in un grouped bar chart con Observable Plot,
    includendo le informazioni relative al Crime Type e Crime Subtype più frequenti.
    """
    def age_range(age):
        if pd.isna(age) or age == 0:
            return 'Unknown'
        return f"{(age // 10) * 10}-{(age // 10) * 10 + 9}"

    # Standardizza i nomi delle colonne
    df.columns = df.columns.str.strip()

    # Filtra per genere 'M' (Maschi) e 'F' (Femmine)
    data = df[df['Gender'].isin(['M', 'F'])]

    # Crea il range di età
    data.loc[:, 'AgeRange'] = data['Age'].apply(age_range)
    data = data[data['AgeRange'] != 'Unknown']

    # Raggruppa i dati e calcola il conteggio totale di crimini
    grouped_data = (
        data.groupby(['AgeRange', 'Gender'])
        .size()
        .reset_index(name='Total_Crimes')
    )

    # Trova il tipo di crimine e sottocategoria più frequenti coerentemente
    def most_common_crime(sub_df):
        # Raggruppa per Crime type per trovare il Crime subtype più frequente
        crime_counts = (
            sub_df.groupby('Crime type')['Crime subtype']
            .value_counts()
            .reset_index(name='count')
        )
        # Ordina per conteggio e seleziona il primo
        most_common = crime_counts.loc[crime_counts.groupby('Crime type')['count'].idxmax()]
        most_common = most_common.loc[most_common['count'].idxmax()]  # Tipo/Subtipo globale
        return pd.Series({
            'Most_Common_Crime_Type': most_common['Crime type'],
            'Most_Common_Crime_Subtype': most_common['Crime subtype']
        })

    crime_info = (
        data.groupby(['AgeRange', 'Gender'])
        .apply(most_common_crime, include_groups=False)
        .reset_index()
    )

    # Combina le informazioni dei crimini con i dati raggruppati
    merged_data = grouped_data.merge(crime_info, on=['AgeRange', 'Gender'])

    # Prepara i dati per Observable
    observable_data = merged_data.rename(columns={
        'AgeRange': 'x',
        'Gender': 'group',
        'Total_Crimes': 'y',
        'Most_Common_Crime_Type': 'most_common_crime_type',
        'Most_Common_Crime_Subtype': 'most_common_crime_subtype'
    })

    return observable_data




pivot_data = prepare_victim_age_gender(data)

# Save to JSON for D3
nodes_df.to_json('../src/data/nodes.json', orient='records')
links_df.to_json('../src/data/links.json', orient='records') 

# # Save the datasets
crime_summary.to_csv("../src/data/yearly_monthly_crime_summary.csv", index=False)
district_summary.to_csv("../src/data/district_crime_analysis.csv", index=False)
hourly_summary.to_csv("../src/data/hourly_crime_analysis.csv", index=False)
pivot_data.to_csv("../src/data/grouped_bar_chart_data.csv", index=False)




