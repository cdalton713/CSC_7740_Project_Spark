import React, { useState, useEffect } from "react";
import { EuiStat } from "@elastic/eui";
import axios from "axios";
import { API_URL, send_url } from "../../util";

interface TotalVariantsStatProps {
  store_url: string;
}

export const TotalVariantsStat: React.FC<TotalVariantsStatProps> = ({
  store_url,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<string>();
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(() => true);
      const resp = await axios.get<string>(
        API_URL + `/store/${send_url(store_url)}/variant/count`
      );
      setData(resp.data);
      setIsLoading(false);
    };

    fetchData();
  }, [store_url, refresh]);
  return (
    <div onClick={() => setRefresh(() => !refresh)}>
      <EuiStat
        description={"Total Variants"}
        title={data}
        isLoading={isLoading}
      />
    </div>
  );
};
