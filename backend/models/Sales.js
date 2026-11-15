import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
    {
        product:{
            type: String,
            required:[true,"Product name is required"],
            trim: true,
        },

        category{
            type: String,
            required:[true, "Category is required"],
            enum:["Electronics","Furniture","Accessories","Appliances"],
        },

        region:{
            type: String,
            required:[true, "Region is required"],
            enum:["North","South","East","West"],
        },

        sales:{
            type: Number,
            required:[true,"Sales amount is required"],
            min:[0,"Sales cannot be negative"],
        },

        quantity:{
            type:Number,
            required:[true,"Quantity is required"],
            min:[1,"Quantity cannot be negative"],
        },

        date:{
            type: Date,
            required:[true,"Sale date is required"],
        },
    },
        {
            timestamps: true,
        }
    
);

salesSchema.index({ date: 1 });
salesSchema.index({ category: 1 });
salesSchema.index({ region: 1 });
salesSchema.index({ product: 1 });

const sales = mongoose.model("Sales", saleSchema);

export default sales;