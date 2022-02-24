import React, { useEffect, useState } from "react";
import { EUI_CHARTS_THEME_LIGHT } from "@elastic/eui/dist/eui_charts_theme";
import {
  Chart,
  Settings,
  Axis,
  LineSeries,
  BarSeries,
  DataGenerator,
  timeFormatter,
  niceTimeFormatByDay,
} from "@elastic/charts";
import {
  EuiTitle,
  EuiPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiLoadingSpinner,
  EuiLink,
} from "@elastic/eui";
import axios from "axios";
import { API_URL, send_url } from "../../util";

interface OverTimeChartProps {
  title: string;
  data: OverTimeChart[];
  isLoading: boolean;
}

interface OverTimeChart {
  title: string;
  values: Array<Array<number>>;
}

const dateFormatter = (v: number) => {
  const date = new Date(v * 1000);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

export const OverTimeChart: React.FC<OverTimeChartProps> = ({
  title,
  data,
  isLoading,
}) => {
  return (
    <>
      <EuiFlexGroup direction={"column"}>
        <EuiFlexItem>
          <EuiTitle size={"xs"}>
            <h1>{title}</h1>
          </EuiTitle>
        </EuiFlexItem>
      </EuiFlexGroup>
      {isLoading ? (
        <EuiFlexGroup direction={"column"} alignItems={"center"}>
          <EuiFlexItem>
            <EuiLoadingSpinner size="l" />
          </EuiFlexItem>
        </EuiFlexGroup>
      ) : (
        <EuiFlexGroup direction={"column"}>
          <EuiFlexItem>
            <EuiFlexItem>
              <Chart size={{ height: 500 }}>
                <Settings
                  theme={EUI_CHARTS_THEME_LIGHT.theme}
                  showLegend={true}
                  legendPosition="right"
                />
                {data.map((item) => {
                  return (
                    <LineSeries
                      key={item.title}
                      id={item.title}
                      name={item.title}
                      data={item.values}
                      xScaleType="time"
                      xAccessor={0}
                      yAccessors={[1]}
                    />
                  );
                })}
                <Axis
                  id="bottom-axis"
                  position="bottom"
                  showGridLines
                  tickFormat={dateFormatter}
                />
                <Axis
                  id="left-axis"
                  position="left"
                  showGridLines
                  tickFormat={(d) => Number(d).toFixed(2)}
                />
              </Chart>
            </EuiFlexItem>
          </EuiFlexItem>
        </EuiFlexGroup>
      )}
    </>
  );
};
