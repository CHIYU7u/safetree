from flask import Flask, jsonify, render_template,request
from trees import trees
from flask_cors import CORS

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/trees', methods=['GET'])
def get_trees():
    trees_data = [{"species": tree.species, "location": tree.location, "risk_level": tree.calculate_risk_level()} for tree in trees]
    return jsonify(trees_data)

@app.route('/update_weather', methods=['POST'])
def update_weather():
    weather_data = request.get_json()
    weather_condition = weather_data['weather']
    for tree in trees:
        tree.update_weather_factor(weather_condition)
        tree.calculate_risk_level()
    # 可能需要返回更新后的树木数据
    return jsonify([{"species": tree.species, "location": tree.location, "risk_level": tree.calculate_risk_level()} for tree in trees])

CORS(app)

if __name__ == '__main__':
    app.run(debug=True)
