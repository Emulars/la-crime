# Data Preparation and Cleaning: From Raw Crime Data to Analytical Insights

The data used in this project originates from two primary datasets provided by the City of Los Angeles. The first dataset covers crime incidents from 2010 to 2019, while the second encompasses the period from 2020 to December 2023. These datasets were merged and cleaned to form a comprehensive and unified database containing approximately three million rows and over thirty columns. This consolidated dataset provided a rich foundation for analysis but also presented significant challenges due to its complexity and inconsistencies.


## Initial Cleaning and Data Transformation

The first step in this process involved retrieving the raw dataset, a comprehensive record of various crimes reported across Los Angeles over the selected time frame. This data, while detailed, contained numerous discrepancies and inconsistencies that needed resolution to ensure its usability. The initial cleaning phase focused on addressing glaring issues such as negative age values, null entries in critical fields, and formatting inconsistencies across columns. These discrepancies, though subtle, had the potential to undermine the integrity of our analysis and were thus systematically corrected.

A notable challenge was the fragmentation of temporal data. Information related to the timing of crimes was scattered across four separate columns, each with varying formats, including dates and times recorded in the American style. To streamline this, these columns were consolidated into a single standardized field, ensuring consistency and ease of use in subsequent analyses. This step was particularly crucial for analyses involving temporal trends and correlations.

## Feature Selection and Reduction

Not all data fields were essential for the scope of our project. Columns like crime modus operandi and specific crime codes, while detailed, were deemed extraneous for our objectives and were subsequently removed. By focusing on the most relevant fields, we reduced the dataset from over thirty columns to a more manageable fourteen, without sacrificing analytical depth.

To enhance the dataset's analytical value, additional columns were created to generalize and standardize certain fields. Specifically, a "rollup" approach was applied to crime types and weapon categories. Through clustering techniques and renaming strategies, we grouped similar crimes and weapons into broader, more meaningful categories. This transformation not only simplified the data but also provided a clearer perspective on crime trends and patterns.

### Clustering Ethnic Groups

Another transformation involved clustering the data by ethnic groups. To reduce noise and provide more meaningful insights, smaller or less-represented groups were combined into broader categories. This clustering enabled a deeper understanding of patterns and correlations while maintaining the analytical integrity of the dataset.

## Introduction of the Crime Relevance Column

One of the most significant additions was the creation of a "Crime Relevance" column. This field assigned a weighted importance score (ranging from 1 to 5) to each crime type, considering factors such as severity, societal impact, and frequency. This allowed us to prioritize analyses based on the relevance and gravity of incidents. Similarly, district-level data was augmented with a calculated area column, expressing the geographical size of each police district in square kilometers. This provided essential context for spatial analyses, enabling a deeper understanding of crime density and distribution.

### Crime Index Calculation

The *Crime Index* for each district is a composite metric designed to quantify the relative risk and severity of criminal activities in a standardized manner. It combines two key components: the *Weighted Crime Index* and the *Crime Density*, weighted by configurable parameters \( \alpha \) and \( \beta \). The formula is expressed as:

\[
Danger\ Index\ _{District} = \alpha \cdot Weighted\ Crime\ Index\ _{District} + \beta \cdot Crime\ Density\ _{District}
\]

- **\(\alpha\)** and **\(\beta\)** are weights that determine the relative importance of crime severity and crime density, respectively. For this project, the initial values were set to \( \alpha = 0.6 \) and \( \beta = 0.4 \), prioritizing the gravity of crimes.

#### Weighted Crime Index
The *Weighted Crime Index* quantifies crime severity within a district by summing the weighted counts of various crime types. The formula normalizes this value across districts:

\[
Weighted\ Crime\ Index\ _{District} = \frac{\sum (Crime\ Severity \times Crime\ Count)}{Max\ Weighted\ Crimes\ in\ Any\ District}
\]

Each crime type is assigned a severity weight based on its societal impact. For instance:
- Homicide: 5
- Aggravated Assault: 4
- Auto Theft: 3
- Burglary: 2
- Minor Crimes: 1

#### Crime Density
The *Crime Density* reflects the concentration of criminal activity per unit area and is calculated as:

\[
Crime\ Density\ _{District} = \frac{Total\ Crimes\ in\ District}{Area\ of\ District\ (km^2)}
\]

This component accounts for the geographic size of districts, ensuring fair comparison regardless of spatial differences. By combining severity and density, the *Crime Index* provides a balanced measure of both the magnitude and spread of crime in Los Angeles.


## Tool Utilization: OpenRefine

All of these transformations were performed using OpenRefine, a robust tool capable of handling the dataset's substantial size. OpenRefine's powerful features allowed us to address issues of inconsistency, perform sophisticated clustering operations, and manage the large-scale data with efficiency and precision.

## Results of Data Preparation

The result of this extensive preprocessing effort is a streamlined and structured dataset, ready for analysis. From over thirty original columns, we now have a concise, coherent dataset with fourteen well-curated fields.

### Geodata Integration

[LAPD Geographic Area](https://geohub.lacity.org/datasets/lahub::lapd-divisions/explore?location=34.018933%2C-118.410104%2C9.68)
