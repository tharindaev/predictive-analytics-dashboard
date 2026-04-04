"""Generate sample CSV datasets for testing."""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

np.random.seed(42)
output_dir = os.path.join(os.path.dirname(__file__), "sample")
os.makedirs(output_dir, exist_ok=True)


def generate_sales_data():
    """Daily revenue for 2 years."""
    dates = [datetime(2022, 1, 1) + timedelta(days=i) for i in range(730)]
    data = []
    for i, date in enumerate(dates):
        seasonal = np.sin((date.month / 12) * 2 * np.pi) * 2000
        trend = i * 5
        weekend = -1500 if date.weekday() >= 5 else 0
        noise = np.random.normal(0, 1500)
        revenue = max(5000, 15000 + trend + seasonal + weekend + noise)
        data.append({
            "date": date.strftime("%Y-%m-%d"),
            "revenue": round(revenue),
            "orders": round(revenue / 50 + np.random.normal(0, 10)),
            "avg_order_value": round(50 + np.random.uniform(0, 30), 2),
            "marketing_spend": round(1000 + np.random.uniform(0, 2000)),
            "day_of_week": date.weekday(),
            "month": date.month,
        })
    df = pd.DataFrame(data)
    df.to_csv(os.path.join(output_dir, "daily_sales_2022_2023.csv"), index=False)
    print(f"Sales data: {len(df)} rows")


def generate_churn_data():
    """Customer churn prediction dataset."""
    n = 500
    data = []
    for i in range(n):
        tenure = np.random.randint(0, 73)
        monthly = round(20 + np.random.uniform(0, 80), 2)
        total = round(monthly * tenure, 2)
        tickets = np.random.randint(0, 11)
        satisfaction = round(1 + np.random.uniform(0, 4), 1)
        usage = np.random.randint(0, 501)
        contracts = ["month-to-month", "one_year", "two_year"]
        contract = np.random.choice(contracts, p=[0.5, 0.3, 0.2])

        churn_prob = 0.1
        churn_prob += 0.3 if tickets > 5 else 0
        churn_prob += 0.2 if tenure < 6 else 0
        churn_prob += 0.15 if monthly > 70 else 0
        churn_prob += 0.1 if contract == "month-to-month" else 0
        churned = 1 if np.random.random() < churn_prob else 0

        data.append({
            "customer_id": f"CUST-{i+1:04d}",
            "tenure_months": tenure,
            "monthly_charges": monthly,
            "total_charges": total,
            "contract_type": contract,
            "support_tickets": tickets,
            "usage_gb": usage,
            "satisfaction_score": satisfaction,
            "churned": churned,
        })
    df = pd.DataFrame(data)
    df.to_csv(os.path.join(output_dir, "customer_churn_data.csv"), index=False)
    print(f"Churn data: {len(df)} rows")


def generate_demand_data():
    """Product demand by region."""
    products = ["Widget A", "Widget B", "Gadget X", "Gadget Y", "Device Z"]
    regions = ["North", "South", "East", "West"]
    dates = [datetime(2023, 1, 1) + timedelta(days=i * 7) for i in range(104)]
    data = []
    for date in dates:
        for product in products:
            for region in regions:
                base = np.random.randint(50, 200)
                seasonal = np.sin((date.month / 12) * 2 * np.pi) * 30
                demand = max(10, int(base + seasonal + np.random.normal(0, 20)))
                data.append({
                    "date": date.strftime("%Y-%m-%d"),
                    "product": product,
                    "region": region,
                    "demand": demand,
                    "price": round(10 + np.random.uniform(0, 40), 2),
                    "promotion": np.random.choice([0, 1], p=[0.7, 0.3]),
                })
    df = pd.DataFrame(data)
    df.to_csv(os.path.join(output_dir, "product_demand_by_region.csv"), index=False)
    print(f"Demand data: {len(df)} rows")


if __name__ == "__main__":
    generate_sales_data()
    generate_churn_data()
    generate_demand_data()
    print("Done!")
