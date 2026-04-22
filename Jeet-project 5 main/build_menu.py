import re
import urllib.parse
import random

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

def unique_list(seq):
    seen = set()
    seen_add = seen.add
    return [x for x in seq if not (x in seen or seen_add(x))]

categories = {
    "salads": {"name": "Salads & Raitas", "items": unique_list(salads + raitas_chutneys), "price_range": (100, 180)},
    "farsan": {"name": "Farsan & Starters", "items": unique_list(farsan_starters), "price_range": (120, 220)},
    "soups": {"name": "Soups", "items": unique_list(soups), "price_range": (110, 160)},
    "chaat": {"name": "Chaat & Street Food", "items": unique_list(chaat), "price_range": (80, 150)},
    "south_indian": {"name": "South Indian", "items": unique_list(south_indian), "price_range": (150, 250)},
    "gujarati": {"name": "Gujarati Sabji", "items": unique_list(guj_sabji), "price_range": (200, 300)},
    "punjabi": {"name": "Punjabi Sabji", "items": unique_list(punjabi), "price_range": (250, 350)},
    "rice_dal": {"name": "Rice, Dal & Breads", "items": unique_list(rice_dal), "price_range": (120, 220)},
    "chinese": {"name": "Chinese & Sizzlers", "items": unique_list(chinese_sizzlers), "price_range": (200, 400)},
    "italian_pizza": {"name": "Pizza & Italian", "items": unique_list(italian_pizza), "price_range": (250, 450)},
    "beverages": {"name": "Beverages", "items": unique_list(beverages), "price_range": (80, 200)}
}

filters_html = '<button class="filter-btn active" data-filter="all">All</button>\n'
for cat_id, cat_data in categories.items():
    filters_html += f'                    <button class="filter-btn" data-filter="{cat_id}">{cat_data["name"]}</button>\n'

grid_html = ""
# Use a seeded random so prices don't change every time we build
random.seed(42)

for cat_id, cat_data in categories.items():
    for item in cat_data["items"]:
        # Generate pseudo-random realistic price ending in 0
        min_p, max_p = cat_data["price_range"]
        price = random.randint(min_p // 10, max_p // 10) * 10
        
        # URL encode item name for the image generator
        # Add " food" to make sure it generates food
        img_prompt = urllib.parse.quote(item + " delicious indian catering food")
        img_url = f"https://image.pollinations.ai/prompt/{img_prompt}?width=400&height=300&nologo=true"
        
        grid_html += f'''                    <div class="menu-card" data-category="{cat_id}">
                        <div class="menu-img">
                            <img src="{img_url}" alt="{item}" loading="lazy">
                            <span class="price">₹{price}</span>
                        </div>
                        <div class="menu-info">
                            <h3>{item}</h3>
                            <p>Authentic and delicious dish tailored to your taste.</p>
                        </div>
                    </div>\n'''

with open("menu.html", "r", encoding="utf-8") as f:
    content = f.read()

# Replace filters
filter_start = content.find('<div class="menu-filters">') + len('<div class="menu-filters">')
filter_end = content.find('</div>', filter_start)
content = content[:filter_start] + '\n                    ' + filters_html + '                ' + content[filter_end:]

# Replace grid
grid_start = content.find('<div class="menu-grid">') + len('<div class="menu-grid">')
menu_action_idx = content.find('<div class="menu-action">')
grid_end = content.rfind('</div>', 0, menu_action_idx)

content = content[:grid_start] + '\n' + grid_html + '                ' + content[grid_end:]

with open("menu.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated menu.html with images and prices")
