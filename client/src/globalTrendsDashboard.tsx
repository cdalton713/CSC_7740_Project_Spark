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
import { AvgPriceOverTime } from "./components/chart/avgPriceOverTime";
import { TotalSitesStat } from "./components/stat/totalSites";
import { TotalGlobalProductsStat } from "./components/stat/totalGlobalProducts";
import { AvgProductsPerSite } from "./components/stat/avgProductsPerSite";
import { ProductCountOverTime } from "./components/chart/productCountOverTime";
import { DaysPerSite } from "./components/chart/daysPerSite";

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
        <EuiFlexItem>
          <EuiFlexGroup>
            <EuiFlexItem>
              <TotalSitesStat />
            </EuiFlexItem>
            <EuiFlexItem>
              <TotalGlobalProductsStat />
            </EuiFlexItem>
            <EuiFlexItem>
              <AvgProductsPerSite />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem>
          <AvgPriceOverTime />
        </EuiFlexItem>
        <EuiFlexItem>
          <ProductCountOverTime />
        </EuiFlexItem>
        <EuiFlexItem>
          <DaysPerSite />
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>
  );
};
