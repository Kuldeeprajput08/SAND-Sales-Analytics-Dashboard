import mongoose from "mongoose";
import dotenv from "dotenv";
import Sales from "../models/Sales.js";
import sales from "../models/Sales.js";

dotenv.config();

const products = [
  { product: "Laptop", category: "Electronics", price: 55000 },
  { product: "Smartphone", category: "Electronics", price: 25000 },
  { product: "Monitor", category: "Electronics", price: 15000 },
  { product: "Office Chair", category: "Furniture", price: 8000 },
  { product: "Desk", category: "Furniture", price: 12000 },
  { product: "Keyboard", category: "Accessories", price: 2000 },
  { product: "Headphones", category: "Accessories", price: 5000 },
  { product: "USB Cable", category: "Accessories", price: 2000 },
  { product: "Coffee Machine", category: "Appliances", price: 15000 },
  { product: "Toaster", category: "Appliances", price: 4000 },
];

const regions = ["North", "South", "East", "West"];

const months = Array.from({ length: 12 }, (_, index) => ({
  month: index,
  maxDay: new Date(2026, index + 1, 0).getDate(),
}));

const generateSalesData = () => {
  const salesData = [];

  months.forEach((monthInfo, monthIndex) => {
    for (let i = 0; i < 15; i++) {
      const selectedProduct = products[(i + monthIndex) % products.length];

      const quantity = (i % 5) + 1;

      const sales = quantity * selectedProduct.price;

      const selectedRegion = regions[(i + monthIndex * 2) % regions.length];

      const day = ((i * 2) % monthInfo.maxDay) + 1;

      const date = new Date(2026, monthInfo.month, day);

      salesData.push({
        product: selectedProduct.product,
        category: selectedProduct.category,
        region: selectedRegion,
        sales,
        quantity,
        date,
      });
    }
  });
  return salesData;
};

const seedSales = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    const existingRecords = await sales.countDocuments();

    if (existingRecords > 0) {
      console.log(`Seeding stopped: ${existingRecords} records already exist`);
      return;
    }
    const salesData = generateSalesData();

    await Sales.insertMany(salesData);
    console.log(`${saleData.length} sales recor insert successfully.`);
  } catch (error) {
    console.log("Seeding Failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
};
seedSales();
