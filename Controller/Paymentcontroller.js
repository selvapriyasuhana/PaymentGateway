const PaymentService = require('../Service/Paymentservice.js');
const PaymentDao = require('../DAO/Dao.js');
const PaymentModel = require('../Model/Model.js');
exports.getById = async (req, res) => {
//router.get('/purchase/:id', async (req, res) => {
    try {
        const purchase = await PaymentModel.findById(req.params.id);
        if (!purchase) {
            return res.status(404).json({ error: 'Purchase not found' });
        }
        res.json(purchase);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to retrieve purchase');
    }

};
exports.getAll = async (req, res) => {
//router.get('/purchases', async (req, res) => {
    try {
        const purchases = await PaymentModel.find();
        res.json(purchases);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to retrieve purchases');
    }
};
exports.delete = async (req, res) => {
//router.delete('/purchase/:id', async (req, res) => {
    try {
        const deletedPurchase = await PaymentModel.findByIdAndDelete(req.params.id);
        if (!deletedPurchase) {
            return res.status(404).json({ error: 'Purchase not found' });
        }
        res.json({ message: 'Purchase deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to delete purchase');
    }
};