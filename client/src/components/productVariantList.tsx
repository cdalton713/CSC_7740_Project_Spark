import React, { useEffect, useState } from "react";
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiListGroup,
  EuiListGroupItem,
  EuiLoadingSpinner,
} from "@elastic/eui";
import axios from "axios";
import { API_URL } from "../util";
import { send_url } from "../util";

interface ProductVariantListProps {
  store_url: string;
  product_id: string;
}

interface Data {
  name: string;
}

export const ProductVariantList: React.FC<ProductVariantListProps> = ({
  store_url,
  product_id,
}) => {
  const [data, setData] = useState<Data[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    setIsLoading(true);
    setData(undefined);
    const fetchData = async () => {
      const resp = await axios.get<Data[]>(
        API_URL + `/store/${send_url(store_url)}/product/${product_id}/variants`
      );

      setData(resp.data);
      setIsLoading(false);
    };
    fetchData();
  }, [store_url, product_id]);
  if (!isLoading && data) {
    return (
      <EuiListGroup flush={true} size={"xs"} wrapText={true} color={"inherit"}>
        {data.map((p) => {
          return (
            <EuiListGroupItem
              wrapText={true}
              color={"text"}
              key={p.name}
              label={p.name}
            />
          );
        })}
      </EuiListGroup>
    );
  } else {
    return (
      <EuiFlexGroup direction={"column"} alignItems={"center"}>
        <EuiFlexItem>
          <EuiLoadingSpinner size="l" />
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  }
};
