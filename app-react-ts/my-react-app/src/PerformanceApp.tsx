import { ReactNode, useEffect, useState } from "react";
import { Descriptions, Space, Table, TableProps, Tooltip } from "antd";
import { StarFilled, QuestionCircleFilled } from "@ant-design/icons";
import { ColumnsType, ColumnType } from "antd/es/table";
import moment from "moment";
import "antd/dist/antd.css";
import "./App.css";
interface DetailInfo {
  key: string;
  type: string;
  "30days": string | ReactNode;
  "90days": string | ReactNode;
  "12months": string | ReactNode;
  target: string;
  [key: string]: any; // 字段扩展声明
}

function RateStar(params: any) {
  const { type } = params;
  return <StarFilled style={{ color: type, fontSize: "24px" }} />;
}
function App() {
  console.log("performance app");

  const dateFormat = moment.HTML5_FMT.DATE;
  const columns: ColumnsType<DetailInfo> = [
    {
      title: <h4>Detail Type</h4>,
      dataIndex: "type",
      key: "type",
      render: (text: string) => {
        return (
          <h4 style={{ marginLeft: text.startsWith("-") ? 10 : 0 }}>
            {text}
            {"  "}
            <Tooltip placement="leftTop" title={"Description of this type"}>
              <QuestionCircleFilled
                style={{ color: "#40a9ff", marginLeft: 2 }}
              />
            </Tooltip>
          </h4>
        );
      },
    },
    {
      title: (
        <h4>
          30 Days
          <br /> {moment().subtract(30, "days").format(dateFormat)} -{" "}
          {moment().format(dateFormat)}
        </h4>
      ),
      dataIndex: "30days",
      key: "30days",
    },
    {
      title: (
        <h4>
          90 Days
          <br /> {moment().subtract(90, "days").format(dateFormat)} -{" "}
          {moment().format(dateFormat)}
        </h4>
      ),
      dataIndex: "90days",
      key: "90days",
    },
    {
      title: (
        <h4>
          12 Months
          <br /> {moment().subtract(12, "months").format(dateFormat)} -{" "}
          {moment().format(dateFormat)}
        </h4>
      ),
      dataIndex: "12months",
      key: "12months",
    },
    {
      title: "Target",
      dataIndex: "target",
      key: "target",
    },
  ];

  let data: DetailInfo[] = [
    {
      key: "1",
      type: "Order Defect Rate",
      "30days": "2.31%(231/10,000)",
      "90days": "0.77% (231/30,000)",
      "12months": "0.19% (231/120,000)",
      target: "< 1%",
    },
    {
      key: "2",
      type: "- Negative Seller Rating Rate",
      "30days": "2.31% (231)",
      "90days": "0.77% (231)",
      "12months": "0.19% (231)",
      target: "--",
    },
    {
      key: "3",
      type: "- Chargeback Rate",
      "30days": "0% (0)",
      "90days": "0% (0)",
      "12months": "0% (0)",
      target: "--",
    },
    {
      key: "4",
      type: "On-time Order Fulfillment Rate",
      "30days": "99.47% (9,947/10,000)",
      "90days": "99.62% (29,886/30000)",
      "12months": "99.62% (119,544/120,000)",
      target: "< >= 98%",
    },
    {
      key: "5",
      type: "Pre-fulfillment Order Void Rate",
      "30days": "0% (0/10,000)",
      "90days": "0% (0/30,000)",
      "12months": "0% (0/120,000)",
      target: "< 2.5%",
    },
    {
      key: "6",
      type: "Refund Rate",
      "30days": "3.17% (6/189)",
      "90days": "5.75% (15/261)",
      "12months": "5.75% (15/261)",
      target: "< 2.5%",
    },
    {
      key: "7",
      type: "On-time Order Delivery Rate",
      "30days": "99.43% (173/174)",
      "90days": "99.43% (173/174)",
      "12months": "99.43% (173/174)",
      target: ">= 95%",
    },
    {
      key: "8",
      type: "Valid Order Tracking Number Rate",
      "30days": "100% (185/185)",
      "90days": "100% (185/185)",
      "12months": "100% (185/185)",
      target: ">= 95%",
    },
  ];
  const styledData = data.map((detail: DetailInfo) => {
    const styledDetail = {} as DetailInfo;

    Object.keys(detail).map((key: string) => {
      const value = detail[key];
      console.log(key, value);

      let match = /(.*)\(/gm.exec(value);
      if (match) {
        console.log("match", match[1]);
        const styledText = value.replace(
          match[1],
          `<b style="text-decoration: underline;">${match[1]}</b>`
        );
        const innerhtml = `<div ">${styledText}</div>`;

        styledDetail[key] = (
          <div
            className="Container"
            dangerouslySetInnerHTML={{ __html: innerhtml }}
          ></div>
        );
      } else {
        styledDetail[key] = value;
      }
    });
    return styledDetail;
  });
  return (
    <div style={{ margin: 10 }}>
      <h1>Seller Performance Report</h1>
      <Descriptions
        title="Performance Summary"
        layout="vertical"
        bordered
        column={4}
        style={{ marginTop: 16 }}
      >
        <Descriptions.Item label="Order Defect Rate">
          <RateStar type="green" />
        </Descriptions.Item>
        <Descriptions.Item label="On-time Order Fulfillment Rate">
          <RateStar type="green" />
        </Descriptions.Item>
        <Descriptions.Item label="Pre-fulfillment Order Void Rate">
          <RateStar type="green" />
        </Descriptions.Item>
        <Descriptions.Item label="Refund Rate">
          <RateStar type="green" />
        </Descriptions.Item>
        <Descriptions.Item label="On-time Order Delivery Rate">
          <RateStar type="green" />
        </Descriptions.Item>
        <Descriptions.Item label="Valid Order Tracking Number Rate">
          <RateStar type="green" />
        </Descriptions.Item>
        <Descriptions.Item label="Customer Message Response Time">
          <RateStar type="green" />
        </Descriptions.Item>
        <Descriptions.Item label="Policy Violation">
          <RateStar type="green" />
        </Descriptions.Item>
      </Descriptions>
      <div style={{ marginTop: 36 }}>
        <div className="ant-descriptions-title">Performance Detail</div>
        <Table
          pagination={false}
          columns={columns}
          dataSource={styledData}
          style={{ marginTop: 16 }}
        />
      </div>
    </div>
  );
}
export default App;
