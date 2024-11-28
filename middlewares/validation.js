const { body, validationResult } = require('express-validator');

const generateTraceId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(error => ({
            errorCode: error.param || 'unknown',
            errorDesc: error.msg,               
            refVal: error.value || null         
        }));

        return res.status(400).json({
            status: 400,
            code: '400',
            message: 'BAD_REQUEST',
            errors: formattedErrors,
            traceId: generateTraceId(),
            data: null,
        });
    }
    next();
};

const validateKeywordAndCurrency = [
    body('keyword')
        .optional()
        .isString()
        .isLength({ max: 100 }).withMessage('Độ dài tìm kiếm không được vượt quá 100')
        .matches(/^[a-zA-Z0-9 ]*$/).withMessage('Từ khóa tìm kiếm không được chứa ký tự đặc biệt'),
    body('currCode')
        .optional()
        .isString()
        .matches(/^[a-zA-Z]*$/).withMessage('Mã đồng tiền không được chứa ký tự đặc biệt'),
    handleValidationErrors
];

const validateKeyword = [
    body('keyword')
        .optional()
        .isString()
        .isLength({ max: 100 }).withMessage('Độ dài tìm kiếm không được vượt quá 100')
        .matches(/^[a-zA-Z0-9 ]*$/).withMessage('Từ khóa tìm kiếm không được chứa ký tự đặc biệt'),
    handleValidationErrors
];

const validateAccountNo = [
    body('accountNo')
        .notEmpty().withMessage('Số tài khoản không được để trống')
        .matches(/^[0-9]*$/).withMessage('Số tài khoản không được chứa ký tự đặc biệt'),
    handleValidationErrors
];

const validateTransactionHistory = [
    body('accountNo')
        .notEmpty().withMessage('Số tài khoản không được để trống')
        .matches(/^[0-9]*$/).withMessage('Số tài khoản không được chứa ký tự đặc biệt'),
    body('startDate')
        .optional()
        .isISO8601().withMessage('Ngày bắt đầu không đúng định dạng'),
    body('endDate')
        .optional()
        .isISO8601().withMessage('Ngày kết thúc không đúng định dạng'),
    body('moreRecordIndicator')
        .optional()
        .matches(/^[YN]$/).withMessage('More record indicator không đúng định dạng'),
    body('postingDate')
        .optional()
        .isISO8601().withMessage('Ngày ghi sổ không đúng định dạng'),
    body('postingOrder')
        .optional()
        .isString().withMessage('Thứ tự ghi sổ không đúng định dạng'),
    body('nextRUNBAL')
        .optional()
        .isString().withMessage('Số dư sau giao dịch không đúng định dạng'),
    handleValidationErrors
];

module.exports = { validateKeywordAndCurrency, validateKeyword, validateAccountNo, validateTransactionHistory };
