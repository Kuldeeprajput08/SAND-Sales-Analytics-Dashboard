import api from "./api";

// fetch all sales record

export const getAllSales = (params = {}) => {
  return api.get("/sales", { params });
};

// Fetch dashboard summary
export const getSalesSummary = (params = {}) => {
  return api.get("/sales/summary", { params });
};

// Fetch category-wise sales
export const getCategorySales = (params = {}) => {
  return api.get("/sales/by-category", { params });
};

// Fetch region-wise sales
export const getRegionSales = (params = {}) => {
  return api.get("/sales/by-region", { params });
};

// Fetch monthly sales trend
export const getSalesTrend = (params = {}) => {
  return api.get("/sales/trend", { params });
};
