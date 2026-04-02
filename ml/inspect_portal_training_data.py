from __future__ import annotations

from collections import Counter
import json
import os
import sys
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from recommendation_pipeline import (
    DEFAULT_SUPABASE_SERVICE_ROLE_KEY,
    DEFAULT_SUPABASE_URL,
    PORTAL_MARKET_TO_DATASET_MARKET,
    PORTAL_PRODUCT_TO_DATASET_CROP,
    PORTAL_REGION_TO_DATASET_REGION,
)


def fetch(path: str, query: dict[str, str]) -> list[dict]:
    supabase_url = (DEFAULT_SUPABASE_URL or os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")).strip()
    service_role_key = (
        DEFAULT_SUPABASE_SERVICE_ROLE_KEY or os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    ).strip()

    if not supabase_url or not service_role_key:
        raise RuntimeError("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")

    request = Request(
        f"{supabase_url.rstrip('/')}/rest/v1/{path}?{urlencode(query, safe='(),:!')}",
        headers={
            "apikey": service_role_key,
            "Authorization": f"Bearer {service_role_key}",
        },
    )
    with urlopen(request, timeout=30) as response:  # noqa: S310
        return json.loads(response.read().decode("utf-8"))


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    products = fetch("products", {"select": "id,name_mm,category_id", "order": "id.asc"})
    markets = fetch("markets", {"select": "id,name_mm,region_id", "order": "id.asc"})
    regions = fetch("regions", {"select": "id,name_mm", "order": "id.asc"})
    prices = fetch(
        "price_submissions",
        {
            "select": (
                "id,status,quality,unit,buy_price,sell_price,product_id,market_id,created_at,"
                "product:products!product_id(name_mm),"
                "market:markets!market_id(name_mm,region:regions!region_id(name_mm))"
            ),
            "order": "created_at.desc",
            "limit": "200",
        },
    )

    region_names = {row["id"]: row["name_mm"] for row in regions}

    print("Portal training readiness")
    print("------------------------")
    print(f"Products: {len(products)}")
    print(f"Markets: {len(markets)}")
    print(f"Price submissions: {len(prices)}")

    status_counter = Counter(row.get("status") or "unknown" for row in prices)
    print("Status counts:")
    if status_counter:
        for status, count in sorted(status_counter.items()):
            print(f"  {status}: {count}")
    else:
        print("  none")

    print("\nProduct mapping coverage:")
    for product in products:
        mapped = PORTAL_PRODUCT_TO_DATASET_CROP.get(product["name_mm"])
        label = mapped if mapped else "UNMAPPED"
        print(f"  {product['name_mm']} -> {label}")

    print("\nMarket mapping coverage:")
    for market in markets:
        region_name = region_names.get(market["region_id"], "")
        mapped_region = PORTAL_REGION_TO_DATASET_REGION.get(region_name, "UNMAPPED")
        mapped_market = PORTAL_MARKET_TO_DATASET_MARKET.get(
            market["name_mm"], "DEFAULT/FALLBACK or UNMAPPED"
        )
        print(
            f"  {market['name_mm']} ({region_name}) -> region={mapped_region}, market={mapped_market}"
        )

    approved = [row for row in prices if row.get("status") in {"peer_verified", "admin_verified"}]
    pending = [row for row in prices if row.get("status") == "pending"]
    print(f"\nApproved rows usable for retraining right now: {len(approved)}")
    print(f"Pending rows available for demo retraining: {len(pending)}")


if __name__ == "__main__":
    main()
