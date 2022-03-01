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

interface AvgVariantCountByProductTypeProps {
  store_url: string;
}

interface PriceOverTimeChartProps {
  title: string;
  values: Array<Array<number>>;
}

export const AvgVariantCountByProductType: React.FC<
  AvgVariantCountByProductTypeProps
> = ({ store_url }) => {
  const [data, setData] = useState<PriceOverTimeChartProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(() => true);
      const resp = await axios.get<PriceOverTimeChartProps[]>(
        API_URL + `/store/${send_url(store_url)}/product_type/avg_variant_count`
      );
      setData(resp.data);
      setIsLoading(false);
    };

    fetchData();
  }, [store_url, refresh]);

  return (
    <CountByCategoryChart
      title={"Avg Variant Count By Product Type"}
      data={data}
      isLoading={isLoading}
      refresh={refresh}
      setRefresh={setRefresh}
    />
  );
};
