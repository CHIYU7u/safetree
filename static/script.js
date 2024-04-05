var map;
var markers = [];
var weatherScenarios = [
    {
        name: '大豪雨',
        imageSrc: '/static/rain.png',
        windSpeed: '10',
        temperature: '18'
    },
    {
        name: '晴天',
        imageSrc: '/static/sunny.png',
        windSpeed: '5',
        temperature: '30'
    },
    {
        name: '強風',
        imageSrc: '/static/wind.png',
        windSpeed: '16',
        temperature: '22'
    },
    {
        name: '豪雨+強風',
        imageSrc: '/static/severe-weather.png',
        windSpeed: '15',
        temperature: '20'
    }
];


function loadTrees() {
    // 清除现有的地图标记
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    // 从后端获取树木数据并更新地图标记
    fetch('/trees')
        .then(response => response.json())
        .then(trees => {
            trees.forEach(tree => {
                var marker = new google.maps.Marker({
                    position: tree.location,
                    map: map,
                    title: tree.species,
                    icon: getMarkerIcon(tree.risk_level)
                });

                markers.push(marker); // 将标记添加到数组中以便以后管理

                marker.addListener('click', function() {
                    var infowindow = new google.maps.InfoWindow({
                        content: `種類：${tree.species}<br>風險等級：${tree.risk_level}`
                    });
                    infowindow.open(map, marker);
                });
            });
        })
        .catch(error => {
            console.error('Error loading trees:', error);
        });
}

function updateWeatherInfo(weather) {
    var selectedScenario = weatherScenarios.find(scenario => scenario.name === weather);
    if (!selectedScenario) {
        console.error('Weather scenario not found for:', weather);
        return;
    }

    // 更新浮动气泡中的天气图标
    var weatherImageEl = document.getElementById('weather-image');
    if (weatherImageEl) {
        weatherImageEl.src = selectedScenario.imageSrc;
    }

    // 更新遮罩层中的天气图标
    var overlayWeatherImageEl = document.getElementById('overlay-weather-image');
    if (overlayWeatherImageEl) {
        overlayWeatherImageEl.src = selectedScenario.imageSrc;
    }

    // 更新风速和温度
    document.getElementById('wind-speed').textContent = selectedScenario.windSpeed + '級';
    document.getElementById('temperature').textContent = selectedScenario.temperature + '°C';
}


function handleWeatherChange(weather) {
    updateWeatherAnimation(weather);
    updateWeatherInfo(weather);
    console.log(weather);
    // 发送请求到后端更新天气
    fetch('/update_weather', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ weather: weather })
    }).then(() => {
        // 重新加载树木数据并更新地图标记
        loadTrees();
    });
}


function startWeatherTimer() {
    let weatherConditions = ['晴天', '大豪雨', '強風', '豪雨+強風'];
    let currentWeatherIndex = 0;

    setInterval(() => {
        handleWeatherChange(weatherConditions[currentWeatherIndex]);
        currentWeatherIndex = (currentWeatherIndex + 1) % weatherConditions.length;
    }, 10000); // 每10秒切換一次
}

function initMap() {
    // 初始化地图
    mapOptions = {
        center: new google.maps.LatLng(25.0170, 121.5395),
        zoom: 15,
        minZoom: 15
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    map.addListener('zoom_changed', function() {
        if (map.getZoom() < 15) {
            map.setZoom(15);
        }
    });

    startWeatherTimer();
    loadTrees(); // 使用 loadTrees 函数来加载树木数据
}

function getMarkerIcon(riskLevel) {
    var icon = {
        url: '', // 圖標的路徑
        scaledSize: new google.maps.Size(30, 30), // 調整尺寸
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(15, 15) // 圖標的錨點
    };

    if (riskLevel === "高危險 (High Risk)") {
        icon.url = '/static/red_icon.png'; // 高危險標記的路徑
    }else if (riskLevel === "中危險 (Moderate Risk)") {
            icon.url = '/static/yellow_icon.png'; // 高危險標記的路徑
    } else {
        icon.url = '/static/default_icon.png'; // 默認標記的路徑
    }

    return icon;
}

function updateWeatherAnimation(weather) {
    var weatherImageEl = document.getElementById('weather-image');
    // const weatherImageEl = document.getElementById('weather-image');

    // 清除之前可能設置的定時器
    clearInterval(window.rainInterval);

    // 隱藏圖片元素
    weatherImageEl.style.display = 'none';

    // 根據天氣狀況顯示相應圖片
if (weather === '大豪雨') {
    weatherImageEl.src = '/static/rain.png'; // 設置圖片的 src
    weatherImageEl.style.display = 'block'; // 顯示圖片
} else if (weather === '晴天') {
    weatherImageEl.src = '/static/sunny.png'; // 設置圖片的 src
    weatherImageEl.style.display = 'block'; // 顯示圖片
} else if (weather === '強風') {
    weatherImageEl.src = '/static/wind.png'; // 設置圖片的 src
    weatherImageEl.style.display = 'block'; // 顯示圖片
} else if (weather === '豪雨+強風') {
    weatherImageEl.src = '/static/severe-weather.png'; // 設置圖片的 src
    weatherImageEl.style.display = 'block'; // 顯示圖片
}


    // 其他天氣條件可以按需添加

// 在其他地方添加的天氣變化處理函數保持不變
// 啟動天氣定時器，每10秒自動切換天氣


// 添加拖动功能
var bubble = document.getElementById('floating-bubble');
var isDragging = false;
var originalX, originalY, originalMouseX, originalMouseY;

bubble.addEventListener('mousedown', function (e) {
    e.preventDefault();
    originalX = bubble.style.left;
    originalY = bubble.style.top;
    originalMouseX = e.clientX;
    originalMouseY = e.clientY;
    isDragging = true;
});

document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    var deltaX = e.clientX - originalMouseX;
    var deltaY = e.clientY - originalMouseY;
    bubble.style.left = (parseInt(originalX) || 0) + deltaX + 'px';
    bubble.style.top = (parseInt(originalY) || 0) + deltaY + 'px';
});

document.addEventListener('mouseup', function () {
    isDragging = false;
});

document.getElementById('floating-bubble').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'flex';
});

document.getElementById('overlay').addEventListener('click', function() {
    this.style.display = 'none';
});

//天氣資訊

document.getElementById('floating-bubble').addEventListener('click', function() {
    updateWeatherInfo(); // 更新天气信息
    document.getElementById('overlay').style.display = 'flex'; // 显示遮罩层
});


document.addEventListener('DOMContentLoaded', function () {
    updateWeatherInfo();
});

window.onload = initMap;

}
