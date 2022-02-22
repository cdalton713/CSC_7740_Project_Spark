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

interface CountByCategoryChartProps {
  title: string;
  data: any;
  isLoading: boolean;
}

export const CountByCategoryChart: React.FC<CountByCategoryChartProps> = ({
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
              <Chart size={{ height: 300 }}>
                <Settings
                  theme={EUI_CHARTS_THEME_LIGHT.theme}
                  rotation={0}
                  showLegend={false}
                />
                <BarSeries
                  id="id"
                  name={title}
                  data={data}
                  xAccessor="vizType"
                  yAccessors={["count"]}
                />
                <Axis
                  id="bottom-axis"
                  position={"bottom"}
                  showGridLines={false}
                />
                <Axis id="left-axis" position={"left"} />
              </Chart>
            </EuiFlexItem>
          </EuiFlexItem>
        </EuiFlexGroup>
      )}
    </>
  );
};
