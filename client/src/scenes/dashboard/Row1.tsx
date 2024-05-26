import DashboardBox from "@/components/DashboardBox";
import { useGetKpisQuery } from "@/state/api";
import React from "react";
import ForexDisplay from "./ForexDisplay"; // gridArea B

type Props = {};

function Row1({}: Props) {
    const fromCurrency = "AUD";
    const toCurrency = "USD";
    const apiKey = "5XJL31KJWERXJARF";
    const { data } = useGetKpisQuery();
    return (
        <>
            <DashboardBox gridArea="a"></DashboardBox>
            <DashboardBox gridArea="b">
                <ForexDisplay
                    fromCurrency={fromCurrency}
                    toCurrency={toCurrency}
                    apiKey={apiKey}
                />
            </DashboardBox>
            <DashboardBox gridArea="c"></DashboardBox>
        </>
    );
}

export default Row1;
