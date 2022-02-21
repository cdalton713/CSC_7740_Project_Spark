import React, { useState } from "react";
import { StoreSpecificDataDashboard } from "./storeSpecificDataDashboard";
import {
  EuiPage,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageHeader,
  EuiPageBody,
} from "@elastic/eui";
import { GlobalTrendsDashboard } from "./globalTrendsDashboard";

function App() {
  const [selectedTab, setSelectedTab] = useState<number>(1);
  return (
    <EuiPage paddingSize="none" style={{ minHeight: "100vh" }}>
      <EuiPageBody panelled>
        <EuiPageHeader
          restrictWidth
          // iconType="logoElastic"
          pageTitle="Shopify Data Parser"
          rightSideItems={["Created by Christian Dalton: 89-378-0751"]}
          tabs={[
            {
              label: "Global Trends",
              isSelected: selectedTab === 1,
              onClick: () => setSelectedTab(1),
            },
            {
              label: "Store Specific Data",
              isSelected: selectedTab === 2,
              onClick: () => setSelectedTab(2),
            },
          ]}
        />
        <EuiPageContent
          hasBorder={false}
          hasShadow={false}
          paddingSize="none"
          color="transparent"
          borderRadius="none"
        >
          <EuiPageContentBody restrictWidth>
            {selectedTab === 1 ? (
              <GlobalTrendsDashboard />
            ) : (
              <StoreSpecificDataDashboard />
            )}
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
}

export default App;
