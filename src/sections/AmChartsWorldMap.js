import React, { useLayoutEffect, useRef } from "react";
import styled from "styled-components";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const ChartDiv = styled.div`
  width: 100%;
  height: 550px;
`;

const AmChartsWorldMap = () => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    // Create root element
    let root = am5.Root.new(chartRef.current);

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create the map chart
    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "translateY",
        projection: am5map.geoMercator(),
      })
    );

    // Add zoom control with a visible home button
    let zoomControl = chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
    zoomControl.homeButton.set("visible", true);

    // Create main polygon series for countries
    let polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"],
      })
    );
    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(0xdadada),
    });

    // Create point series for markers with clustering
    let pointSeries = chart.series.push(am5map.ClusteredPointSeries.new(root, {}));

    // Define clustered bullet (the grouped marker)
    pointSeries.set("clusteredBullet", function (root) {
      let container = am5.Container.new(root, { cursorOverStyle: "pointer" });
      let circle1 = container.children.push(
        am5.Circle.new(root, {
          radius: 8,
          tooltipY: 0,
          fill: am5.color(0xff8c00),
        })
      );
      let circle2 = container.children.push(
        am5.Circle.new(root, {
          radius: 12,
          fillOpacity: 0.3,
          tooltipY: 0,
          fill: am5.color(0xff8c00),
        })
      );
      let circle3 = container.children.push(
        am5.Circle.new(root, {
          radius: 16,
          fillOpacity: 0.3,
          tooltipY: 0,
          fill: am5.color(0xff8c00),
        })
      );
      let label = container.children.push(
        am5.Label.new(root, {
          centerX: am5.p50,
          centerY: am5.p50,
          fill: am5.color(0xffffff),
          populateText: true,
          fontSize: "8",
          text: "{value}",
        })
      );
      container.events.on("click", function (e) {
        pointSeries.zoomToCluster(e.target.dataItem);
      });
      return am5.Bullet.new(root, { sprite: container });
    });

    // Create bullet for individual (non-clustered) markers
    pointSeries.bullets.push(function () {
      let circle = am5.Circle.new(root, {
        radius: 6,
        tooltipY: 0,
        fill: am5.color(0xff8c00),
        tooltipText: "{title}",
      });
      return am5.Bullet.new(root, { sprite: circle });
    });

    // Sample data: an array of cities with latitude and longitude
    let cities = [
      { title: "Vienna", latitude: 48.2092, longitude: 16.3728 },
      { title: "Minsk", latitude: 53.9678, longitude: 27.5766 },
      { title: "Brussels", latitude: 50.8371, longitude: 4.3676 },
      { title: "Sarajevo", latitude: 43.8608, longitude: 18.4214 },
      { title: "Sofia", latitude: 42.7105, longitude: 23.3238 },
      { title: "Zagreb", latitude: 45.815, longitude: 15.9785 },
      { title: "Pristina", latitude: 42.666667, longitude: 21.166667 },
      { title: "Prague", latitude: 50.0878, longitude: 14.4205 },
      { title: "Copenhagen", latitude: 55.6763, longitude: 12.5681 },
      { title: "Tallinn", latitude: 59.4389, longitude: 24.7545 },
      { title: "Helsinki", latitude: 60.1699, longitude: 24.9384 },
      { title: "Paris", latitude: 48.8567, longitude: 2.351 },
      { title: "Berlin", latitude: 52.5235, longitude: 13.4115 },
      { title: "Athens", latitude: 37.9792, longitude: 23.7166 },
      { title: "Budapest", latitude: 47.4984, longitude: 19.0408 },
      { title: "Reykjavik", latitude: 64.1353, longitude: -21.8952 },
      { title: "Dublin", latitude: 53.3441, longitude: -6.2675 },
      { title: "Rome", latitude: 41.8955, longitude: 12.4823 },
      { title: "London", latitude: 51.5002, longitude: -0.1262 },
      { title: "Tokyo", latitude: 35.6785, longitude: 139.6823 }
    ];

    // Function to add a city marker
    function addCity(longitude, latitude, title) {
      pointSeries.data.push({
        geometry: { type: "Point", coordinates: [longitude, latitude] },
        title: title,
      });
    }
    
    // Add each city to the point series
    for (let i = 0; i < cities.length; i++) {
      let city = cities[i];
      addCity(city.longitude, city.latitude, city.title);
    }

    // Animate chart appearance
    chart.appear(1000, 100);

    // Clean up chart on unmount
    return () => {
      root.dispose();
    };
  }, []);

  return <ChartDiv ref={chartRef} id="chartdiv" />;
};

export default AmChartsWorldMap;
