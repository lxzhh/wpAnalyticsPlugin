import { useEffect, useState } from "react";
import "./App.css";
import Axios from "axios";
import "antd/dist/antd.css";
import { Col, DatePicker, Row } from "antd";
import Analytics from "./components/AnalyticsCard";
import ConversionCard from "./components/ConversionCard";
import { RangeValue } from "rc-picker/lib/interface";
import moment, { Moment } from "moment";
import { performIndicators } from "./response";
const { RangePicker } = DatePicker;
const kVisitorCountRatio = Math.random() + 0.5;
const ASCIISum = (str: string) =>
  Math.floor(
    str
      .split("")
      .map((item) => item.charCodeAt(0))
      .reduce((prev, next) => prev + next)
  );

// 创建请求实例
let client = Axios.create({
  timeout: 60000,
});
if (process.env.NODE_ENV === "development") {
  client = Axios.create({
    baseURL: "https://dashikion.com/",
    timeout: 60000,
  });
}
function App() {
  // 时间区间
  const [dateValues, setDateValues] = useState<RangeValue<Moment>>([
    moment().subtract(7, "days"),
    moment(),
  ] as RangeValue<Moment>);
  const [conversionData, setConversionData] = useState<ConversionData.RateData>(
    {} as ConversionData.RateData
  );
  const [previousDateValues, setPreviousDateValues] = useState<
    Array<Moment | undefined>
  >([moment(), moment()]);
  // 总数字
  const [totalData, setTotalData] = useState<Array<any>>([]);
  // 时间序列数字
  const [intervalData, setIntervalData] = useState<Record<string, any>>([]);

  /**
   * Date range picker changed
   */
  function onChange(
    values: RangeValue<Moment>,
    formatString: [string, string]
  ) {
    console.log("Selected Time: ", values);
    console.log("Formatted Selected Time: ", formatString);
    setDateValues(values);
    const afterDate = dateValues![0];
    const beforeDate = dateValues![1];
    const durationDays = beforeDate!.diff(afterDate, "days");
    const previousAfterDate = afterDate
      ?.clone()
      ?.subtract(durationDays, "days");
    const previousBeforeDate = afterDate?.clone().subtract(1, "days");
    setPreviousDateValues([previousAfterDate, previousBeforeDate]);
  }

  function onOk(value: RangeValue<Moment>) {
    console.log("onOk: ", value);
  }

  /**
   * 处理总数据
   * @param currentData
   */
  function handlePerformanceIndicator(currentData: any) {
    console.log("get analytics data", currentData);
    const orderCount = currentData.data.totals.orders_count || 0;
    // 根据站点域名和时间跨度计算出来的随机值
    const siteRandomValue =
      ASCIISum(location.host) +
        dateValues![0]!.unix() +
        dateValues![1]!.unix() || 0;
    const _conversionRate = (siteRandomValue % 300) / 100 + 2;
    console.log("conversionRate", _conversionRate, ASCIISum(location.href));
    const conversionRate = _conversionRate;
    const totalSale = currentData.data.totals.total_sales;
    const totalRefund = currentData.data.totals.refunds;
    const totalSessions = Math.floor((orderCount / _conversionRate) * 100);
    // visitor 控制在0.5 - 1.5倍之间
    const visitorCount = Math.floor(totalSessions * kVisitorCountRatio);

    setTotalData([
      {
        name: "Visitors",
        value: new Intl.NumberFormat().format(visitorCount),
      },
      {
        name: "Order count",
        value: new Intl.NumberFormat().format(orderCount),
      },
      {
        name: "Conversion rate",
        value: `${conversionRate.toFixed(2)}%`,
      },
      {
        name: "Total sale",
        value: `$${new Intl.NumberFormat().format(totalSale!)}`,
      },
      {
        name: "Refund",
        value: `$${new Intl.NumberFormat().format(totalRefund!)}`,
      },
    ]);
    const cartConversionRate = (siteRandomValue % 400) / 100 + 6.5;
    const _cvData = {
      conversionRate: _conversionRate,
      totalSessions: totalSessions,
      cartRate: cartConversionRate,
      checkoutRate: (siteRandomValue % 300) / 100 + 2.8,
      convertedSessions: orderCount,
    };
    setConversionData(_cvData);
    return _cvData;
  }

  /**
   * 处理时间序列数据
   * @param dataList
   */
  function handleRevenue(dataList: any[]) {
    const currentData = dataList[0];
    const previousData = dataList[1];
    const durationDays = moment(currentData.data.intervals[0].date_end).diff(
      moment(previousData.data.intervals[0].date_end),
      "days"
    );
    console.log("dataList", dataList, "durationDays", durationDays);
    const afterDate = dateValues![0];
    const beforeDate = dateValues![1];
    const [previousAfterDate, previousBeforeDate] = previousDateValues;
    const labelFormat = "MMM DD YYYY";
    const concatData = previousData.data.intervals
      .map((d: any) => {
        d.date_axis = moment(d.date_end)
          .add(durationDays, "days")
          .format(moment.HTML5_FMT.DATE);
        d.type = `${afterDate?.format(labelFormat)} - ${beforeDate?.format(
          labelFormat
        )}`;
        return d;
      })
      .concat(
        currentData.data.intervals.map((d: any) => {
          d.date_axis = moment(d.date_end).format(moment.HTML5_FMT.DATE);
          d.type = `${previousAfterDate?.format(
            labelFormat
          )} - ${previousBeforeDate?.format(labelFormat)}`;
          return d;
        })
      );
    const _cvData = handlePerformanceIndicator(currentData);

    const totalSales = concatData.map((d: IntervalStats.Interval) => {
      return {
        interval: d.date_axis,
        value: d.subtotals.total_sales,
        type: d.type,
      };
    });
    const totalSessions = concatData.map((d: IntervalStats.Interval) => {
      return {
        interval: d.date_axis,
        value: Math.floor(
          (d.subtotals.orders_count / _cvData.conversionRate) * 100
        ),
        type: d.type,
      };
    });
    const refundRate = concatData.map((d: IntervalStats.Interval) => {
      return {
        interval: d.date_axis,
        value: Number(
          (d.subtotals.refunds / Math.abs(d.subtotals.total_sales)).toFixed(2)
        ),
        type: d.type,
      };
    });
    const avgValue = concatData.map((d: IntervalStats.Interval) => {
      return {
        interval: d.date_axis,
        value: d.subtotals.avg_order_value,
        type: d.type,
      };
    });
    const totalOrders = concatData.map((d: IntervalStats.Interval) => {
      return {
        interval: d.date_axis,
        value: d.subtotals.orders_count,
        type: d.type,
      };
    });
    setIntervalData([
      {
        name: "Total sales",
        value: totalSales,
        link: "chart=total_sales&path=%2Fanalytics%2Frevenue",
        total: `$${new Intl.NumberFormat().format(
          currentData.data.totals.total_sales.toFixed(2)
        )}`,
      },
      {
        name: "Online store sessions",
        value: totalSessions,
        link: "/jetpack",
        total: new Intl.NumberFormat().format(
          Math.floor(
            (currentData.data.totals.orders_count / _cvData.conversionRate) *
              100
          )
        ),
      },
      {
        name: "Returning customer rate",
        value: refundRate,
        link: "chart=refunds&path=%2Fanalytics%2Frevenue",
        total: `${(
          (currentData.data.totals.refunds /
            currentData.data.totals.gross_sales) *
          100
        ).toFixed(2)} %`,
      },
      {
        name: "Online store conversion rate",
        value: _cvData,
      },
      {
        name: "Avg order value",
        value: avgValue,
        link: "chart=avg_order_value&path=%2Fanalytics%2Forders",
        total: `$${currentData.data.totals.avg_order_value.toFixed(2)}`,
      },
      {
        name: "Total orders",
        value: totalOrders,
        link: "chart=orders_count&path=%2Fanalytics%2Forders",
        total: new Intl.NumberFormat().format(
          currentData.data.totals.orders_count
        ),
      },
    ]);
  }
  useEffect(() => {
    const afterDate = dateValues![0];
    const beforeDate = dateValues![1];
    const durationDays = beforeDate!.diff(afterDate, "days");
    let intervalType = durationDays > 14 ? "week" : "day";
    // if (process.env.NODE_ENV === "development") {
    //   handlePerformanceIndicator({ data: performIndicators });
    // }
    const dataReq = () => {
      console.log("performanceIndicatorReq then");

      const currentDataReq = client.get(
        "/wp-json/wc-analytics/reports/revenue/stats",
        {
          params: {
            after: afterDate?.format(),
            before: beforeDate?.format(),
            order: "asc",
            interval: intervalType,
            per_page: 100,
            "fields[0]": "total_sales",
            "fields[1]": "net_revenue",
            "fields[2]": "refunds",
            "fields[3]": "avg_order_value",
            "fields[4]": "orders_count",
            "fields[5]": "gross_sales",
            _locale: "user",
          },
        }
      );
      const previousAfterDate = afterDate
        ?.clone()
        ?.subtract(durationDays, "days")
        .format();
      const previousBeforeDate = afterDate
        ?.clone()
        .subtract(1, "days")
        .format();
      console.log(
        "previousAfterDate",
        previousAfterDate,
        "previousBeforeDate",
        previousBeforeDate
      );

      const previousDataReq = client.get(
        "/wp-json/wc-analytics/reports/revenue/stats",
        {
          params: {
            after: previousAfterDate,
            before: previousBeforeDate,
            order: "asc",
            interval: intervalType,
            per_page: 100,
            "fields[0]": "total_sales",
            "fields[1]": "net_revenue",
            "fields[2]": "refunds",
            "fields[3]": "avg_order_value",
            "fields[4]": "orders_count",
            "fields[5]": "gross_sales",
            _locale: "user",
          },
        }
      );
      Promise.all([currentDataReq, previousDataReq]).then(handleRevenue);
    };
    // const performanceIndicatorReq = client
    //   .get("/wp-json/wc-analytics/reports/performance-indicators", {
    //     params: {
    //       after: afterDate?.format(),
    //       before: beforeDate?.format(),
    //       stats:
    //         "revenue/total_sales,revenue/net_revenue,orders/orders_count,products/items_sold,variations/items_sold",
    //       _locale: "user",
    //     },
    //   })
    //   .then((res) => {
    //     handlePerformanceIndicator(res);
    //   })
    //   .then(() => {
    //     dataReq();
    //   });
    dataReq();
    // }
  }, [dateValues]);
  return (
    <div className="App">
      <Row>
        <Col span={6} offset={1}>
          <div style={{ margin: 10 }}>
            <h2>Date range:</h2>
            <div className="range-picker-border">
              <RangePicker
                format="YYYY-MM-DD"
                size="large"
                bordered={false}
                ranges={{
                  Today: [moment(), moment()],
                  "This Month": [
                    moment().startOf("month"),
                    moment().endOf("month"),
                  ],
                }}
                defaultValue={[
                  moment().subtract(7, "days"),
                  moment().startOf("day"),
                ]}
                onChange={onChange}
                onOk={onOk}
                className="date-picker"
              />
              <p>
                {`vs previous period (${previousDateValues[0]?.format(
                  "MMM D"
                )} - ${previousDateValues[1]?.format("MMM DD YYYY")}`}
                )
              </p>
            </div>
          </div>
        </Col>
      </Row>

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
        {intervalData.map((data: any, i: number) => {
          if (data.name === "Online store conversion rate") {
            return (
              <ConversionCard key={i} cdata={conversionData}></ConversionCard>
            );
          } else {
            return <Analytics key={i} cdata={data}></Analytics>;
          }
        })}
      </div>
    </div>
  );
}

export default App;
