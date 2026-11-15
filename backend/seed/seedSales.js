import mongoose from "mongoose";
import dotenv from "dotenv";
import sales from "../models/Sales";

dotenv.config();

const products = [
  { product: "Laptop", category: "Electronics", price: "5500" },
  { product: "Smartphone", category: "Electronics", price: "25000" },
  { product: "Monitor", category: "Electronics", price: "15000" },
  { product: "Office Chair", category: "Furniture", price: "8000" },
  { product: "Desk", category: "Furniture", price: "12000" },
  { product: "Keyboard", category: "Accessories", price: "2000" },
  { product: "Headphones", category: "Accessories", price: "5000" },
  { product: "USB Cable", category: "Accessories", price: "2000" },
  { product: "Coffee Machine", category: "Appliances", price: "15000" },
  { product: "Toaster", category: "Appliances", price: "4000" },
];

const regions = ["North", "South", "East", "West"];

const months = Array.from({ length: 12 }, (_, index) => ({
  month: index,
  maxDay: new Date(2026, index + 1, 0).getDate(),
}));

const generateSalesData = () => {
  const salesData = [];

  month.forEach((monthINfo, monthIndex) => {
    for (let i = 0; i < 15; i++) {
      const selectedProduct = products[(i = monthIndex) % products.length];
    }
  });
  return salesData;
};
