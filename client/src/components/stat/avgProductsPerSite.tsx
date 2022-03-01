import React, { useState, useEffect } from "react";
import { EuiStat } from "@elastic/eui";
import axios from "axios";
import { API_URL, send_url } from "../../util";

export const AvgProductsPerSite: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<string>();
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(() => true);
      const resp = await axios.get<string>(
        API_URL + `/global/products/avgCount`
      );
      setData(Math.round(parseFloat(resp.data)).toString());
      setIsLoading(false);
    };

    fetchData();
  }, [refresh]);
  return (
    <div onClick={() => setRefresh(() => !refresh)}>
      <EuiStat
        description={"Avg No. Products Per Site"}
        title={data}
        isLoading={isLoading}
        onClick={() => setRefresh(() => !refresh)}
      />
    </div>
  );
};
