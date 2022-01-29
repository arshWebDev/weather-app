import React, { useState, useEffect } from "react";
import "./Components/Styles/App.scss";

import { getCurrentData, getForecastData, getCondition } from "./utils";

import NavBar from "./Components/NavBar";
import Details from "./Components/Details";
import Progress from "./Components/Progress";
import Weather from "./Components/Weather";
import OtherDetailsMenu from "./Components/OtherDetailsMenu";

let App = () => {
  const [currentData, setCurrentData] = useState({});
  const [forecastData, setForecastData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hide, setHide] = useState(false);
  const [visible, setVisible] = useState(false);
  const [condition, setCondition] = useState("");
  const [unit, setUnit] = useState("metric");
  const [otherDetailsMenu, setOtherDetailsMenu] = useState(false);

  if (currentData.location !== undefined) {
    setTimeout(() => {
      setHide(true);

      setTimeout(() => {
        setVisible(true);
      }, 1000);
    }, 1000);
  }

  // get current location from navigator geolocation
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(fetchCurrentData);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // fetch current and  hourly forecast data for current location
  let fetchCurrentData = (position, location) => {
    getCurrentData(position, location).then((data) => {
      setCurrentData(data);
      let current = new Date(data.current.last_updated).getHours();
      setHourlyData(
        data.forecast.forecastday[0].hour.slice(current - 2, current + 3)
      );

      setLoading(false);
    });
  };

  useEffect(() => {
    if (currentData.location !== undefined) {
      getForecastData(
        currentData.location.lat,
        currentData.location.lon,
        unit
      ).then((data) => {
        setForecastData(data.daily.slice(1, 8));
      });

      setCondition(getCondition(currentData.current.condition.text));
    }
  }, [currentData, unit]);

  return (
    <main className="App">
      <div className={`background-wrapper ${visible ? condition : ""}`}></div>
      <section className={`main ${hide ? "active" : ""}`}>
        <NavBar
          hide={hide}
          otherDetailsMenu={otherDetailsMenu}
          setOtherDetailsMenu={setOtherDetailsMenu}
        />
        {hide ? (
          <Weather
            visible={visible}
            currentData={currentData.current}
            unit={unit}
          />
        ) : (
          <Progress currentData={currentData} hide={hide} />
        )}
        <Details
          getLocation={getLocation}
          fetchCurrentData={fetchCurrentData}
          currentData={currentData}
          loading={loading}
          setLoading={setLoading}
          hide={hide}
          visible={visible}
        />
      </section>
      {hide ? (
        <OtherDetailsMenu
          currentData={currentData}
          forecastData={forecastData}
          hourlyData={hourlyData}
          otherDetailsMenu={otherDetailsMenu}
          setOtherDetailsMenu={setOtherDetailsMenu}
          unit={unit}
          setUnit={setUnit}
        />
      ) : (
        ""
      )}
    </main>
  );
};

export default App;
