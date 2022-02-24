import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiTitle,
  EuiSpacer,
  EuiStat,
} from "@elastic/eui";
import { ProductSelector } from "./productSelector";
import React, { useState } from "react";
import { ProductData } from "../types/types";
import { ProductDetails } from "./productDetails";
import { ProductTypeCount } from "./chart/productTypeCount";
import { VendorCount } from "./chart/vendorCount";
import { AvgPriceByProductType } from "./chart/avgPriceByProductType";
import { TotalProductsStat } from "./stat/totalProducts";
import { TotalVariantsStat } from "./stat/totalVariants";
import { AvgVariantCountByProductType } from "./chart/avgVariantCountByProductType";
import { AvgPriceByProductTypeOvertime } from "./chart/avgPriceByProductTypeOverTime";

interface SelectedStoreDashboardProps {
  selectedStore: string | undefined;
}

export const SelectedStoreDashboard: React.FC<SelectedStoreDashboardProps> = ({
  selectedStore,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductData>();

  if (selectedStore) {
    return (
      <>
        <EuiFlexGroup direction={"column"}>
          <EuiFlexItem grow={false}>
            <EuiTitle size={"s"}>
              <h1>Store Details</h1>
            </EuiTitle>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <TotalProductsStat store_url={selectedStore} />
                </EuiFlexItem>
                <EuiFlexItem>
                  <TotalVariantsStat store_url={selectedStore} />
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <ProductTypeCount store_url={selectedStore} />
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <VendorCount store_url={selectedStore} />
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <AvgPriceByProductType store_url={selectedStore} />
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <AvgPriceByProductTypeOvertime store_url={selectedStore} />
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <AvgVariantCountByProductType store_url={selectedStore} />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiPanel>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer size={"l"} />
        <EuiFlexGroup alignItems={"flexStart"}>
          <EuiFlexItem grow={1}>
            <ProductSelector
              selectedStore={selectedStore}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={2}>
            <ProductDetails selectedProduct={selectedProduct} />
          </EuiFlexItem>
        </EuiFlexGroup>
      </>
    );
  } else {
    return null;
  }
};
