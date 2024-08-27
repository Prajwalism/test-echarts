/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import SurfaceChart from "./SurfaceChart";
import { decompressArray } from "./decompressArray";
import volumeJson from "./sampleData.json";

export default function App() {
  // const {
  //   x_min: minX,
  //   y_min: minY,
  //   x_max: maxX,
  //   y_max: maxY,
  //   z_max: maxZ,
  //   z_min: minZ,
  //   base_level: baseLevel,
  //   volume_array: volumeData,
  // } = volumeJson;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(
        "https://yl50tg8488.execute-api.ap-southeast-2.amazonaws.com/Live/volume/?dataset_id=4585&raster_type=dsm&base_plain=lowest&polygon_id=148535&dataset_uav_uid=aefcfc4e-59ca-43d5-97e3-eafeaf115714"
      )
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const {
    x_min: minX,
    y_min: minY,
    x_max: maxX,
    y_max: maxY,
    z_max: maxZ,
    z_min: minZ,
    base_level: baseLevel,
    volume_array: volumeData,
  } = data ? data : {};

  const volumeArray = volumeData && decompressArray(volumeData);

  if (loading) return <h5>Loading ...</h5>;

  return (
    <div className="App">
      <SurfaceChart
        minX={minX}
        maxX={maxX}
        minY={minY}
        maxY={maxY}
        maxZ={maxZ}
        minZ={minZ}
        baseLevel={baseLevel}
        volumeData={volumeArray}
      />
    </div>
  );
}
