import { useEffect, useState } from "react";

import {
  getSalesSummary,
  getCategorySales,
  getRegionSales,
  getSalesTrend,
} from "../../services/salesService.js";

const useSalesData = (filters = {}) => {
  const [summary, setSummary] = useState(null);
  const [categorySales, setCategorySales] = useState([]);
  const [regionSales, setRegionSales] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [summaryRes, categoryRes, regionRes, trendRes] =
          await Promise.all([
            getSalesSummary(filters),
            getCategorySales(filters),
            getRegionSales(filters),
            getSalesTrend(filters),
          ]);

        setSummary(summaryRes.data.data);
        setCategorySales(categoryRes.data.data);
        setRegionSales(regionRes.data.data);
        setSalesTrend(trendRes.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Something went wrong while fetching dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [
    filters.startDate,
    filters.endDate,
    filters.category,
    filters.region,
    filters.product,
  ]);

  return {
    summary,
    categorySales,
    regionSales,
    salesTrend,
    loading,
    error,
  };
};

export default useSalesData;
