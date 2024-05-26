import DashboardBox from "@/components/DashboardBox";
import { useGetKpisQuery } from "@/state/api";
import React from "react";
import getLatestFXRate from "./curr1tocurr2compar";

type Props = {};

function Row1({}: Props) {

  const { data } = useGetKpisQuery();
    return (
        <>
            <DashboardBox gridArea="a"></DashboardBox>
            <DashboardBox gridArea="b">Chuck FX here??</DashboardBox>
            <DashboardBox gridArea="c"></DashboardBox>
        </>
    );
}

export default Row1;
