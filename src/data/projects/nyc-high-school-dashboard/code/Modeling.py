import pandas as pd
import matplotlib.pyplot as plt
import statsmodels.api as sm
from sklearn import linear_model

df = pd.read_csv('data/clean_data.csv', header=0)

# ── OLS Model 1: Multiple features ──
features = ['Economic Need Index (%)', 'Temp Housing (%)',
            'Total Funding (M)', 'College Readiness Index (%)',
            'English Language Learners (%)',
            'Teachers w/ 3+ years of experience (%)']
target = 'Graduation Rate (%)'

X = df[features].values.reshape(-1, len(features))
Y = df[target].values

ols = linear_model.LinearRegression()
model = ols.fit(X, Y)
print('Features                :', features)
print('Regression Coefficients :', [round(c, 2) for c in model.coef_])
print('R-squared               : %.2f' % model.score(X, Y))

# ── Best OLS Model: Principal experience + Temp Housing + Funding ──
X = df[['Years of principal experience','Temp Housing (%)','Total Funding (M)']]
y = df['Graduation Rate (%)']
model = sm.OLS(y, X).fit()
predictions = model.predict(X)
print(model.summary())
# R-squared (uncentered) = 0.855
# Coefficients: Principal exp (0.047), Temp Housing (1.907), Funding (0.019)

# Save OLS results
plt.rc('figure', figsize=(12, 7))
plt.text(0.01, 0.05, str(model.summary()), {'fontsize': 10},
         fontproperties='monospace')
plt.axis('off')
plt.tight_layout()
plt.savefig('images/OLS_results.png')

# ── Enrollment vs Total Funding (Strong R² = 0.934) ──
X = df[['College & Career Preparatory Course Index (%)',
        'Students with Disabilities (%)',
        'College Readiness Index (%)']]
y = df['Total Funding (M)']
model = sm.OLS(y, X).fit()
print(model.summary())
