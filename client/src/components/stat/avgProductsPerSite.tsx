import React, { useState, useEffect } from "react";
import { EuiStat } from "@elastic/eui";
import axios from "axios";
import { API_URL, send_url } from "../../util";

export const AvgProductsPerSite: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<string>();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(() => true);
      const resp = await axios.get<string>(
        API_URL + `/global/products/avgCount`
      );
      setData(resp.data);
      setIsLoading(false);
    };

    fetchData();
  }, []);
  return (
    <EuiStat
      description={"Avg No. Products Per Site"}
      title={data}
      isLoading={isLoading}
    />
  );
};
