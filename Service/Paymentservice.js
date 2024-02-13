const Dao = require("../DAO/Dao.js");

exports.Service_getAll = async () => {
  try {
    return await Dao.Dao_getAll();
  } catch (error) {
    throw error;
  }
};

exports.Service_getById = async (Purchase_id) => {
  try {
    return await Dao.DAO_getById(Purchase_id);
  } catch (error) {
    throw error;
  }
};

exports.Service_Delete = async (_id) => {
  try {
    return await Dao.Dao_Delete(_id);
  } catch (error) {
    throw error;
  }
};