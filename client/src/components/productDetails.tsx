import React from "react";
import { ProductData } from "../types/types";
import {
  EuiTitle,
  EuiPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiLink,
} from "@elastic/eui";
import { PriceOverTime } from "./chart/priceOverTime";
import { ProductVariantList } from "./productVariantList";

interface ProductDetailsProps {
  selectedProduct: ProductData | undefined;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  selectedProduct,
}) => {
  if (selectedProduct) {
    return (
      <>
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiTitle size={"s"}>
              <h1>{selectedProduct.title}</h1>
            </EuiTitle>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiPanel>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiText>
                    <EuiLink
                      href={
                        selectedProduct.siteUrl +
                        "/products/" +
                        selectedProduct.handle
                      }
                    >
                      View Product
                    </EuiLink>
                  </EuiText>
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <PriceOverTime
                    store_url={selectedProduct.siteUrl}
                    product_id={selectedProduct.productId}
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiFlexGroup direction={"column"} gutterSize={"s"}>
                <EuiFlexItem>
                  <EuiTitle size={"xs"}>
                    <h1>Product Variants</h1>
                  </EuiTitle>
                </EuiFlexItem>
                <EuiFlexItem>
                  <ProductVariantList
                    store_url={selectedProduct.siteUrl}
                    product_id={selectedProduct.productId}
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiPanel>
          </EuiFlexItem>
        </EuiFlexGroup>
      </>
    );
  } else {
    return null;
  }
};
