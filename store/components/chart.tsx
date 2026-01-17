"use client";
import React from "react";
import {
  VictoryLine,
  VictoryChart,
  VictoryScatter,
  VictoryTheme,
} from "victory";

const data = [
  { x: 0, y: 0 },
  { x: 1, y: 2 },
  { x: 2, y: 1 },
  { x: 3, y: 4 },
  { x: 4, y: 3 },
  { x: 5, y: 5 },
];

const cartesianInterpolations = [
  "basis",
  "bundle",
  "cardinal",
  "catmullRom",
  "linear",
  "monotoneX",
  "monotoneY",
  "natural",
  "step",
  "stepAfter",
  "stepBefore",
];



export default function Chart() {
  const [state, setState] = React.useState({
    interpolation: "natural",
  });

  return (
    <div className="pt-4 w-full bg-white">
      <VictoryChart  height={390} theme={VictoryTheme.clean}>
        <VictoryLine interpolation={"natural"} data={data} />
        <VictoryScatter data={data} size={5} />
      </VictoryChart>
    </div>
  );
}
