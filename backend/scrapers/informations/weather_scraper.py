import requests

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}

def get_weather(payload):
    location = (payload.get("location") or "jakarta").strip().lower()
    
    try:
        resp = requests.get(f"https://wttr.in/{location}?format=j1", headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {"success": False, "error": f"wttr.in returned HTTP {resp.status_code}"}
        data = resp.json()
    except Exception as e:
        return {"success": False, "error": f"Failed to fetch weather: {str(e)}"}
    
    current = data.get("current_condition", [{}])[0]
    forecast = data.get("weather", [])
    
    return {
        "success": True,
        "data": {
            "source": "wttr.in",
            "location": location,
            "current": {
                "temperature": current.get("temp_C"),
                "feels_like": current.get("FeelsLikeC"),
                "weather": current.get("weatherDesc", [{}])[0].get("value"),
                "weather_code": current.get("weatherCode"),
                "humidity": current.get("humidity"),
                "wind_speed_kmh": current.get("windspeedKmph"),
                "wind_dir_degree": current.get("winddirDegree"),
                "wind_dir_16point": current.get("winddir16Point"),
                "pressure_mb": current.get("pressure"),
                "precip_mm": current.get("precipMM"),
                "visibility_km": current.get("visibility"),
                "uv_index": current.get("uvIndex"),
                "cloud_cover": current.get("cloudcover"),
                "observation_time": current.get("observation_time"),
            },
            "forecast": [
                {
                    "date": day.get("date"),
                    "max_temp": day.get("maxtempC"),
                    "min_temp": day.get("mintempC"),
                    "sunrise": day.get("astronomy", [{}])[0].get("sunrise"),
                    "sunset": day.get("astronomy", [{}])[0].get("sunset"),
                    "hourly": [
                        {
                            "time": hour.get("time"),
                            "temp": hour.get("tempC"),
                            "weather": hour.get("weatherDesc", [{}])[0].get("value"),
                            "humidity": hour.get("humidity"),
                            "wind_speed": hour.get("windspeedKmph"),
                            "chance_of_rain": hour.get("chanceofrain"),
                        }
                        for hour in (day.get("hourly") or [])
                    ],
                }
                for day in forecast
            ],
            "total_forecast_days": len(forecast),
        }
    }
