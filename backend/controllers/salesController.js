import Sales from "../models/Sales.js";
const isValidDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const buildSalesMatch = (query) => {
  const match = {};

  const { startDate, endDate, category, region, product } = query;

  if (startDate && !isValidDate(startDate)) {
    const error = new Error("Invalid start date");
    error.statusCode = 400;
    throw error;
  }

  if (endDate && !isValidDate(endDate)) {
    const error = new Error("Invalid end date");
    error.statusCode = 400;
    throw error;
  }

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    const error = new Error("Start date cannot be after end date");
    error.statusCode = 400;
    throw error;
  }

  if (startDate || endDate) {
    match.date = {};

    if (startDate) {
      match.date.$gte = new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      match.date.$lte = end;
    }
  }

  if (category) match.category = category;
  if (region) match.region = region;
  if (product) match.product = product;

  return match;
};
//Gets all sales data

export const getAllSales = async (req, res) => {
  try {
    const filters = buildSalesMatch(req.query);

    const sales = await Sales.find(filters).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: sales.length,
      data: sales,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch sales records",
    });
  }
};

//calculate sales summary

export const getSalesSummary = async (req, res) => {
  try {
    const summary = await Sales.aggregate([
      {
        $match: buildSalesMatch(req.query),
      },
      {
        $group: {
          _id: null,

          totalSales: {
            $sum: "$sales",
          },

          totalQuantity: {
            $sum: "$quantity",
          },

          totalOrders: {
            $sum: 1,
          },

          averageOrderValue: {
            $avg: "$sales",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
          totalQuantity: 1,
          totalOrders: 1,
          averageOrderValue: 1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: summary[0] || {
        totalSales: 0,
        totalQuantity: 0,
        totalOrders: 0,
        averageOrderValue: 0,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Failed to fetch sales summary",
      error: error.message,
    });
  }
};

//Sales by Category

export const getSalesByCategory = async (req, res) => {
  try {
    const CategorySales = await Sales.aggregate([
      {
        $match: buildSalesMatch(req.query),
      },
      {
        $group: {
          _id: "$category",
          totalSales: {
            $sum: "$sales",
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalSales: 1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: CategorySales,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Failed to fetch category sales",
      error: error.message,
    });
  }
};

// Sales By Region

export const getSalesByRegion = async (req, res) => {
  try {
    const regionSales = await Sales.aggregate([
      {
        $match: buildSalesMatch(req.query),
      },

      {
        $group: {
          _id: "$region",
          totalSales: {
            $sum: "$sales",
          },
        },
      },
      {
        $project: {
          _id: 0,
          region: "$_id",
          totalSales: 1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: regionSales,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Failed to fetch region sales",
      error: error.message,
    });
  }
};

// Sales By Trend

export const getSalesByTrend = async (req, res) => {
  try {
    const monthlySales = await Sales.aggregate([
      {
        $match: buildSalesMatch(req.query),
      },
      {
        $group: {
          _id: {
            month: {
              $month: {
                date: "$date",
                timezone: "Asia/Kolkata",
              },
            },
            year: {
              $year: {
                date: "$date",
                timezone: "Asia/Kolkata",
              },
            },
          },
          totalSales: {
            $sum: "$sales",
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          totalSales: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: monthlySales,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Failed to fetch sales trend",
      error: error.message,
    });
  }
};
