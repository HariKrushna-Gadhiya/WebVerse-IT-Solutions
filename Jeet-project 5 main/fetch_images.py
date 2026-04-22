import json
import time
import sys
import concurrent.futures
from duckduckgo_search import DDGS
from pathlib import Path

salads = [
    "Green Salad", "Russian Salad", "Cream Fruit Salad", "Corn Pineapple Salad", "Corn Tomato Salad",
    "Mag Moath Salad", "Bengali Cucumber", "Stuffed Marcha", "Tikora Sambhar", "Keri Nu Athanu"
]
raitas_chutneys = [
    "Mint Chutney", "Coconut Chutney", "Date Chutney", "Green Chutney", "Sauce",
    "Pineapple Raita", "Banana Raita", "Cucumber Raita", "Boondi Raita", "Fruit Raita",
    "Veg Raita", "Dahi Boondi Raita"
]
farsan_starters = [
    "Paneer Pakoda", "Magdal Bhajiya", "Methi Na Gota", "Dudhi Na Gota", "Veg Dughra",
    "Tuver Dughra", "Punjabi Samosa", "Hari Bhari Tikki", "Veg Cutlets", "Veg Patties",
    "Sprout Patties", "Kopra Patties", "Mag Dal Kachori", "Marcha Vada", "Makai Marvel",
    "Patra", "Khaman", "Idada", "Tirangi Idada", "Kela Methi Bhajiya", "Batata Vada",
    "Chinese Samosa", "Spring Roll", "Vati Dal Na Patra", "Cheese Palak Puff", "Vasta Dhokla"
]
soups = [
    "Manchow Soup", "Hot N Sour Soup", "Tomato Soup", "Sweet Corn Soup", "Minestrone Soup",
    "Cream of Mushroom", "Veg Coconut Milk Soup", "Almond Coriander Soup", "Palak Soup",
    "Green Peas Soup", "Fresh Onion Soup", "Lemon Coconut Soup"
]
chaat = [
    "Pani Puri", "Dahi Puri", "Dahi Batata Puri", "Chaat Puri", "Bhel Puri", "Makai Bhel",
    "Dahi Bhel", "Bombay Bhel", "Papdi Chaat", "Dilli Chaat", "Marwadi Chaat", "Kurkure Chaat",
    "Basket Chaat", "Aalu Tikki Chaat", "Corn Tikki Chaat", "Golgappa Chaat", "Biscuit Chaat",
    "Palak Corn Chaat", "Puri Chaat", "Chana Chaat", "Italian Chaat", "Ragda Patties",
    "Chaat Samosa", "Idli Chaat", "Paneer Tikka Fry", "Paneer Taka Tak", "Pasta Kachori",
    "Dahi Bhajiya", "Dahi Vada", "Dahi Bhalla", "Sabudana Vada"
]
south_indian = [
    "Masala Dosa", "Sada Dosa", "Mysore Dosa", "Spring Dosa", "Chinese Dosa", "Palak Dosa",
    "Palak Paneer Dosa", "Cheese Dosa", "Rava Dosa", "Jodhpuri Dosa", "Cheese Uttapa",
    "Tomato Uttapa", "Idli Fry", "Dhangli", "Dhan Ni Dhangal", "Medu Vada", "Dal Vada",
    "Dosa Vada Chutney", "Panki Dosa Chutney"
]
guj_sabji = [
    "Surti Undhiyu", "Jain Undhiyu", "Dana Undhiyu", "Green Gujarat", "Panchkutir Shaak",
    "Batata Rassawala", "Batata Sukhi Bhaji", "Batata Tomato Shaak", "Kand Matar",
    "Turiya Matar", "Turiya Patra", "Turiya Patra Draksh", "Cauliflower Matar Draksh",
    "Cauliflower Matar Kaju", "Kismis", "Lilva", "Lilva Matar", "Ravaiya Papdi Tuver",
    "Veg Hara Bhara", "Limda Matar Patra", "Limdi Masala", "Ringan Bharta", "Mix Vegetable",
    "Vegetable Kofta", "Kathal Kofta", "Kaju Karela", "Khata Mitha Karela", "Stuffed Papad",
    "Ringan Batata Vatana Nu Shaak", "Jodhpuri Gatta", "Ravaiya Tuver"
]
punjabi = [
    "Veg Korma", "Aamani Korma", "Shahi Korma", "Navratan Korma", "Italian Korma", "Mix Veg",
    "Veg Haryali", "Veg Kolhapuri", "Dum Aalu", "Dum Aalu Punjabi", "Matar Dum Aalu",
    "Kashmiri Dum Aalu", "Chhole", "Chhole Paneer", "Chhole Palak", "Chhole Palak Paneer",
    "Aalu Matar", "Aalu Matar Paneer", "Khoya Matar Paneer", "Khoya Kaju", "Paneer Kadai",
    "Paneer Tikki Masala", "Paneer Makhmali", "Paneer Bhurji", "Paneer Korma", "Paneer Makhanwala",
    "Palak Babycorn", "Tawa Mushroom Sabji", "Paneer Kaju", "Paneer Patiyala", "Paneer Mughlai",
    "Paneer Borsan", "Paneer Kofta", "Paneer Hari", "Chik Paneer Khaman"
]
rice_dal = [
    "Veg Pulav", "Sprout Pulav", "Green Pulav", "Green Peas Pulav", "Paneer Matar Pulav",
    "Kashmiri Pulav", "Sadi Puri", "Masala Puri", "Palak Puri", "Sada Bhat", "Jeera Rice",
    "Matar Bhat", "Lemon Bhat", "Dal Fry", "Surti Dal", "Mag Dal", "Adad Dal", "Chana Dal",
    "Panchkutir Dal", "Vaghareli Dal", "Dal Makhani", "Dal Tadka", "Tuver Dal Khichdi",
    "Mag Dal Khichdi", "Masala Khichdi", "Ram Khichdi", "Sadi Kadhi", "Veg Kadhi",
    "Marwadi Kadhi", "Veg Punjabi Kadhi"
]
chinese_sizzlers = [
    "Chinese Sizzler", "Paneer Sizzler", "Veg Sizzler", "Mexican Sizzler", "Italian Sizzler",
    "American Chop Suey", "Chinese Chop Suey", "Veg Chow Chow", "Veg Hong Kong",
    "Veg Manchurian", "Fry Manchurian", "Veg Lollipop in Hunan Garlic Sauce", "Hakka Noodles",
    "Paneer Chilli Fry", "Paneer Chilli Gravy", "Szechwan Fry Rice", "Veg Fry Rice",
    "Veg Singapore Fry Rice", "Szechwan Hakka Noodles", "Spring Roll"
]
italian_pizza = [
    "Red Pasta", "Cheese Pasta", "Bruschetta", "Basil Pasta", "Italian Pizza", "Mexican Rice",
    "Thai Curry", "Thai Corn Bowl", "American Bowl", "Paneer Khakhra", "Aloo Rosti",
    "Mexican Tikki", "Paneer Mongolian", "Broccoli Almond Soup", "Thai Corn Soup",
    "Tomato Sushma", "Italian Salad", "Mexican Salad", "Corn Kali Inter Soup", "Veg Kali Soup",
    "Mexican Bell", "Italian Bell", "Italian Roll", "Veg Roasted", "Veg Pizza", "Mushroom Pizza",
    "Italian Pizza", "Jain Pizza", "Pineapple Pizza", "Veg Sizzler Pizza", "Onion Capsicum Pizza"
]
beverages = [
    "Mint Mojito", "Blue Lagoon", "Pina Colada", "Strawberry", "Kiwi Manna",
    "Kala Khatta Jodhpuri / Fruit Variety", "Orange", "Ginger", "Watermelon", "Red Guava",
    "Cranberry", "Green Cocktail Juice", "Jamjura Thandai", "Kesar Thandai", "Ganga Jamuna Juice",
    "Coconut Juice", "Orange Juice", "Litchi Juice", "Litchi with Vanilla", "Nariyal Pani",
    "Coconut Punch", "Kesar Milk Shake", "Pina Colada", "Fruit Punch", "Faluda with Ice Cream",
    "Green Grapes Shake", "Pineapple Mosambi Litchi", "Pineapple Explosion", "Sitafal Milk Shake",
    "Coldrinks", "Haryali", "Black Grapes", "Jamrukh Pineapple Juice", "Jamrukh Fresh",
    "Lilu Sharbat", "Rasna Sharbat", "Kalakhatta", "Pineapple Tukmari Vanilla Cream", "Gulastan",
    "Orange Float", "Oreo Shake", "Brownie Shake", "KitKat Shake", "Orange Brownies",
    "Butter Scotch", "Strawberry Blossom", "Lal Wine", "Red Coin", "Anjum", "Uttam Combo",
    "Aa America Che", "Green New Zealand", "Berry-Berry", "Pagano Mukko", "Gone Nutty",
    "Tulsi Ghar", "Lal Pradip", "K.V. Paanafun", "Black Goose Delight", "Red Goa", "Fragn Lassi",
    "Chandi No Punch", "Ke Vo Men Tango", "Mara-Maro", "Ganga Jamuna"
]

all_items = list(set(
    salads + raitas_chutneys + farsan_starters + soups + chaat + south_indian + guj_sabji + punjabi + rice_dal + chinese_sizzlers + italian_pizza + beverages
))

urls_file = Path("image_urls.json")
image_urls = {}
if urls_file.exists():
    with open(urls_file, "r") as f:
        try:
            image_urls = json.load(f)
        except Exception:
            pass

ddgs = DDGS()

def fetch_image(item):
    if item in image_urls and not image_urls[item].startswith("https://via.placeholder.com"):
        return item, image_urls[item]
    
    query = f"{item} indian food photography"
    try:
        results = ddgs.images(query, max_results=1)
        if results:
            url = results[0]["image"]
            print(f"Success: {item}", flush=True)
            return item, url
        else:
            print(f"No results for: {item}", flush=True)
            return item, "https://via.placeholder.com/400x300.png?text=" + item.replace(" ", "+")
    except Exception as e:
        print(f"Error fetching {item}: {e}", flush=True)
        return item, "https://via.placeholder.com/400x300.png?text=" + item.replace(" ", "+")

items_to_fetch = [item for item in all_items if item not in image_urls or image_urls[item].startswith("https://via.placeholder.com")]
print(f"Fetching {len(items_to_fetch)} items...", flush=True)

with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    for item, url in executor.map(fetch_image, items_to_fetch):
        image_urls[item] = url
        # Save incrementally
        with open(urls_file, "w") as f:
            json.dump(image_urls, f, indent=4)

print("Finished saving URLs", flush=True)
