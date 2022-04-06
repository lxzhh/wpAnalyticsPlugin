import { useEffect, useState } from "react";
import "./App.css";
import Axios from "axios";
import "antd/dist/antd.css";
import { Col, DatePicker, Row } from "antd";
import Analytics from "./components/AnalyticsCard";
import ConversionCard from "./components/ConversionCard";
import { RangeValue } from "rc-picker/lib/interface";
import moment, { Moment } from "moment";
import {
  performIndicators,
  currentRevenueStats,
  previousRevenueStats,
  currentOrderStats,
  previousOrderStats,
} from "./response";
import { setDate } from "date-fns";
const { RangePicker } = DatePicker;
const kVisitorCountRatio = 66;
const kViewerCountRatio = 79;
const ASCIISum = (str: string) =>
  Math.floor(
    str
      .split("")
      .map((item) => item.charCodeAt(0))
      .reduce((prev, next) => prev + next)
  );
function App() {
  // 时间区间
  const [dateValues, setDateValues] = useState<RangeValue<Moment>>([
    moment(),
    moment(),
  ] as RangeValue<Moment>);
  // 总数字
  const [totalData, setTotalData] = useState<Array<any>>([]);
  // 时间序列数字

  const [conversionData, setConversionData] = useState<ConversionData.RateData>(
    {} as ConversionData.RateData
  );
  function onChange(
    values: RangeValue<Moment>,
    formatString: [string, string]
  ) {
    console.log("Selected Time: ", values);
    console.log("Formatted Selected Time: ", formatString);
    setDateValues(values);
  }

  function onOk(value: RangeValue<Moment>) {
    console.log("onOk: ", value);
  }

  function handlePerformanceIndicator(res: any) {
    console.log("get analytics data", res);
    const indicatorObject = res.data.reduce(
      (obj: any, item: PerformanceIndicator.Indicator) =>
        Object.assign(obj, { [item.stat]: item }),
      {}
    ) as Record<string, PerformanceIndicator.Indicator>;
    const orderCount = indicatorObject["orders/orders_count"].value || 0;
    const visitorCount = orderCount * kVisitorCountRatio;
    const _conversionRate =
      ((ASCIISum(location.href) + dateValues![0]!.unix() || 0) % 300) / 100 + 2;
    console.log("conversionRate", _conversionRate, ASCIISum(location.href));
    const conversionRate = _conversionRate;
    const totalSale = indicatorObject["revenue/total_sales"].value;
    const totalRefund = indicatorObject["revenue/refunds"].value;
    setTotalData([
      {
        name: "Visitors",
        value: visitorCount,
      },
      {
        name: "Order count",
        value: orderCount,
      },
      {
        name: "Conversion rate",
        value: `${conversionRate}%`,
      },
      {
        name: "Total sale",
        value: `${totalSale} usd`,
      },
      {
        name: "Refund",
        value: `${totalRefund} usd`,
      },
    ]);
    const totalSessions = orderCount * kVisitorCountRatio || 11989;
    const cartConversionRate =
      ((ASCIISum(location.href) + dateValues![0]!.unix() || 0) % 400) / 100 +
      2.1;
    setConversionData({
      conversionRate: _conversionRate,
      totalSessions: totalSessions,
      cartRate: cartConversionRate,
      checkoutRate: cartConversionRate * 0.9,
    });
  }
  function handleRevenue(currentData: any, previousData: any) {}
  function handleOrderData(currentData: any, previousData: any) {}
  if (process.env.NODE_ENV === "development") {
    useEffect(() => {
      handlePerformanceIndicator({ data: performIndicators });
      handleRevenue(
        { data: currentRevenueStats },
        { data: previousRevenueStats }
      );
      handleOrderData(
        { data: currentOrderStats },
        { data: previousOrderStats }
      );
    }, []);
  } else {
    Axios.get("/wp-json/wc-analytics/reports/performance-indicators", {
      params: {
        after: "2022-04-01T00:00:00",
        before: "2022-04-03T23:59:59",
        stats:
          "revenue/total_sales,revenue/net_revenue,orders/orders_count,orders/avg_order_value,products/items_sold,revenue/refunds,coupons/orders_count,coupons/amount,taxes/total_tax,taxes/order_tax,taxes/shipping_tax,revenue/shipping,downloads/download_count,jetpack/stats/visitors,variations/items_sold,revenue/gross_sales,jetpack/stats/views",
        _locale: "user",
      },
    }).then(handlePerformanceIndicator);
    Axios.get("/wp-json/wc-analytics/reports/revenue/stats", {
      params: {
        after: "2022-04-01T00:00:00",
        before: "2022-04-03T23:59:59",
        order: "asc",
        interval: "day",
        per_page: 100,
        "fields[0]": "total_sales",
        "fields[1]": "net_revenue",
        "fields[2]": "refunds",
        "fields[3]": "shipping",
        _locale: "user",
      },
    }).then((res) => {
      console.log("get analytics revenue/stats", res);
    });
  }

  return (
    <div className="App">
      <RangePicker
        format="YYYY-MM-DD"
        ranges={{
          Today: [moment(), moment()],
          "This Month": [moment().startOf("month"), moment().endOf("month")],
        }}
        onChange={onChange}
        onOk={onOk}
      />
      <Row className="total-data-board" align="middle">
        <Col offset={2}></Col>
        {totalData.map((data, i) => {
          return (
            <Col span={4} className="total-data-col" key={i}>
              <p className="total-data-title">{data.name}</p>
              <p className="total-data-number">{data.value}</p>
            </Col>
          );
        })}
        <Col offset={2}></Col>
      </Row>
      <div className="dashboard-table">
        {[...Array(5)].map((_, i) => {
          if (i == 3) {
            return (
              <ConversionCard key={i} cdata={conversionData}></ConversionCard>
            );
          } else {
            return <Analytics key={i}></Analytics>;
          }
        })}
      </div>
    </div>
  );
}

export default App;
