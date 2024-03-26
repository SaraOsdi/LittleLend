const express = require("express");
const router = express.Router();
const loanService = require("../services/loan.service");
const productService = require("../services/product.service");
const { isAdmin, isUser } = require("../middleware/auth.middleware");

router.post("/", isUser, async (req, res) => {
  try {
    const loan = await loanService.addLoan(req.body);
    res.send(loan);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/", isAdmin, async (req, res) => {
  try {
    const loans = await loanService.findLoans();
    if (loans.length === 0) {
      return res.json([]);
    }
    res.json(loans);
  } catch (err) {
    res.status(500).send("Error reading loan");
  }
});

router.get("/:userId", isUser, async (req, res) => {
  try {
    const userId = req.params.userId;
    const loans = await loanService.findLoansByUserId(userId);

    if (loans.length === 0) {
      return res.json([]);
    }
    res.json(loans);
  } catch (err) {
    res.status(500).send("Error reading loan");
  }
});

router.patch("/:id/approve", isAdmin, async (req, res) => {
  try {
    const loanId = req.params.id;
    const isApproved = req.body.isApproved;
    const updatedLoan = await loanService.updateStatusLoan(loanId, isApproved);
    if (isApproved === 1) {
      await productService.removeFromQuantity(updatedLoan.productId);
    }
    if (!updatedLoan) {
      return res.status(404).send("Loan not found");
    }

    res.send(updatedLoan);
  } catch (err) {
    res.status(500).send("Error reading loan");
  }
});

router.patch("/:id/rate", isUser, async (req, res) => {
  try {
    const loanId = req.params.id;
    const rate = req.body.rate;
    const updatedLoan = await loanService.updateRateLoan(loanId, rate);
    await productService.updateRateProduct(updatedLoan.productId, rate);
    if (!updatedLoan) {
      return res.status(404).send("Loan not found");
    }

    res.send(updatedLoan);
  } catch (err) {
    res.status(500).send("Error reading loan");
  }
});

module.exports = router;
