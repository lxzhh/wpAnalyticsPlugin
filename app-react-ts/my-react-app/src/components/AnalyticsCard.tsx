import "./AnalyticsCard.css";
import "./CommonCard.css";
import { useState } from "react";
import { Card } from "antd";
import { Line, LineConfig } from "@ant-design/charts";
function AnalyticsCard({ cdata }: any) {
  console.log("cdata", cdata);

  const data = cdata.value;

  let config = {
    data,
    xField: "interval",
    yField: "value",
    seriesField: "type",
    xAxis: {
      tickCount: 4,
    },
    yAxis: {
      label: {
        formatter: (val: any) => {
          if (
            cdata.name === "Total sales" ||
            cdata.name === "Online store sessions"
          ) {
            return (val / 10000).toFixed(1) + "k";
          } else if (cdata.total.endsWith("%")) {
            return `${val * 100}%`;
          }
          return val;
        },
      },
    },
    legend: {
      layout: "horizontal",
      position: "top",
      offsetX: 0,
      itemName: {
        style: () => {
          return { fontSize: 9 };
        },
      },
    },
    height: 200,
    color: ["#e4e4e4", "#1979C9"],
  } as LineConfig;

  return (
    <div style={{ width: "33%" }}>
      <Card
        title={cdata.name}
        extra={
          <a href={"/wp-admin/admin.php?page=wc-admin&" + cdata.link}>More</a>
        }
        style={{ margin: "10px" }}
      >
        {" "}
        <div className="total-data">
          <span>{cdata.total}</span>
          <span>-</span>
        </div>
        <Line {...config} />
      </Card>
    </div>
  );
}

export default AnalyticsCard;
