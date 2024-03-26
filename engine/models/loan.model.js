const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isApproved: {
    type: Number,
    required: true,
    default: 0,
  },
  rate: {
    type: Number,
    required: true,
    default: -1,
  },
  paymentMethod: {
    type: Number,
    required: true,
  },
});

loanSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

loanSchema.set("toJSON", { virtuals: true });
loanSchema.set("toObject", { virtuals: true });

const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;
