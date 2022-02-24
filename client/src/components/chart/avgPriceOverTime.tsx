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
import { OverTimeChart } from "./overTimeChart";

interface AvgPriceOverTimeProps {
  store_url: string;
  product_id: string;
}

interface AvgPriceOverTimeChartProps {
  title: string;
  values: Array<Array<number>>;
}

export const AvgPriceOverTime: React.FC = () => {
  const [data, setData] = useState<AvgPriceOverTimeChartProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(() => true);
      const resp = await axios.get<AvgPriceOverTimeChartProps[]>(
        API_URL + `/global/avgProductPrice`
      );
      setData(resp.data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <OverTimeChart
      title={"Average Product Prices Over Time, Per Store"}
      data={data}
      isLoading={isLoading}
    />
  );
};
