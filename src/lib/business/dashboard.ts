export type BusinessDashboardMetric = {
  id: string;
  label: string;
  value: string;
};

export type BusinessDashboardSnapshot = {
  businessName: string;
  metrics: BusinessDashboardMetric[];
};
