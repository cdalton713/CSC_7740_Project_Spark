import React, { ChangeEvent, useEffect, useState } from "react";
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiFieldText,
  EuiTitle,
  EuiListGroupItem,
  EuiSwitch,
  EuiListGroup,
  EuiLoadingSpinner,
} from "@elastic/eui";
import axios from "axios";
import { API_URL, send_url } from "../util";
import { ProductData } from "../types/types";

interface ProductSelectorProps {
  selectedStore: string | undefined;
  selectedProduct: ProductData | undefined;
  setSelectedProduct: React.Dispatch<
    React.SetStateAction<ProductData | undefined>
  >;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  selectedStore,
  selectedProduct,
  setSelectedProduct,
}) => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [filteredProducts, setFilteredProducts] =
    useState<ProductData[]>(products);
  const [onlyPriceChanges, setOnlyPriceChanges] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setSelectedProduct(undefined);
      if (selectedStore) {
        let resp;
        setProducts([]);
        setFilteredProducts([]);
        if (onlyPriceChanges) {
          resp = await axios.get<ProductData[]>(
            API_URL +
              `/store/${send_url(selectedStore)}/productsWithPriceChanges`
          );
        } else {
          resp = await axios.get<ProductData[]>(
            API_URL + `/store/${send_url(selectedStore)}/products`
          );
        }
        setProducts(resp.data);
        setFilteredProducts(resp.data);
      }
    };
    fetchData();
  }, [selectedStore, onlyPriceChanges]);

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filter = products.filter((i) =>
      i.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredProducts(filter);
  };
  return (
    <>
      <EuiFlexGroup>
        <EuiFlexItem grow={false}>
          <EuiTitle size={"s"}>
            <h1>Products</h1>
          </EuiTitle>
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiFlexGroup direction={"column"}>
        <EuiFlexItem>
          <EuiPanel>
            <EuiFlexGroup direction={"column"}>
              <EuiFlexItem>
                <EuiFieldText
                  compressed={true}
                  onChange={(e) => onSearchChange(e)}
                  placeholder={"Search"}
                />
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiSwitch
                  label={"Only Products With Price Changes"}
                  checked={onlyPriceChanges}
                  onChange={() => setOnlyPriceChanges(() => !onlyPriceChanges)}
                />
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiListGroup
                  flush={true}
                  size={"xs"}
                  wrapText={true}
                  color={"inherit"}
                  style={{
                    minHeight: "50px",
                    maxHeight: "500px",
                    overflow: "scroll",
                    overflowX: "hidden",
                  }}
                >
                  {filteredProducts.length === 0 ? (
                    <EuiFlexGroup
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      <EuiFlexItem grow={false}>
                        <EuiLoadingSpinner size="l" />
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  ) : (
                    <>
                      {filteredProducts.map((p) => {
                        return (
                          <EuiListGroupItem
                            wrapText={true}
                            color={"text"}
                            key={p.productId}
                            label={p.title}
                            onClick={() => setSelectedProduct(p)}
                          />
                        );
                      })}
                    </>
                  )}
                </EuiListGroup>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};
