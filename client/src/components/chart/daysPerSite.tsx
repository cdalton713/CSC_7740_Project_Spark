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
import { CountByCategoryChart } from "./countByCategoryCart";

interface PriceOverTimeChartProps {
  title: string;
  values: Array<Array<number>>;
}

export const DaysPerSite: React.FC = () => {
  const [data, setData] = useState<PriceOverTimeChartProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(() => true);
      const resp = await axios.get<PriceOverTimeChartProps[]>(
        API_URL + `/global/data/daysPerSite`
      );
      setData(resp.data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <CountByCategoryChart
      title={"Days of Data, Per Site"}
      data={data}
      isLoading={isLoading}
    />
  );
};
