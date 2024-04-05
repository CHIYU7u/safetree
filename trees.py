import random

class Tree:
    def __init__(self, species, height, health, pest_ratio, environment_score, age, location):
        self.species = species
        self.height = height
        self.health = health
        self.pest_ratio = pest_ratio
        self.environment_score = environment_score
        self.age = age
        self.location = location
        self.weather_factor = 0

    def calculate_risk_level(self):
        weighted_score = (self.health / 4 * 15) + (self.pest_ratio * 6) + \
                         (self.environment_score * 6) + (self.age / 30 * 4) + self.weather_factor

        if weighted_score > 22:
            return "高危險 (High Risk)"
        elif weighted_score > 11:
            return "中危險 (Moderate Risk)"
        else:
            return "低危險 (Low Risk)"

    def update_weather_factor(self, weather_condition):
        if weather_condition == "大豪雨":
            self.weather_factor = 1.2
        elif weather_condition == "強風":
            self.weather_factor = random.randint(1, 17) * self.height / 10
            if self.weather_factor > 70:
                self.weather_factor = 70
        elif weather_condition == "豪雨+強風":
            self.weather_factor = 1.2 + random.randint(1, 17) * self.height / 10
            if self.weather_factor > 100:
                self.weather_factor = 100
        else:  # 晴天
            self.weather_factor = 0

trees = []
species_list = ["蒲葵", "白千層", "樟樹", "楓香", "大王椰子"]
heights = [15, 12, 13, 14, 18]


for i in range(50):
    species = species_list[i % len(species_list)]
    height = heights[i % len(heights)]
    health = random.uniform(1, 5)
    pest_ratio = random.uniform(0.1, 0.5)
    environment_score = random.uniform(0.5, 1.0)
    age = random.randint(5, 30)
    lat = 25.0170 + random.uniform(-0.01, 0.01)
    lng = 121.5395 + random.uniform(-0.01, 0.01)
    trees.append(Tree(species, height, health, pest_ratio, environment_score, age, {"lat": lat, "lng": lng}))


weather_conditions = ["晴天", "大豪雨", "強風", "豪雨+強風"]
current_weather_index = 0

def get_current_weather():
    global current_weather_index
    current_weather_index = (current_weather_index + 1) % len(weather_conditions)
    return weather_conditions[current_weather_index]

def update_weather():
    global trees
    weather_condition = get_current_weather()
    for tree in trees:
        tree.update_weather_factor(weather_condition)
        tree.calculate_risk_level()
