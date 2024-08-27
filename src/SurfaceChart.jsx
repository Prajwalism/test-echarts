/* eslint-disable react/prop-types */
import { useEffect } from "react";
import * as echarts from "echarts";
import "echarts-gl";

const volumeChartColors = {
  fillColor: "#3B0852",
  cutColor: "#FAEA70",
  cuttingPlane: "#3C9AA7",
};

const getOption = (minX, maxX, minY, maxY, minZ, maxZ, data, baseLevel) => {
  const xInterval = (maxX - minX) / (data?.length - 1);
  const yInterval = (maxY - minY) / (data?.[0].length - 1);

  const datax = data;

  // Prepare the data in [x, y, z] format
  const formattedData = [];
  for (let i = 0; i < datax.length; i += 1) {
    for (let j = 0; j < datax[i].length; j += 1) {
      formattedData.push([
        minX + i * xInterval,
        minY + j * yInterval,
        datax[i][j],
      ]);
    }
  }

  const basePlaneData = [];
  for (let i = 0; i < datax.length; i += datax.length - 1) {
    for (let j = 0; j < datax[i].length; j += datax[i].length - 1) {
      basePlaneData.push([
        minX + i * xInterval,
        minY + j * yInterval,
        baseLevel,
      ]);
    }
  }

  // ECharts option
  const option = {
    tooltip: {},
    xAxis3D: {
      type: "value",
      min: minX,
      max: maxX,
    },
    yAxis3D: {
      type: "value",
      min: minY,
      max: maxY,
    },
    zAxis3D: {
      type: "value",
      min: minZ,
      max: maxZ,
    },
    grid3D: {
      viewControl: {
        projection: "perspective",
      },
    },
    series: [
      {
        name: "Surface Plot",
        type: "surface",
        wireframe: {
          show: true,
        },
        data: formattedData,
        progressive: 400,
        large: true,
        itemStyle: {
          color: (params) => {
            const zValue = params.value[2];
            if (zValue < baseLevel) {
              return volumeChartColors.fillColor;
            } else {
              return volumeChartColors.cutColor;
            }
          },
        },
      },
      {
        name: "Cutting Plane",
        type: "surface",
        wireframe: {
          show: true,
        },
        data: basePlaneData,
        itemStyle: {
          opacity: 0.5,
          color: "#3C9AA7",
        },
      },
    ],
  };

  return option;
};

const SurfaceChart = ({
  minX = 0,
  maxX = 0,
  minY = 0,
  maxY = 0,
  baseLevel = 0,
  volumeData,
  maxZ = 0,
  minZ = 0,
}) => {
  console.log(volumeData, "volume");
  useEffect(() => {
    if (!volumeData) return null;

    const option = getOption(
      minX,
      maxX,
      minY,
      maxY,
      minZ,
      maxZ,
      volumeData,
      baseLevel
    );
    if (option) {
      const chartDom = document.getElementById("chartholder");
      const myChart = echarts.init(chartDom, null, {
        renderer: "webgl",
        useDirtyRect: false,
      });
      myChart.setOption(option);
    }
  }, [baseLevel]); // eslint-disable-line

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2>Surface chart</h2>
        <h4 style={{ color: "green" }}>(echarts)</h4>
      </div>
      <div id="chartholder" />
    </div>
  );
};

export default SurfaceChart;
