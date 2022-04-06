namespace PerformanceIndicator {
  interface Indicator {
    stat: string;
    chart: string;
    label: string;
    format: Format;
    value: number | null;
    _links: Links;
  }

  interface Links {
    api: Api[];
    report: Api[];
  }

  interface Api {
    href: string;
  }

  enum Format {
    Currency = "currency",
    Number = "number",
  }
}

namespace IntervalStats {
  interface Stats {
    totals: Totals;
    intervals: Interval[];
  }

  interface Interval {
    interval: Date;
    date_start: Date;
    date_start_gmt: Date;
    date_end: Date;
    date_end_gmt: Date;
    type: string;
    subtotals: Totals;
  }

  interface Totals {
    orders_count: number;
    avg_order_value: number;
    coupons_count: number;
    segments: any[];
    products?: number;
    gross_sales: number;
    refunds: number;
    coupons: number;
    net_revenue: number;
    taxes: number;
    shipping: number;
    total_sales: number;
  }
}

namespace ConversionData {
  interface Data {
    cdata: RateData;
  }
  interface RateData {
    conversionRate: number;
    totalSessions: number;
    cartRate: number;
    checkoutRate: number;
  }
}
