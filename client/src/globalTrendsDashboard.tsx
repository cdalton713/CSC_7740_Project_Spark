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

export const GlobalTrendsDashboard: React.FC = () => {
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

  return (
    <div>
      <EuiFlexGroup direction={"column"}>
        <EuiFlexItem>blah blah</EuiFlexItem>
      </EuiFlexGroup>
    </div>
  );
};
