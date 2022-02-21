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

interface PriceOverTimeProps {
  store_url: string;
  product_id: string;
}

interface PriceOverTimeChartProps {
  title: string;
  values: Array<Array<number>>;
}

export const PriceOverTime: React.FC<PriceOverTimeProps> = ({
  store_url,
  product_id,
}) => {
  const [data, setData] = useState<PriceOverTimeChartProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(() => true);
      const resp = await axios.get<PriceOverTimeChartProps[]>(
        API_URL +
          `/store/${send_url(store_url)}/product/${product_id}/price_over_time`
      );
      setData(resp.data);
      setIsLoading(false);
    };

    fetchData();
  }, [store_url, product_id]);

  return (
    <>
      <EuiFlexGroup direction={"column"}>
        <EuiFlexItem>
          <EuiTitle size={"xs"}>
            <h1>Price Over Time</h1>
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
              <Chart size={{ height: 350 }}>
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
                  // title={formatDate(Date.now(), dateFormatAliases.date)}
                  id="bottom-axis"
                  position="bottom"
                  // tickFormat={timeFormatter(niceTimeFormatByDay(1))}
                  showGridLines
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
