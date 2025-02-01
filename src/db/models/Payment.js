import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
        },
        currency: {
            type: String,
        },
        pkgDescription: {
            type: String,  
        },
        questions: {
            type: Number,
        },
        paymentResult: {
            type: String,
        },
        paymentIntent: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);