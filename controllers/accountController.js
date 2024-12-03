const { initMockAccounts, getMockAccounts, initMockDepositAccounts, getMockDepositAccounts } = require('../mocks/accountMock');
const { PaymentAccountDetailDto, DepositAccountInquiryDto, DepositAccountDetailDto } = require('../models/accountModel');
const { DateTime } = require('luxon');

initMockAccounts(200);
initMockDepositAccounts(200);

const generateTraceId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

exports.paymentAccountListInquiry = (req, res) => {
    const { keyword } = req.body;
    const accounts = getMockAccounts();

    const filteredAccounts = keyword
        ? accounts.filter(account => 
            account.accountNo.includes(keyword) || account.accountName.toLowerCase().includes(keyword.toLowerCase())
        )
        : accounts;

    const resultList = {
        status: 0,
        code: '0',
        message: 'SUCCESS',
        errors: null, 
        traceId: generateTraceId(), 
        data: {
            items: filteredAccounts.map(account => ({
                accountNo: account.accountNo,
                accountName: account.accountName,
                status: account.status,
                currentBalance: parseFloat(account.currentBalance), 
                currCode: account.currCode,
            })),
            total: filteredAccounts.length,
        },
    };

    res.json(resultList);
};

exports.exportAccountData = (req, res) => {
    const { keyword, currCode } = req.body;

    const traceId = generateTraceId();

    const response = {
        status: 0,
        code: '0',
        message: 'SUCCESS',
        errors: null,
        traceId: traceId,
        data: "https://drive.google.com/uc?export=download&id=1vUHM7XsBSu0rQJzSmadd-F0Q6Kken0t9"
    };

    res.json(response);
};

exports.getAccountDetail = (req, res) => {
    const { accountNo } = req.body;
    const accounts = getMockAccounts();

    const account = accounts.find(acc => acc.accountNo === accountNo);

    if (!account) {
        return res.status(403).json({
            status: 1,
            code: 'AS0001',
            message: 'Tài khoản không được phân quyền',
            errors: null,
            traceId: generateTraceId(),
            data: null,
        });
    }

    const accountDetail = new PaymentAccountDetailDto(
        account.accountNo,
        account.accountName,
        'Relationship Info', 
        'No Restrictions', 
        account.status,
        account.currCode,
        new Date(),
        'Branch Name', 
        Number(account.currentBalance), 
        Number(account.currentBalance),
        0, 
        0 
    );

    const response = {
        status: 0,
        code: '0',
        message: 'SUCCESS',
        errors: null,
        traceId: generateTraceId(),
        data: accountDetail,
    };

    res.json(response);
};

exports.getTransactionHistory = (req, res) => {
    const { accountNo, startDate, endDate, moreRecordIndicator, postingDate, postingOrder, nextRUNBAL } = req.body;
    const accounts = getMockAccounts(); 

    const account = accounts.find(acc => acc.accountNo === accountNo);

    if (!account) {
        return res.status(403).json({
            status: 1,
            code: 'AS0001',
            message: 'Tài khoản không được phân quyền',
            errors: null,
            traceId: generateTraceId(),
            data: null,
        });
    }

    let transactions = account.transactionHistory;

    if (startDate) {
        transactions = transactions.filter(trans => DateTime.fromISO(trans.postingDate) >= DateTime.fromISO(startDate));
    }
    if (endDate) {
        transactions = transactions.filter(trans => DateTime.fromISO(trans.postingDate) <= DateTime.fromISO(endDate));
    }

    const pageSize = 20; // Default load size
    let filteredTransactions = transactions;

    if (moreRecordIndicator && postingDate && postingOrder) {
        console.log("Filtering transactions with:", {
            nextRUNBAL,
            postingDate,
            postingOrder,
        });

        const startIndex = transactions.findIndex(trans => 
            trans.nextRUNBAL === nextRUNBAL && 
            (() => {
                const transPostingDateISO = DateTime.fromISO(trans.postingDate);
                const transFormattedPostingDate = `${transPostingDateISO.day.toString().padStart(2, '0')}${transPostingDateISO.month.toString().padStart(2, '0')}${transPostingDateISO.year.toString().slice(-2)}`; 
                return transFormattedPostingDate === postingDate; 
            })() &&
            trans.postingOrder === postingOrder
        );

        if (startIndex !== -1) {
            filteredTransactions = transactions.slice(startIndex + 1); 
        }

        console.log(`Filtered transactions from index ${startIndex + 1}:`, filteredTransactions);
    }

    const paginatedTransactions = filteredTransactions.slice(0, pageSize);
    const moreRecordIndicatorResponse = paginatedTransactions.length < filteredTransactions.length ? 'Y' : 'N';

    const response = {
        status: 0,
        code: '0',
        message: 'SUCCESS',
        errors: null,
        traceId: generateTraceId(),
        data: {
            items: paginatedTransactions.map((trans) => {
                const postingDateISO = DateTime.fromISO(trans.postingDate);
                const postingDateFormatted = `${postingDateISO.day.toString().padStart(2, '0')}${postingDateISO.month.toString().padStart(2, '0')}${postingDateISO.year.toString().slice(-2)}`; // Format: DDMMYY

                return {
                    coreRefNo: trans.coreRefNo,
                    transTime: DateTime.fromISO(trans.transTime).toFormat("yyyy-MM-dd'T'HH:mm:ss"),
                    debitAmount: parseFloat(trans.debitAmount),
                    creditAmount: parseFloat(trans.creditAmount),
                    remark: trans.remark,
                    nextRUNBAL: trans.nextRUNBAL,
                    postingDate: postingDateFormatted,
                    postingOrder: trans.postingOrder, 
                    moreRecordIndicator: moreRecordIndicatorResponse,
                };
            }),
            total: paginatedTransactions.length 
        },
    };

    res.json(response);
};

exports.depositAccountListInquiry = (req, res) => {
    const { keyword } = req.body;
    const accounts = getMockDepositAccounts(); 

    const filteredAccounts = keyword
        ? accounts.filter(account => 
            account.accountNo.includes(keyword) || account.accountName.toLowerCase().includes(keyword.toLowerCase())
        )
        : accounts;

    const resultList = {
        status: 0,
        code: '0',
        message: 'SUCCESS',
        errors: null,
        traceId: generateTraceId(),
        data: {
            items: filteredAccounts.map(account => {
                return {
                    accountNo: account.accountNo,
                    accountName: account.accountName,
                    currCode: account.currCode,
                    status: account.status,
                    dueDate: DateTime.fromISO(account.dueDate).toFormat('yyyy-MM-dd'), 
                    interestRate: parseFloat(account.interestRate), 
                    currentBalance: parseFloat(account.currentBalance) 
                };
            }),
            total: filteredAccounts.length,
        },
    };

    res.json(resultList);
};

exports.exportDepositAccountData = (req, res) => {
    const { keyword, currCode } = req.body;

    const traceId = generateTraceId();

    const response = {
        status: 0,
        code: '0',
        message: 'SUCCESS',
        errors: null,
        traceId: traceId,
        data: "https://drive.google.com/uc?export=download&id=1vUHM7XsBSu0rQJzSmadd-F0Q6Kken0t9"
    };

    res.json(response);
};

exports.getDepositAccountDetail = (req, res) => {
    const { accountNo } = req.body; 
    const accounts = getMockDepositAccounts(); 

    const account = accounts.find(acc => acc.accountNo === accountNo);

    if (!account) {
        return res.status(400).json({
            status: 1,
            code: 'AS0001',
            message: 'Tài khoản không được phân quyền', 
            errors: null,
            traceId: generateTraceId(),
            data: null,
        });
    }

    const accountDetail = {
        accountNo: account.accountNo,
        accountName: account.accountName,
        maturityDate: DateTime.fromISO(account.dueDate).toFormat('yyyy-MM-dd'), 
        timeDepositTerm: "12", 
        timeDepositTermCode: "tháng", 
        ledgerBalance: parseFloat(account.currentBalance),
        interestRate: parseFloat(account.interestRate),
        dateEntered: DateTime.now().toFormat('yyyy-MM-dd'), 
        maturityDisposition: "Xoay vòng gốc", 
        maturityTrfAccountNo: "389264987", 
        accountRelation: "Sở hữu",
        interestTerm: "1", 
        interestTermCode: "năm", 
        originalAmount: parseFloat(account.originalAmount || 12042.12), 
        holdAmount: parseFloat(account.holdAmount || 1582.82),
        withdrawableInterest: parseFloat(account.withdrawableInterest || 904.96) 
    };

    const response = {
        status: 0,
        code: '0',
        message: 'SUCCESS',
        errors: null,
        traceId: generateTraceId(),
        data: accountDetail,
    };

    res.json(response);
};

exports.getDepositTransactionHistory = (req, res) => {
    const { accountNo, moreRecordIndicator, postingDate, postingOrder, nextRUNBAL } = req.body;
    const accounts = getMockDepositAccounts();

    const account = accounts.find(acc => acc.accountNo === accountNo);

    if (!account) {
        return res.status(403).json({
            status: 1,
            code: 'AS0001',
            message: 'Tài khoản không được phân quyền',
            errors: null,
            traceId: generateTraceId(),
            data: null,
        });
    }

    let transactions = account.transactionHistory; 
    const pageSize = 20;
    let filteredTransactions = transactions;

    if (moreRecordIndicator && postingDate && postingOrder) {
        const startIndex = transactions.findIndex(trans => 
            trans.nextRUNBAL.toString() === nextRUNBAL && 
            trans.postingOrder === postingOrder &&
            trans.postingDate === postingDate
        );

        if (startIndex !== -1) {
            filteredTransactions = transactions.slice(startIndex + 1); 
        }
    }

    const paginatedTransactions = filteredTransactions.slice(0, pageSize);
    const moreRecordIndicatorResponse = paginatedTransactions.length < filteredTransactions.length ? 'Y' : 'N';

    const response = {
        status: 0,
        code: '0',
        message: 'SUCCESS',
        errors: null,
        traceId: generateTraceId(),
        data: {
            items: paginatedTransactions.map((trans) => {
                return {
                    effDate: trans.effDate,
                    nextRUNBAL: parseFloat(trans.nextRUNBAL),
                    earlyRepaymentPenaltyInterest: parseFloat(trans.earlyRepaymentPenaltyInterest),
                    reducedOriginalAmount: parseFloat(trans.reducedOriginalAmount),
                    reducedInterestAmount: parseFloat(trans.reducedInterestAmount),
                    increaseOriginalAmount: parseFloat(trans.increaseOriginalAmount),
                    increaseInterestAmount: parseFloat(trans.increaseInterestAmount),
                    remark: trans.remark,
                    transDesc: trans.transDesc,
                    postingDate: trans.postingDate,
                    postingOrder: trans.postingOrder,
                    moreRecordIndicator: moreRecordIndicatorResponse,
                };
            }),
            total: paginatedTransactions.length 
        },
    };

    res.json(response);
};