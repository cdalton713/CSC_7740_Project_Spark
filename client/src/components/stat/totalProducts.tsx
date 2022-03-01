import React, { useState, useEffect } from "react";
import { EuiStat } from "@elastic/eui";
import axios from "axios";
import { API_URL, send_url } from "../../util";

interface TotalProductsProps {
  store_url: string;
}

export const TotalProductsStat: React.FC<TotalProductsProps> = ({
  store_url,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<string>();
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(() => true);
      const resp = await axios.get<string>(
        API_URL + `/store/${send_url(store_url)}/product/count`
      );
      setData(resp.data);
      setIsLoading(false);
    };

    fetchData();
  }, [store_url, refresh]);
  return (
    <div onClick={() => setRefresh(() => !refresh)}>
      <EuiStat
        description={"Total Products"}
        title={data}
        isLoading={isLoading}
      />
    </div>
  );
};
