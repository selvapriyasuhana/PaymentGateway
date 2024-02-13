const Purchase = require('../Model/Model.js');

exports.getAll = async () => {
    try {
        return await Purchase.find();
    } catch (error) {
        throw error;
    }
};

exports.getById = async (PurchaseId) => {
    try {
        return await Purchase.findById(PurchaseId);
    } catch (error) {
        throw error;
    }
};


exports.delete = async (PurchaseId) => {
    try {
        return await Purchase.findByIdAndDelete(PurchaseId);
    } catch (error) {
        throw error;
    }
};


