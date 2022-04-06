import "./AnalyticsCard.css";
import "./CommonCard.css";
import { useState } from "react";
import { Card } from "antd";
import { Line } from "@ant-design/charts";
function AnalyticsCard({ cdata }: any) {
  console.log("cdata", cdata);

  const data = cdata.value;

  const config = {
    data,
    xField: "interval",
    yField: "value",
    seriesField: "type",
    xAxis: {
      tickCount: 4,
    },
    height: 200,
    color: ["#e4e4e4", "#1979C9"],
  };
  return (
    <div style={{ width: "33%" }}>
      <Card
        title={cdata.name}
        extra={
          <a href={"/wp-admin/admin.php?page=wc-admin" + cdata.link}>More</a>
        }
        style={{ margin: "10px" }}
      >
        {" "}
        <div className="total-data">
          <span>0%</span>
          <span>-</span>
        </div>
        <Line {...config} />
      </Card>
    </div>
  );
}

export default AnalyticsCard;
