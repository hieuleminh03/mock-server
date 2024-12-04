const { PaymentAccountListDto, PaymentAccountDetailDto, PaymentAccountHistoryDto, DepositAccountDetailDto, DepositAccountTxnHistoryDto } = require('../models/accountModel');
const { randomUUID } = require('crypto');
const { DateTime } = require('luxon');

const statuses = ['Active', 'Inactive', 'Dormant', 'Closed'];
const accountNames = [
    "Do Thi Thu Uyen"
];

const generateAccountNumber = () => {
    const length = Math.floor(Math.random() * (12 - 8 + 1)) + 8;
    let accountNumber = '';
    for (let i = 0; i < length; i++) {
        accountNumber += Math.floor(Math.random() * 10);
    }
    return accountNumber;
};

const generateRandomString = (length) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const generateTransactionHistory = (accountNo) => {
    const transactionCount = Math.floor(Math.random() * 200); 
    const transactions = [];

    for (let i = 0; i < transactionCount; i++) {
        const debitAmount = Math.random() < 0.5 ? (Math.random() * 1000).toFixed(2) : 0; 
        const creditAmount = debitAmount === 0 ? (Math.random() * 1000).toFixed(2) : 0; 
        const remark = `Transaction ${i + 1} for account ${accountNo}`;
        const transTime = DateTime.now().minus({ days: Math.floor(Math.random() * 30), months: Math.floor(Math.random() * 12) }).toISO(); 
        const postingOrder = generateRandomString(15);

        const postingDateYear = Math.floor(Math.random() * (2024 - 2018 + 1)) + 2018;
        const postingDateMonth = Math.floor(Math.random() * 12) + 1; 
        const postingDateDay = Math.floor(Math.random() * 28) + 1; 
        const postingDate = DateTime.fromObject({ year: postingDateYear, month: postingDateMonth, day: postingDateDay }).toISO(); 

        transactions.push(new PaymentAccountHistoryDto(
            randomUUID().slice(0, 8), 
            transTime,
            debitAmount,
            creditAmount, 
            remark,
            (parseFloat(debitAmount) - parseFloat(creditAmount)).toFixed(2),
            postingDate,
            postingOrder,
            (i < transactionCount - 1) ? 'Y' : 'N' 
        ));
    }

    // Sort transactions by transaction time in ascending order
    transactions.sort((a, b) => {
        return DateTime.fromISO(a.transTime) - DateTime.fromISO(b.transTime);
    });

    return transactions;
};

const generateTransactionHistoryForDepositAccount = (accountNo) => {
    const transactionCount = Math.floor(Math.random() * 51); 
    const transactions = [];

    for (let i = 0; i < transactionCount; i++) {
        const effDate = DateTime.now().minus({ days: Math.floor(Math.random() * 30), months: Math.floor(Math.random() * 12) }).toFormat('yyyy-MM-dd'); 
        const nextRUNBAL = (Math.random() * 100000).toFixed(2); 
        const earlyRepaymentPenaltyInterest = (Math.random() * 100).toFixed(2); 
        const reducedOriginalAmount = (Math.random() * 50).toFixed(2); 
        const reducedInterestAmount = (Math.random() * 50).toFixed(2); 
        const increaseOriginalAmount = (Math.random() * 50).toFixed(2); 
        const increaseInterestAmount = (Math.random() * 50).toFixed(2); 
        const remark = `Transaction for account ${accountNo}`; 
        const transDesc = `Description for transaction ${i + 1}`; 

        const postingDate = DateTime.now().minus({ days: Math.floor(Math.random() * 30) });
        const formattedPostingDate = `${postingDate.day.toString().padStart(2, '0')}${postingDate.month.toString().padStart(2, '0')}${postingDate.year.toString().slice(-2)}`; 

        const postingOrder = generateRandomString(15); 

        const moreRecordIndicator = (i < transactionCount - 1) ? 'Y' : 'N'; 

        transactions.push(new DepositAccountTxnHistoryDto(
            effDate,
            nextRUNBAL,
            earlyRepaymentPenaltyInterest,
            reducedOriginalAmount,
            reducedInterestAmount,
            increaseOriginalAmount,
            increaseInterestAmount,
            remark,
            transDesc,
            formattedPostingDate, 
            postingOrder,
            moreRecordIndicator
        ));
    }

    // Sort transactions by eff date in ascending order
    transactions.sort((a, b) => {
        return DateTime.fromISO(b.effDate) - DateTime.fromISO(a.effDate);
    });
    return transactions;
};

const generateMockAccounts = (totalCount) => {
    const accounts = [];

    for (let i = 0; i < totalCount; i++) {
        const accountNo = generateAccountNumber();
        const accountName = accountNames[Math.floor(Math.random() * accountNames.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const currCode = ['USD', 'VND', 'CNY'][Math.floor(Math.random() * 3)];
        const currentBalance = (Math.random() * 10000000).toFixed(2);

        const account = new PaymentAccountListDto(
            accountNo,
            accountName,
            status,
            currCode,
            currentBalance
        );

        account.transactionHistory = generateTransactionHistory(accountNo);

        // randomly delete all transactions in some accounts
        if (Math.random() < 0.2) {
            account.transactionHistory = [];
        }

        accounts.push(account);
    }

    return accounts;
};

const generateMockDepositAccounts = (totalCount) => {
    const accounts = [];

    for (let i = 0; i < totalCount; i++) {
        const accountNo = generateAccountNumber();
        const accountName = accountNames[Math.floor(Math.random() * accountNames.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const currCode = ['USD', 'VND', 'CNY'][Math.floor(Math.random() * 3)];
        const currentBalance = (Math.random() * 10000000).toFixed(2);
        const dueDate = DateTime.now().plus({ months: Math.floor(Math.random() * 12) }).toISO();
        const interestRate = (Math.random() * 5).toFixed(2); 
        const originalAmount = (Math.random() * 100000).toFixed(2); 
        const holdAmount = (Math.random() * 5000).toFixed(2); 
        const withdrawableInterest = (Math.random() * 2000).toFixed(2); 

        const maturityDate = DateTime.now().plus({ months: Math.floor(Math.random() * 12) }).toISO(); 
        const timeDepositTerm = (Math.floor(Math.random() * 24) + 1).toString(); 
        const timeDepositTermCode = ['ngày', 'tuần', 'quý', 'năm', 'tháng'][Math.floor(Math.random() * 5)]; 
        const dateEntered = DateTime.now().minus({ days: Math.floor(Math.random() * 30) }).toISO();
        const maturityDisposition = ['Không xoay vòng', 'Xoay vòng gốc', 'Xoay vòng gốc và lãi'][Math.floor(Math.random() * 3)]; 
        const accountRelation = ['Sở hữu', 'Phong tỏa'][Math.floor(Math.random() * 2)]; 
        const interestTerm = (Math.floor(Math.random() * 5) + 1).toString(); 
        const interestTermCode = ['ngày', 'tuần', 'quý', 'năm', 'tháng'][Math.floor(Math.random() * 5)]; 

        const account = new PaymentAccountListDto(
            accountNo,
            accountName,
            status,
            currCode,
            currentBalance
        );

        account.dueDate = dueDate;
        account.interestRate = parseFloat(interestRate); 
        account.originalAmount = parseFloat(originalAmount);
        account.holdAmount = parseFloat(holdAmount);
        account.withdrawableInterest = parseFloat(withdrawableInterest);

        account.depositAccountDetail = new DepositAccountDetailDto(
            accountNo,
            accountName,
            maturityDate,
            timeDepositTerm,
            timeDepositTermCode,
            parseFloat(currentBalance),
            parseFloat(interestRate),
            dateEntered,
            maturityDisposition,
            "389264987",
            accountRelation,
            interestTerm,
            interestTermCode,
            parseFloat(originalAmount),
            parseFloat(holdAmount),
            parseFloat(withdrawableInterest)
        );

        account.transactionHistory = generateTransactionHistoryForDepositAccount(accountNo);

        // randomly delete all transactions in some accounts
        if (Math.random() < 0.2) {
            account.transactionHistory = [];
        }

        accounts.push(account);
    }

    return accounts;
};


let mockAccounts = [];
let mockDepositAccounts = [];

const initMockAccounts = (totalCount) => {
    if (mockAccounts.length === 0) {
        mockAccounts = generateMockAccounts(totalCount);
    }
};

const initMockDepositAccounts = (totalCount) => {
    if (mockDepositAccounts.length === 0) {
        mockDepositAccounts = generateMockDepositAccounts(totalCount);
    }
};

const getMockAccounts = () => {
    return mockAccounts;
};

const getMockDepositAccounts = () => {
    return mockDepositAccounts;
};

module.exports = { initMockAccounts, getMockAccounts, initMockDepositAccounts, getMockDepositAccounts };