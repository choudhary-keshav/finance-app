// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/bar
import { ResponsiveBar } from "@nivo/bar";
const BAR_VALUE_PADDING = 5;

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const BarLabels = ({ bars }) => {
  return (
    <g>
      {bars.map(({ width, x, y, data: { formattedValue } }) => (
        <text key={`${x}.${y}`} x={x + width / 2} y={y - BAR_VALUE_PADDING} textAnchor="middle">
          {formattedValue}
        </text>
      ))}
    </g>
  );
};

const MyResponsiveBar = ({ data, indexBy, labelBottom, labelLeft, keys /* see data tab */ }) => (
  <ResponsiveBar
    data={data}
    keys={keys}
    indexBy={indexBy}
    groupMode="grouped"
    theme={{
      text: { fontSize: 18 },
      axis: {
        legend: {
          text: {
            fontSize: 22,
          },
        },
        ticks: {
          text: {
            fontSize: 16,
          },
        },
      },
    }}
    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
    padding={0.3}
    valueScale={{ type: "linear" }}
    indexScale={{ type: "band", round: true }}
    colors={{ scheme: "accent" }}
    layers={["grid", "axes", "bars", BarLabels, "legends"]} // unlike @trymbill I just use the original bars and add the bar labels in a separate layer like @mkusold
    enableLabel={false} // disable labels in the original bars
    defs={[
      {
        id: "dots",
        type: "patternDots",
        background: "inherit",
        color: "#38bcb2",
        size: 4,
        padding: 1,
        stagger: true,
      },
      {
        id: "lines",
        type: "patternLines",
        background: "inherit",
        color: "#eed312",
        rotation: -45,
        lineWidth: 6,
        spacing: 10,
      },
    ]}
    fill={[
      {
        match: {
          id: "fries",
        },
        id: "dots",
      },
      {
        match: {
          id: "sandwich",
        },
        id: "lines",
      },
    ]}
    borderColor={{
      from: "color",
      modifiers: [["darker", 1.6]],
    }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: -2,
      tickPadding: 5,
      tickRotation: 0,
      legend: labelBottom,
      legendPosition: "middle",
      legendOffset: 32,
      truncateTickAt: 0,
    }}
    axisLeft={{
      tickSize: -2,
      tickPadding: 0,
      tickRotation: 0,
      legend: labelLeft,
      legendPosition: "middle",
      legendOffset: -52,
      truncateTickAt: 0,
    }}
    labelSkipWidth={12}
    labelSkipHeight={12}
    labelTextColor={{
      from: "color",
      modifiers: [["darker", 1.6]],
    }}
    enableTotals={true}
    legends={[
      {
        dataFrom: "keys",
        anchor: "bottom-right",
        direction: "column",
        justify: false,
        translateX: 120,
        translateY: 0,
        itemsSpacing: 2,
        itemWidth: 100,
        itemHeight: 20,
        itemDirection: "left-to-right",
        itemOpacity: 0.85,
        symbolSize: 20,
        effects: [
          {
            on: "hover",
            style: {
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
    role="application"
    ariaLabel="Nivo bar chart demo"
    barAriaLabel={(e) => e.id + ": " + e.formattedValue + " in country: " + e.indexValue}
  />
);

export default MyResponsiveBar;
