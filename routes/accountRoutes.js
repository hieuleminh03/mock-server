const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { validateKeyword, validateAccountNo } = require('../middlewares/validation');

router.post('/payment-account/list/1.0', validateKeyword, accountController.paymentAccountListInquiry);
router.post('/payment-account/export/1.0', validateKeyword, accountController.exportAccountData);
router.post('/payment-account/detail/1.0', validateAccountNo, accountController.getAccountDetail);
router.post('/payment-account/trans-his/list/1.0', accountController.getTransactionHistory);

router.post('/deposit-account/list/1.0', validateKeyword, accountController.depositAccountListInquiry);
router.post('/deposit-account/export/1.0', validateKeyword, accountController.exportDepositAccountData);
router.post('/deposit-account/detail/1.0', validateAccountNo, accountController.getDepositAccountDetail);
router.post('/deposit-account/trans-his/list/1.0', accountController.getDepositTransactionHistory);

module.exports = router;