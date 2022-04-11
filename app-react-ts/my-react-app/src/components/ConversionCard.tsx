import "./ConversionCard.css";
import "./CommonCard.css";
import { useState } from "react";
import { Card, Row, Col } from "antd";

function ConversionCard({ cdata }: ConversionData.Data) {
  const conversionData = cdata;
  console.log("ConversionCard", cdata);

  return (
    <div style={{ width: "33%" }}>
      <Card title="Online store conversion rate" style={{ margin: "10px" }}>
        <div className="total-data">
          <span>{conversionData.conversionRate?.toFixed(2)}%</span>
          <span>-</span>
        </div>
        <p className="card-subtitle">CONVERSION FUNNEL</p>
        <div style={{ textAlign: "left" }}>
          <Row>
            <Col span={17}>Added to cart</Col>
            <Col span={2} offset={2}>
              <span>{conversionData.cartRate?.toFixed(2)}%</span>
            </Col>
            <Col span={1} offset={2}>
              <span>-</span>
            </Col>
          </Row>
          <Row>
            <Col>
              <span style={{ textAlign: "left", color: "gray" }}>
                {new Intl.NumberFormat().format(
                  Math.floor(
                    (conversionData.totalSessions * conversionData.cartRate) /
                      100
                  )
                )}{" "}
                sessions
              </span>
            </Col>
          </Row>
        </div>
        <div style={{ textAlign: "left" }}>
          <Row>
            <Col span={17}>Reached checkout</Col>
            <Col span={2} offset={2}>
              <span>{conversionData.checkoutRate?.toFixed(2)}%</span>
            </Col>
            <Col span={1} offset={2}>
              <span>-</span>
            </Col>
          </Row>
          <Row>
            <Col>
              <span style={{ textAlign: "left", color: "gray" }}>
                {new Intl.NumberFormat().format(
                  Math.floor(
                    (conversionData.totalSessions *
                      conversionData.checkoutRate) /
                      100
                  )
                )}{" "}
                sessions
              </span>
            </Col>
          </Row>
        </div>
        <div style={{ textAlign: "left" }}>
          <Row>
            <Col span={17}>Sessions converted</Col>
            <Col span={2} offset={2}>
              <span>{conversionData.conversionRate?.toFixed(2)}%</span>
            </Col>
            <Col span={1} offset={2}>
              <span>-</span>
            </Col>
          </Row>
          <Row>
            <Col>
              <span style={{ textAlign: "left", color: "gray" }}>
                {new Intl.NumberFormat().format(
                  Math.floor(conversionData.convertedSessions)
                )}{" "}
                sessions
              </span>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
}

export default ConversionCard;
