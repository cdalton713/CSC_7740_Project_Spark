import React, { ChangeEvent, useEffect, useState } from "react";
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiSelect,
  EuiHorizontalRule,
  EuiSelectOption,
  EuiTitle,
} from "@elastic/eui";
import axios from "axios";
import { StoreUrl } from "./types/types";
import { SelectedStoreDashboard } from "./components/selectedStoreDashboard";
import { API_URL } from "./util";

export const StoreSpecificDataDashboard: React.FC = () => {
  const [stores, setStores] = useState<EuiSelectOption[]>();
  const [selectedStore, setSelectedStore] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      const resp = await axios.get<StoreUrl[]>(API_URL + "/store/urls");

      const data = resp.data;
      const options = [{ value: "", text: "" }];
      for (const row of data) {
        options.push({ value: row.url, text: row.url });
      }

      setStores(options);
    };
    fetchData();
  }, []);

  const onStoreSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedStore(e.target.value);
  };

  return (
    <div style={{ minHeight: "80h" }}>
      <EuiFlexGroup justifyContent={"center"}>
        <EuiFlexItem grow={1}>
          <EuiTitle size={"s"}>
            <h1>Select a Store</h1>
          </EuiTitle>
          <EuiSelect options={stores} onChange={onStoreSelectChange} />
        </EuiFlexItem>
      </EuiFlexGroup>
      <SelectedStoreDashboard selectedStore={selectedStore} />
    </div>
  );
};
