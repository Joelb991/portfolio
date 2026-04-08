import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv('data/clean_data.csv', header=0)

# Select key features for analysis
features = ['Graduation Rate (%)','Economic Need Index (%)',
    'College Readiness Index (%)','Enrollment','Total Funding (M)',
    'Student Attendance (%)','Teacher Attendance (%)',
    'Students Chronically Absent (%)','Temp Housing (%)',
    'HRA Eligible (%)','English Language Learners (%)',
    'White (%)','Asian (%)','Black (%)','Hispanic (%)',
    'Years of principal experience','Borough']

temporary_df = df[features]

# Borough-level averages
print(temporary_df.groupby('Borough').mean().round(2))
# Key findings: Bronx avg grad rate (79%) vs Staten Island (88%)
# Economic Need Index: Bronx (0.86) highest, Staten Island (0.55) lowest

# ── Correlation Matrix ──
sns.set_theme(style='dark')
corr_mat = temporary_df.corr()
mask = np.zeros_like(corr_mat)
mask[np.triu_indices_from(mask)] = True

f, ax = plt.subplots(figsize=(11, 9))
cmap = sns.diverging_palette(20, 220, as_cmap=True)
sns.heatmap(corr_mat, cmap=cmap, mask=mask, center=0,
            square=True, linewidths=0.5, annot=True, annot_kws={"size": 9})
ax.set_title("Correlation Matrix of School Features", fontsize=16)
plt.tight_layout()
plt.savefig('images/correlation_matrix.png', dpi=150, bbox_inches='tight')

# Key correlations with Graduation Rate:
#   Negative: Chronically Absent (-0.628), ENI (-0.588),
#             HRA Eligible (-0.574), Temp Housing (-0.555)
#   Positive: College Readiness, Attendance

# ── Graduation Rate vs Temp Housing Scatter ──
fig, ax = plt.subplots(figsize=(10, 6))
colors = {'High':'#2ecc71', 'Medium':'#f39c12', 'Low':'#e74c3c'}
for tier, color in colors.items():
    subset = df[df['Graduation Tier'] == tier]
    ax.scatter(subset['Temp Housing (%)'], subset['Graduation Rate (%)'],
               c=color, label=tier, alpha=0.6, s=30)
ax.set_xlabel('Temp Housing (%)')
ax.set_ylabel('Graduation Rate (%)')
ax.legend(title='Graduation Tier')
plt.savefig('images/grad_temp_scatter.png', dpi=150)

# ── Funding by Borough Box Plot ──
fig, ax = plt.subplots(figsize=(10, 6))
df.boxplot(column='Total Funding (M)', by='Borough', ax=ax)
plt.savefig('images/funding_borough.png', dpi=150)
