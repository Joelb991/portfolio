import numpy as np
import pandas as pd

# Load School Quality Report data
sqr_xlsx = pd.ExcelFile('data/201819_hs_sqr_results.xlsx')

# Read summary sheet — demographics & school info
sqr_summary = pd.read_excel(sqr_xlsx, 'Summary', header=3,
                            usecols='D:G,AF:AI,AK,AM:AW')
sqr_summary.drop(0, inplace=True)

# Read student achievement sheet — test scores & graduation
sqr_sa = pd.read_excel(sqr_xlsx, 'Student Achievement', header=3,
                       usecols='D:F,BF:BG,BW,CU,EZ:FA,FH:FI,FW')
sqr_sa.drop(0, inplace=True)

# Merge demographic & achievement data on DBN
demograph_df = pd.merge(sqr_summary, sqr_sa, on=['DBN','School Name'], how='inner')
demograph_df = demograph_df.drop(columns=['School Type_y'])
demograph_df.rename(columns={"School Type_x": "School Type"}, inplace=True)

# Load financial data — funding by school
financial_xlsx = pd.ExcelFile('data/NewYorkCitySchoolTransparency201819 A-E web.xlsx')
financial_df = pd.read_excel(financial_xlsx, 'Part-C', header=6,
    usecols=['School Name','Local School Code',
             'State & Local Funding','Federal \nFunding',
             'Total Funding Source by School'])

# Convert funding to millions
financial_df['Total Funding Source by School'] = \
    financial_df['Total Funding Source by School'].div(1000000)
financial_df['State & Local Funding'] = \
    financial_df['State & Local Funding'].div(1000000)

# Load geographic data for mapping
geo_df = pd.read_csv('data/2010-2016-school-safety-report.csv',
                     usecols=['DBN','Latitude','Longitude'])

# Merge all three datasets
master_df = pd.merge(demograph_df, financial_df,
                     left_on='DBN', right_on='Local School Code', how='left')
master_df = pd.merge(master_df, geo_df, on='DBN', how='left')

# Impute missing funding values with median (due to outliers)
master_df['Total Funding (M)'].fillna(
    master_df['Total Funding (M)'].median(), inplace=True)

# Create Borough column from DBN code
borough_map = {'M':'Manhattan','X':'Bronx','K':'Brooklyn',
               'Q':'Queens','R':'Staten Island'}
master_df['Borough'] = master_df['DBN'].str[2].map(borough_map)

# Create graduation tier classification
def classify_grad(rate):
    if rate >= 95: return 'High'
    elif rate >= 80: return 'Medium'
    else: return 'Low'

master_df['Graduation Tier'] = \
    master_df['Graduation Rate (%)'].apply(classify_grad)

# Export cleaned dataset
master_df.to_csv('data/clean_data.csv', index=False)
print(f'Clean data: {master_df.shape[0]} rows x {master_df.shape[1]} columns')
