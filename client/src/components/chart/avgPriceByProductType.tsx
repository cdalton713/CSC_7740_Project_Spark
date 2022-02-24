import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, send_url } from "../../util";
import { CountByCategoryChart } from "./countByCategoryCart";

interface AvgPriceByProductTypeProps {
  store_url: string;
}

interface PriceOverTimeChartProps {
  title: string;
  values: Array<Array<number>>;
}

export const AvgPriceByProductType: React.FC<AvgPriceByProductTypeProps> = ({
  store_url,
}) => {
  const [data, setData] = useState<PriceOverTimeChartProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(() => true);
      const resp = await axios.get<PriceOverTimeChartProps[]>(
        API_URL + `/store/${send_url(store_url)}/product_type/average_price`
      );
      setData(resp.data);
      setIsLoading(false);
    };

    fetchData();
  }, [store_url]);

  return (
    <CountByCategoryChart
      title={"Avg Product Price by Product Type"}
      data={data}
      isLoading={isLoading}
    />
  );
};
