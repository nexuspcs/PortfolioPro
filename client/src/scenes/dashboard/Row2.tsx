import DashboardBox from "@/components/DashboardBox";
import React from "react";
import TimeZoneDisplay from "./TimeZoneDisplay"; // Adjust the path as necessary

type Props = {};

const Row2 = (props: Props) => {
  return (
    <>
      <DashboardBox gridArea="d"></DashboardBox>
      <DashboardBox gridArea="e">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <TimeZoneDisplay timeZone="America/New_York" />
          <TimeZoneDisplay timeZone="Europe/London" />
          <TimeZoneDisplay timeZone="Asia/Tokyo" />
          <TimeZoneDisplay timeZone="Australia/Sydney" />
        </div>
      </DashboardBox>
      <DashboardBox gridArea="f"></DashboardBox>
    </>
  );
};

export default Row2;