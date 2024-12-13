# Los Angeles Crime

DataViz final project - Beneath the city lights

## Authors

- Andrea Morando
- Davide Miggiano

## Introduction

Our project proposal concerns the enhancement of a past project on crime-related data
cleaning and analysis regarding the city of Los Angeles. For the project, the dataset used was for the period 2010 to 2024, but as this amount of data is around 4GB, it was decided to reduce the years under analysis from 2020 to 2024. The dataset in question is available at the following link; this data is derived from transcripts of reports compiled directly by the police, and is therefore subject to errors of various kinds.

## Dataset Overview

The dataset used in this project focuses on crime incidents in Los Angeles between 2020 and 2024. It contains detailed information about various crimes, including their time of occurrence, location, and type, as well as demographic data related to the victims. Each record in the dataset represents a single crime event and includes the following key attributes:

- DateTime: The exact date and time when the crime occurred, formatted as ISO 8601.
- District: The administrative district in Los Angeles where the crime took place.
- Crime subtype and type: A description of the specific nature of the crime, such as “VEHICLE - STOLEN” or broader categories like “VEHICLE STOLEN.”
- Age, Gender, Ethnicity: Demographic details of the victim involved in the crime.
- Weapon and Weapon Type: Information about the weapon used, if any, in the crime.
- Status: Indicates the case’s current status, such as “Active” or “Archived.”
- Street and Coordinates: The street address and geographic coordinates where the incident occurred.

The dataset enables an in-depth exploration of crime patterns over time and across different regions in Los Angeles. It also provides insights into how crimes correlate with victim demographics and other factors, such as the use of weapons.

## Project Structure

1. The problem overview: Introduction with a general overview
2) The identification of critical areas: Move to geographic distribution to identify the most affected areas.
3) The time dimension: Highlight when crimes are most frequent [Slider with year/animation Alluvial chart with: Left: Total crimes Center: most critical neighborhoods (taken from above) Right: Time bands when crimes happen (morning,afternoon,evening)]
4) Types of crimes and Weapons used
5) Human Impact: Exploring the effect on different demographic groups

## Command reference

| Command           | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `npm install`            | Install or reinstall dependencies                        |
| `npm run dev`        | Start local preview server                               |
| `npm run build`      | Build your static site, generating `./dist`              |
| `npm run deploy`     | Deploy your app to Observable                            |
| `npm run clean`      | Clear the local data loader cache                        |
| `npm run observable` | Run commands like `observable help`                      |