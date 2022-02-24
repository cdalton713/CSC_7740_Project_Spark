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

interface ProductTypeCountProps {
  store_url: string;
}

interface PriceOverTimeChartProps {
  title: string;
  values: Array<Array<number>>;
}

export const ProductTypeCount: React.FC<ProductTypeCountProps> = ({
  store_url,
}) => {
  const [data, setData] = useState<PriceOverTimeChartProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(() => true);
      const resp = await axios.get<PriceOverTimeChartProps[]>(
        API_URL + `/store/${send_url(store_url)}/product_type`
      );
      setData(resp.data);
      setIsLoading(false);
    };

    fetchData();
  }, [store_url]);

  return (
    <CountByCategoryChart
      title={"Product Type Count"}
      data={data}
      isLoading={isLoading}
    />
  );
};
