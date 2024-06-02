import DashboardBox from "@/components/DashboardBox";
import { useGetKpisQuery } from "@/state/api";
import React from "react";
import PortfolioAllocation from "./PortfolioAllocation"; // gridArea A
import ForexDisplay from "./ForexDisplay"; // gridArea B
import PortfolioChart from "./PortfolioChart"; // gridArea C
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"></link>

type Props = {};

function Row1({}: Props) {
    const fromCurrency = "AUD";
    const toCurrency = "USD";
    const apiKey = "5XJL31KJWERXJARF";
    const { data } = useGetKpisQuery();
    return (
        <>
            <DashboardBox gridArea="a"><PortfolioAllocation></PortfolioAllocation></DashboardBox>
            <DashboardBox gridArea="b">
                <ForexDisplay
                    fromCurrency={fromCurrency}
                    toCurrency={toCurrency}
                    apiKey={apiKey}
                />
            </DashboardBox>
             <DashboardBox gridArea="c"><PortfolioChart></PortfolioChart></DashboardBox>
        </>
    );
}

export default Row1;
