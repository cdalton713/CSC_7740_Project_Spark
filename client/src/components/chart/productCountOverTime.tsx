import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../util";
import { OverTimeChart } from "./overTimeChart";

interface AvgPriceOverTimeChartProps {
  title: string;
  values: Array<Array<number>>;
}

export const ProductCountOverTime: React.FC = () => {
  const [data, setData] = useState<AvgPriceOverTimeChartProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(() => true);
      const resp = await axios.get<AvgPriceOverTimeChartProps[]>(
        API_URL + `/global/productCountOverTime`
      );
      setData(resp.data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <OverTimeChart
      title={"Number of Products for Sale Over Time, Per Store"}
      data={data}
      isLoading={isLoading}
    />
  );
};
