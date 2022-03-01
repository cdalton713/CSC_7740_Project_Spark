import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, send_url } from "../../util";
import { OverTimeChart } from "./overTimeChart";

interface AvgPriceOverTimeChartProps {
  title: string;
  values: Array<Array<number>>;
}

interface AvgPriceByProductTypeOvertimeProps {
  store_url: string;
}

export const AvgPriceByProductTypeOvertime: React.FC<
  AvgPriceByProductTypeOvertimeProps
> = ({ store_url }) => {
  const [data, setData] = useState<AvgPriceOverTimeChartProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(() => true);
      const resp = await axios.get<AvgPriceOverTimeChartProps[]>(
        API_URL +
          `/store/${send_url(store_url)}/productTypes/avg_price_over_time`
      );
      setData(resp.data);
      setIsLoading(false);
    };

    fetchData();
  }, [refresh]);

  return (
    <OverTimeChart
      title={
        "Average Product Price per Product Type Over Time (Top 20 Product Types)"
      }
      data={data}
      isLoading={isLoading}
      refresh={refresh}
      setRefresh={setRefresh}
    />
  );
};
