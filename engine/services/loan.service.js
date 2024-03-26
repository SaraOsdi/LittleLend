const Loan = require("../models/loan.model");

exports.addLoan = async (loanData) => {
  try {
    const loan = new Loan(loanData);
    await loan.save();
    return loan;
  } catch (error) {
    throw error;
  }
};

exports.findLoans = async () => {
  return await Loan.find()
    .populate({
      path: "productId",
      select: "name",
    })
    .populate({
      path: "userId",
      select: "userId phone",
    })
    .then((loans) => {
      const transformedLoans = loans.map((loan) => ({
        id: loan.id,
        productName: loan.productId
          ? loan.productId.name
          : "מוצר זה איו קיים עוד",
        userId: loan.userId ? loan.userId.userId : "משתמש זה אינו קיים עוד",
        phone: loan.userId ? loan.userId.phone : "משתמש זה אינו קיים עוד",
        startDate: loan.startDate,
        isApproved: loan.isApproved,
        endDate: loan.endDate,
        paymentMethod: loan.paymentMethod,
        rate: loan.rate,
      }));

      return transformedLoans;
    })
    .catch((error) => {
      throw error;
    });
};

exports.updateStatusLoan = async (loanId, isApproved) => {
  return await Loan.findByIdAndUpdate(
    loanId,
    { isApproved: isApproved },
    { new: true }
  );
};

exports.updateRateLoan = async (loanId, rate) => {
  return await Loan.findByIdAndUpdate(loanId, { rate: rate }, { new: true });
};

exports.findLoansByUserId = async (userId) => {
  const loans = await Loan.find({ userId })
    .populate({
      path: "productId",
      select: "name",
    })
    .populate({
      path: "userId",
      select: "userId phone",
    })
    .then((loans) => {
      const transformedLoans = loans.map((loan) => ({
        id: loan.id,
        productName: loan.productId
          ? loan.productId.name
          : "מוצר זה איו קיים עוד",
        userId: loan.userId ? loan.userId.userId : "משתמש זה אינו קיים עוד",
        phone: loan.userId ? loan.userId.phone : "משתמש זה אינו קיים עוד",
        startDate: loan.startDate,
        isApproved: loan.isApproved,
        endDate: loan.endDate,
        paymentMethod: loan.paymentMethod,
        rate: loan.rate,
      }));

      return transformedLoans;
    })
    .catch((error) => {
      throw error;
    });
  return loans;
};
