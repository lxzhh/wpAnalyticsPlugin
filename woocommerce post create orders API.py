from woocommerce import API
import pandas as pd
from faker import Faker
import random
import _thread
import threading
import time

kThreadCount = 1
kRepeatCount = 1

wcapi = API(
    url="http://staging2.xiangmingm.sg-host.com",
    consumer_key="ck_5a4f62deaf30678ff3a9a7e4c45074346dda40ea",
    consumer_secret="cs_5f9dde8076beadadf8c6ba6c8ae29e495b4c3085",
    wp_api=True,
    version="wc/v3",
    timeout=600
)

# 获取全部商品
all_products = []
per_page = 50
len_result = per_page
page = 1
while(len_result == per_page):
    r = wcapi.get("products", params={
                  "per_page": len_result, "page": page}).json()
    print("len of result", len(r))
    all_products = all_products + r
    len_result = len(r)
    page += 1


# 创造faker实例
faker = Faker()
Faker.seed(0)
faker.seed_instance(0)
orders_data = []


# 构建虚拟订单
def createBatchOrders(n):
    for row_index in range(kRepeatCount):
        created_post_data = []
        for product_num in range(100):
            # 随机选1-3个商品
            random_product_count = random.randint(1, 3)
            random_products = random.choices(
                all_products, k=random_product_count)
            line_items = []
            for product in random_products:
                print("product[sale_price]", product["price"])
                item = {
                    "product_id": product["id"],
                    "quantity": random.randint(1, 2),
                    "price": float(product["price"])
                }
                if len(product["variations"]) > 0:
                    item["variation_id"] = random.choice(product["variations"])

                # 控制价格范围
                total_price = sum([_item["quantity"] * _item["price"]
                                   for _item in line_items])
    #             print("total_price", total_price)
                if total_price > 0 and total_price + item["quantity"] * item["price"] > 90:
                    break

                line_items.append(item)
            print("line_items", line_items)

            # 随机生成用户信息
            first_name = faker.first_name()
            last_name = faker.last_name()
            address_1 = faker.street_address()
            address_2 = ""
            city = faker.city()
            state = faker.country_code()
            postcode = faker.postcode()
            country = faker.current_country_code()
            create_order_data = {
                "payment_method": "PayPal",
                "payment_method_title": "PayPal",
                "set_paid": True,
                "status": "completed",
                "billing": {
                    "first_name": first_name,
                    "last_name": last_name,
                    "address_1": address_1,
                    "address_2": address_2,
                    "city": city,
                    "state": state,
                    "postcode": postcode,
                    "country": country,
                    "email": faker.simple_profile()["mail"],
                    "phone": faker.phone_number()
                },
                "shipping": {
                    "first_name": first_name,
                    "last_name": last_name,
                    "address_1": address_1,
                    "address_2": address_2,
                    "city": city,
                    "state": state,
                    "postcode": postcode,
                    "country": country,
                },
                "line_items": line_items,
                "shipping_lines": [
                    {
                        "method_id": "flat_rate",
                        "method_title": "Flat Rate",
                        "total": "10.00"
                    }
                ]
            }
            if product_num % 11 == 0:
                create_order_data["status"] = "pending"
            if product_num % 23 == 0:
                create_order_data["status"] = "on-hold"
            if product_num % 37 == 0:
                create_order_data["status"] = "cancelled"
            if product_num % 35 == 0:
                create_order_data["status"] = "refunded"
            if product_num % 59 == 0:
                create_order_data["status"] = "failed"
            created_post_data.append(create_order_data)

        created_results = wcapi.post(
            "orders/batch", {"create": created_post_data}).json()
        print("created_result:", row_index, "thread:",
              n, " result:", created_results)


# 开多线程跑
for i in range(kThreadCount):
    t_thread = threading.Thread(target=createBatchOrders, args=(i,))
    t_thread.start()
    # _thread.start_new_thread(createBatchOrders, (i,))
