const Decimal = require('decimal.js');
const { DateTime } = require('luxon');

class PaymentAccountListDto {
    constructor(accountNo, accountName, status, currCode, currentBalance) {
        this.accountNo = accountNo;
        this.accountName = accountName;
        this.status = status;
        this.currCode = currCode;
        this.currentBalance = currentBalance;
        this.transactionHistory = [];
    }
}

class PaymentAccountDetailDto {
    constructor(accountNo, accountName, accountRelation, accountRestriction, status, currCode, openedDate, branchName, currentBalance, availableBalance, overdraftBalance, holdBalance) {
        this.accountNo = accountNo;
        this.accountName = accountName;
        this.accountRelation = accountRelation;
        this.accountRestriction = accountRestriction;
        this.status = status;
        this.currCode = currCode;
        this.openedDate = openedDate;
        this.branchName = branchName;
        this.currentBalance = currentBalance;
        this.availableBalance = availableBalance;
        this.overdraftBalance = overdraftBalance;
        this.holdBalance = holdBalance;
    }
}

class PaymentAccountHistoryDto {
    constructor(coreRefNo, transTime, debitAmount, creditAmount, remark, nextRUNBAL, postingDate, postingOrder, moreRecordIndicator) {
        this.coreRefNo = coreRefNo;
        this.transTime = transTime;
        this.debitAmount = debitAmount;
        this.creditAmount = creditAmount;
        this.remark = remark;
        this.nextRUNBAL = nextRUNBAL;
        this.postingDate = postingDate;
        this.postingOrder = postingOrder;
        this.moreRecordIndicator = moreRecordIndicator;
    }
}

class PaymentAccountHistoryCriteriaDto {
    constructor(accountNo, startDate, endDate, moreRecordIndicator, postingDate, postingOrder, nextRUNBAL) {
        this.accountNo = accountNo;
        this.startDate = startDate;
        this.endDate = endDate;
        this.moreRecordIndicator = moreRecordIndicator;
        this.postingDate = postingDate;
        this.postingOrder = postingOrder;
        this.nextRUNBAL = nextRUNBAL;
    }
}

class DepositAccountInquiryDto {
    constructor(accountNo, accountName, currCode, status, dueDate, interestRate, currentBalance) {
        this.accountNo = accountNo;
        this.accountName = accountName;
        this.currCode = currCode;
        this.status = status;
        this.dueDate = dueDate;
        this.interestRate = new Decimal(interestRate);
        this.currentBalance = new Decimal(currentBalance);
    }
}

class DepositAccountDetailDto {
    constructor(accountNo, accountName, maturityDate, timeDepositTerm, timeDepositTermCode, ledgerBalance, interestRate, dateEntered, maturityDisposition, maturityTrfAccountNo, accountRelation, interestTerm, interestTermCode, originalAmount, holdAmount, withdrawableInterest) {
        this.accountNo = accountNo;
        this.accountName = accountName;
        this.maturityDate = maturityDate;
        this.timeDepositTerm = timeDepositTerm;
        this.timeDepositTermCode = timeDepositTermCode;
        this.ledgerBalance = ledgerBalance;
        this.interestRate = interestRate;
        this.dateEntered = dateEntered;
        this.maturityDisposition = maturityDisposition;
        this.maturityTrfAccountNo = maturityTrfAccountNo;
        this.accountRelation = accountRelation;
        this.interestTerm = interestTerm;
        this.interestTermCode = interestTermCode;
        this.originalAmount = originalAmount;
        this.holdAmount = holdAmount;
        this.withdrawableInterest = withdrawableInterest;
    }
}

class DepositAccountTxnHistoryDto {
    constructor(effDate, nextRUNBAL, earlyRepaymentPenaltyInterest, reducedOriginalAmount, reducedInterestAmount, increaseOriginalAmount, increaseInterestAmount, remark, transDesc, postingDate, postingOrder, moreRecordIndicator) {
        this.effDate = effDate;
        this.nextRUNBAL = parseFloat(nextRUNBAL);
        this.earlyRepaymentPenaltyInterest = parseFloat(earlyRepaymentPenaltyInterest);
        this.reducedOriginalAmount = parseFloat(reducedOriginalAmount);
        this.reducedInterestAmount = parseFloat(reducedInterestAmount);
        this.increaseOriginalAmount = parseFloat(increaseOriginalAmount);
        this.increaseInterestAmount = parseFloat(increaseInterestAmount);
        this.remark = remark;
        this.transDesc = transDesc;
        this.postingDate = postingDate;
        this.postingOrder = postingOrder;
        this.moreRecordIndicator = moreRecordIndicator;
    }
}

module.exports = { PaymentAccountListDto, PaymentAccountDetailDto, PaymentAccountHistoryDto, PaymentAccountHistoryCriteriaDto, DepositAccountInquiryDto, DepositAccountDetailDto, DepositAccountTxnHistoryDto };