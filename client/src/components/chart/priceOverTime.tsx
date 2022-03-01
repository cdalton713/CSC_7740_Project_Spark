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
  const [refresh, setRefresh] = useState<boolean>(false);
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
  }, [store_url, product_id, refresh]);

  return (
    <OverTimeChart
      title={"Price Over Time"}
      data={data}
      isLoading={isLoading}
      refresh={refresh}
      setRefresh={setRefresh}
    />
  );
};
