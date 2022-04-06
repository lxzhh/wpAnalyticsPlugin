import "./AnalyticsCard.css";
import "./CommonCard.css";
import { useState } from "react";
import { Card } from "antd";
import { Line } from "@ant-design/charts";
function AnalyticsCard() {
  const [count, setCount] = useState(0);
  const data = [
    { type: "last", year: "1991", value: 3 + 1 },
    { type: "last", year: "1992", value: 4 - 1 },
    { type: "last", year: "1993", value: 3.5 + 1 },
    { type: "last", year: "1994", value: 5 - 1 },
    { type: "last", year: "1995", value: 4.9 + 1 },
    { type: "last", year: "1996", value: 6 - 1 },
    { type: "last", year: "1997", value: 7 + 1 },
    { type: "last", year: "1998", value: 9 - 1 },
    { type: "last", year: "1999", value: 13 + 1 },
    { type: "last", year: "2000", value: 7 },
    { type: "last", year: "2001", value: 9 },
    { type: "last", year: "2002", value: 13 },
    { type: "current", year: "1991", value: 3 },
    { type: "current", year: "1992", value: 4 },
    { type: "current", year: "1993", value: 3.5 },
    { type: "current", year: "1994", value: 5 },
    { type: "current", year: "1995", value: 4.9 },
    { type: "current", year: "1996", value: 6 },
    { type: "current", year: "1997", value: 7 },
    { type: "current", year: "1998", value: 9 },
    { type: "current", year: "1999", value: 13 },
    { type: "current", year: "2000", value: 7 },
    { type: "current", year: "2001", value: 9 },
    { type: "current", year: "2002", value: 13 },
  ];

  const config = {
    data,
    xField: "year",
    yField: "value",
    seriesField: "type",
    xAxis: {
      tickCount: 4,
    },
    height: 200,
    point: {
      size: 5,
      shape: "diamond",
    },
    color: ["#e4e4e4", "#1979C9"],
  };
  return (
    <div style={{ width: "33%" }}>
      <Card
        title="Order"
        extra={<a href="#">More</a>}
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
