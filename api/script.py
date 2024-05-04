import numpy as np 
import pandas as pd 
import sys

# Accessing arguments passed from Node.js



properties_fe = pd.read_csv("./api/Property_with_Feature_Engineering.csv")
properties_fe.head()

# Checking cities for subsetting later

properties_fe.shape

df = properties_fe[properties_fe["city"] == "Lahore"] # Subsetting the data with respect to Karachi
df.head()
df.shape

"""# EDA (EXPLORATORY DATA ANALYSIS):
As there are so much columns so we will be dropping the columns that have either very little importance or can be considered as extras..
"""

# dropping unnecessary columns
col_names = ["location_id","page_url","province_name","locality","area_marla","year","month","day","agency","agent","latitude","longitude","property_id","property_type","price_bin","purpose","date_added","city","area"]
df = df.drop(col_names, axis=1)

df = df.reset_index()
df = df.drop("index",axis=1)
df.head()

# Checking if any null values in the df
df.isna().sum()

# Commented out IPython magic to ensure Python compatibility.
# importing matplotlib
import matplotlib.pyplot as plt
# %matplotlib inline
import matplotlib
matplotlib.rcParams["figure.figsize"] = (20,10)

df.shape

df['bedrooms'].unique()

"""# DATA CLEANING

As You can see in the above cell that there are some properties which have bedrooms even greater than 10...This could be possible that some of them could be typo error while others can be having other errors in them as well like very less baths or no baths...Lets inspect the properties that are having bedrooms more than 13
"""

df[df['bedrooms']>15]

"""Notice how some of them are having no baths and some are having very less number of baths as compared to their bedrooms..."""

df['baths'].unique()

"""Also notice in the above cell that some properties are having upto 12 baths as well, this could be a typo error as well"""

df = df.drop(df[(df['baths']==0) & (df['bedrooms'] > 3)].index)
df

"""In the above cell we are dropping those indexes that are having no baths and having bedrooms greater than 3 cause they can probably be a typo error."""

df.drop(df[(df['bedrooms']==0) | (df['baths']==0)].index, inplace=True)

"""We are also dropping those properties that are either having no bedrooms or no baths in the above cell..."""

df[df["baths"] > df["bedrooms"]]

"""There are some homes that are having more number of baths as compared to its bedrooms which is quite uncommon...

# OUTLIERS DETECTION AND REMOVALS:
"""

df['price_per_sqft'] = df['price'] / df['area_sqft']
df.head()

"""We have add a column of price_per_sqft for our feature engineering so that we can remove the outliers from our data...."""

len(df['location'].unique())

df['location'] = df['location'].apply(lambda x: x.strip())
location_stats = df.groupby('location')['location'].agg('count').sort_values(ascending=False)
location_stats.head(40)

len(location_stats[location_stats <= 10])

"""Notice that there are 98 locations that are having properties less than 10 so we can categorize them as others which will help us in dimensionality reduction in our machine learning model."""

locations_less_than_10 = location_stats[location_stats <= 10]
df['location' ] = df['location'].apply(lambda x:'others' if x in locations_less_than_10 else x)

df['location'].nunique()

"""Firstly there were 199 unique locations and now we are having only 102 unique locations after dimensionality reduction"""

df[df['area_sqft'] / df['bedrooms'] < 300]

"""In the above cell we assume that on  minimum a bedroom must be more than 300 sq.ft so those that were not following that rule in our data we will be removing them as they will be considered as outliers..."""

df.drop(df[df['area_sqft'] / df['bedrooms'] < 300].index, inplace = True)

df['price_per_sqft'].describe()

"""Notice how much it is having standard deviation we will reduce it..."""

# removing price_per_sqft outliers
def remove_pps_outliers(df):
    df_out = pd.DataFrame()
    for key,subdf in df.groupby('location'):
        m = np.mean(subdf['price_per_sqft'])
        std = np.std(subdf['price_per_sqft'])
        reduced_df = subdf[(subdf['price_per_sqft'] > (m-std)) & (subdf['price_per_sqft'] <= (m+std))]
        df_out = pd.concat([df_out,reduced_df], ignore_index=True)
    return df_out

df = remove_pps_outliers(df)
df.shape

def plot_scatter_chart(df, location):
    bedroom_2 = df[(df['location'] == location) & (df['bedrooms'] == 2)]
    bedroom_3 = df[(df['location'] == location) & (df['bedrooms'] == 3)]
    matplotlib.rcParams["figure.figsize"] = (15,10)
    plt.scatter(bedroom_2['area_sqft'], bedroom_2['price']/100000, color='blue', label="2 Bedroom", s=50)
    plt.scatter(bedroom_3['area_sqft'], bedroom_3['price']/100000, marker='+', color="green", label="3 Bedroom", s=50)
    plt.xlabel("Total Square Feet Area")
    plt.ylabel("Price")
    plt.title(location)
    plt.legend()

plot_scatter_chart(df, "Punjab Coop Housing Society")

"""Notice in the above graph that there are some properties having 3 bedrooms still in less price than 2 bedrooms properties in a specfied location. Now they can also be considered as outliers and we should also remove them so that they cannot affect our model performance"""

def remove_bhk_outliers(df):
    exclude_indices = np.array([])
    for location, location_df in df.groupby("location"):
        bhk_stats = {}
        for bedroom, bedroom_df in location_df.groupby("bedrooms"):
            bhk_stats[bedroom] = {
                'mean' : np.mean(bedroom_df["price_per_sqft"]),
                'std' : np.std(bedroom_df["price_per_sqft"]),
                'count': bedroom_df.shape[0]
            }
        for bedroom, bedroom_df in location_df.groupby("bedrooms"):
            stats = bhk_stats.get(bedroom - 1)
            if stats and stats['count']>5:
                exclude_indices = np.append(exclude_indices, bedroom_df[bedroom_df['price_per_sqft'] < (stats['mean'])].index.values)
    return df.drop(exclude_indices, axis="index")

df = remove_bhk_outliers(df)
df.shape

df.groupby('location')['location'].agg('count').sort_values(ascending=False).head(40)


"""Then we plot the graph and 5000 price per square ft is the most common price"""

df[df['baths'] > df['bedrooms']]

df[df['baths'] > (df['bedrooms'] + 2)]

df = df.drop(df[df['baths'] > (df['bedrooms'] + 2)].index)
df.shape

df1 = df.drop("price_per_sqft", axis=1)

"""As we add the column price_per_sqft for our dimensionality reduction we will now remove this column as this is not a feature for predicting property pricing..."""

dummies = pd.get_dummies(df1['location'])
dummies.head(3)

"""First we make dummies of our locations"""

df1 = pd.concat([df1, dummies.drop('others', axis=1)], axis="columns")
df1 = df1.drop("location", axis=1)
df1.head()
df1.shape

"""Then we concat them with our data...

# MODEL BUILDING AND EVALUATION
"""

X = df1.drop('price', axis=1) # Features
X.head()

y = df1['price'] # Predictor or predicted_variable
y.head()

"""As the price of property is continuous so we will be using regression models"""

from sklearn.model_selection import train_test_split # for dividing data into training and test sets
from sklearn.linear_model import LinearRegression # for predicting price


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=10)
lr = LinearRegression()
lr.fit(X_train, y_train)
lr.score(X_test, y_test)

"""Note that our linear regression model performs with 83% accuracy which is quite good..."""

from sklearn.model_selection import ShuffleSplit
from sklearn.model_selection import cross_val_score

cv = ShuffleSplit(n_splits=5, test_size=0.2, random_state=0)
cross_val_score(LinearRegression(), X, y, cv=cv)

"""Then use shuffle split for our cross validation and it gives the maximum accuracy of 86%..."""

# importing other regression models to find the best performing model using GridSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.linear_model import Lasso
from sklearn.model_selection import GridSearchCV

def find_best_model_using_gridsearchcv(X, y):
    algos = {
    'linear_regression': {
        'model': LinearRegression(),
        'params': {'fit_intercept': [True, False]}
    },
    'decision_tree_regressor': {
        'model': DecisionTreeRegressor(),
        'params': {'criterion': ['squared_error', 'friedman_mse'], 'splitter': ['best', 'random']}
    },
    'lasso': {
        'model': Lasso(),
        'params': {'alpha': [1, 2], 'selection': ['random', 'cyclic']}
    }
}



    cv = ShuffleSplit(n_splits=5, test_size=0.2, random_state=0)
    scores = []
    for algo_name, config in algos.items():
        gs = GridSearchCV(config['model'], config['params'], return_train_score=False, n_jobs=-1, cv=cv)
        gs.fit(X, y)
        scores.append({
            'model': algo_name,
            'best_score': gs.best_score_ ,
            'best_params': gs.best_params_
        })

    return pd.DataFrame(scores, columns=['model','best_score','best_params'])

find_best_model_using_gridsearchcv(X, y)

"""As decision_tree_regressor performs the best with 93% accuracy we will be using its best params and bulding our model..."""

dtr = DecisionTreeRegressor(criterion='friedman_mse', splitter='random', random_state=0)
dtr.fit(X, y)

X.columns




def predict_price(location, sqft, bedrooms, baths):
    loc_index = np.where(X.columns == location)[0]

    if len(loc_index) == 0:
        # Location not found in feature set
        print(f"Location '{location}' not found in the feature set.")
        return None

    x = np.zeros(len(X.columns))
    x[0] = baths
    x[1] = sqft
    x[2] = bedrooms
    x[loc_index[0]] = 1

    return dtr.predict([x])[0] / 100000

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: script.py location sqft bedrooms baths")
        sys.exit(1)

    # Parse arguments passed from Node.js
    location = sys.argv[1]
    sqft = sys.argv[2]
    bedrooms = sys.argv[3]
    baths = sys.argv[4]

    # Check if input values are convertible to the expected types
    try:
        sqft = float(sqft)
        bedrooms = int(bedrooms)
        baths = int(baths)
    except ValueError:
        print("Invalid input values. Please provide valid values for sqft, bedrooms, and baths.")
        sys.exit(1)

    # Generate prediction
    prediction = predict_price(location, sqft, bedrooms, baths)
    if prediction is not None:
        print(prediction)  # Print the prediction to stdout
