import pandas as pd
import numpy as np
from pymongo import MongoClient
from sklearn.preprocessing import OneHotEncoder
import sys

# Connect to MongoDB and load product data
client = MongoClient("mongodb://localhost:27017/")
db = client['ShoesShop_dev']
product_collection = db['shoes']

# Load product data (including color, shoe type, and brand)
products = list(product_collection.find({}, {'_id': 0, 'id': 1, 'gender': 1, 'category': 1, 'brand': 1}))
product_df = pd.DataFrame(products)
product_df['gender'] = product_df['gender'].astype(str)  # Convert gender to string

# One-hot encode attributes
encoder = OneHotEncoder()
encoded_attributes = encoder.fit_transform(product_df[['gender', 'category', 'brand']]).toarray()
product_attribute_matrix = pd.DataFrame(encoded_attributes, index=product_df['id'])

# Define weights for each attribute (gender > category > brand)
weights = {
    'gender': 0.5,  # Gender has higher weight
    'category': 0.3,  # Category has medium weight
    'brand': 0.2  # Brand has the lowest weight
}

# Calculate similarity based on shared features with weights
product_similarity_matrix = np.zeros((len(product_df), len(product_df)))

# Get column indices for each feature
gender_start = 0
category_start = len(product_df['gender'].unique())  # This will be the end index of gender features
brand_start = category_start + len(product_df['category'].unique())  # This will be the end index of category features

for i in range(len(product_df)):
    for j in range(i, len(product_df)):
        if i != j:
            # Weighted similarity
            gender_similarity = np.sum(
                product_attribute_matrix.iloc[i, gender_start:category_start] == product_attribute_matrix.iloc[j, gender_start:category_start]
            ) * weights['gender']

            category_similarity = np.sum(
                product_attribute_matrix.iloc[i, category_start:brand_start] == product_attribute_matrix.iloc[j, category_start:brand_start]
            ) * weights['category']

            brand_similarity = np.sum(
                product_attribute_matrix.iloc[i, brand_start:] == product_attribute_matrix.iloc[j, brand_start:]
            ) * weights['brand']

            # Total weighted similarity
            similarity = (gender_similarity + category_similarity + brand_similarity) / sum(weights.values())

            product_similarity_matrix[i, j] = similarity
            product_similarity_matrix[j, i] = similarity

# Convert to DataFrame for easy lookup
product_similarity_df = pd.DataFrame(product_similarity_matrix, index=product_df['id'], columns=product_df['id'])

# Function to get recommendations based on product attributes
def get_product_recommendations(product_id, num_recommendations=4):
    if product_id not in product_similarity_df.columns:
        return []
    
    # Sort products by similarity score and select top recommendations
    similar_products = product_similarity_df[product_id].sort_values(ascending=False).head(num_recommendations)
    return similar_products.index.tolist()

# Check if product ID is provided as a command-line argument
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Please provide a product ID as a command-line argument.")
    else:
        product_id = sys.argv[1]
        recommended_products = get_product_recommendations(product_id)
        print(recommended_products)
