import pandas as pd
import numpy as np
from scipy.spatial.distance import cosine
from pymongo import MongoClient

# Kết nối MongoDB và tải dữ liệu
client = MongoClient("mongodb://localhost:27017/")  # Thay localhost bằng URL MongoDB của bạn
db = client['ShoesShop_dev']
collection = db['productviewhistories']

# Lấy tất cả dữ liệu từ MongoDB (bao gồm viewCount)
data = list(collection.find({}, {'email': 1, 'id': 1, 'viewCount': 1}))

# Tạo DataFrame từ dữ liệu
df = pd.DataFrame(data)

# Tạo ma trận user-product
user_product_matrix = pd.pivot_table(df, index='email', columns='id', values='viewCount', aggfunc='sum', fill_value=0)
user_product_array = user_product_matrix.values  # Chuyển sang dạng NumPy để tăng tốc

# Tính cosine similarity nhanh hơn
num_users = user_product_array.shape[0]
similarity_matrix = np.zeros((num_users, num_users))

for i in range(num_users):
    for j in range(i + 1, num_users):
        similarity = 1 - cosine(user_product_array[i], user_product_array[j])
        similarity_matrix[i, j] = similarity
        similarity_matrix[j, i] = similarity

# Chuyển ma trận tương đồng thành DataFrame
user_similarity_df = pd.DataFrame(similarity_matrix, index=user_product_matrix.index, columns=user_product_matrix.index)

# Lấy các sản phẩm phổ biến nhất (dựa trên tổng viewCount)
def get_top_products(num_top=4):
    # Tính tổng viewCount của từng sản phẩm
    total_view_counts = user_product_matrix.sum(axis=0)
    # Sắp xếp sản phẩm theo số lượng xem giảm dần
    top_product_indices = total_view_counts.sort_values(ascending=False).head(num_top).index
    return top_product_indices.tolist()

# Đưa ra gợi ý cho người dùng dựa trên độ tương đồng và viewCount
def get_recommendations(email, num_recommendations=4):
    # Kiểm tra nếu người dùng là mới (không có dữ liệu view)
    if email not in user_product_matrix.index or user_product_matrix.loc[email].sum() == 0:
        # Trả về các sản phẩm phổ biến nếu người dùng không có dữ liệu
        return get_top_products(num_recommendations)

    # Lấy độ tương đồng của người dùng hiện tại
    similar_users = user_similarity_df[email].sort_values(ascending=False).drop(email)

    # Khởi tạo điểm số sản phẩm
    product_scores = np.zeros(user_product_array.shape[1])
    user_index = user_product_matrix.index.get_loc(email)

    # Tính điểm ưu tiên theo sản phẩm dựa trên người dùng tương tự
    for similar_user, similarity_score in similar_users.items():
        similar_user_index = user_product_matrix.index.get_loc(similar_user)
        similar_user_products = user_product_array[similar_user_index]
        
        # Tăng điểm số cho các sản phẩm chưa xem với trọng số độ tương đồng
        product_scores += similarity_score * (similar_user_products * (user_product_array[user_index] == 0))

    # Sắp xếp và lấy top sản phẩm có điểm cao nhất
    recommended_product_indices = np.argsort(product_scores)[::-1][:num_recommendations]
    recommended_products = user_product_matrix.columns[recommended_product_indices]
    
    return recommended_products.tolist()

# Ví dụ: Gợi ý sản phẩm cho 'minhquan300903@gmail.com'
import sys

if __name__ == "__main__":
    # Lấy email từ tham số dòng lệnh
    if len(sys.argv) < 2:
        print("Vui lòng cung cấp email của người dùng.")
    else:
        email = sys.argv[1]
        recommended_products = get_recommendations(email)
        # print(f"\nRecommended Products for '{email}':")
        print(recommended_products)
