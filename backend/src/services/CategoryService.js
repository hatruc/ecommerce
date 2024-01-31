const Category = require("../models/CategoryModel");

const createCategory = (newCategory) => {
  return new Promise(async (resolve, reject) => {
    const { name } = newCategory;
    try {
      const checkCategory = await Category.findOne({
        name: name,
      });
      if (checkCategory !== null) {
        resolve({
          status: "ERR",
          message: "category already exists",
        });
      }
      const createdCategory = await Category.create({
        name,
      });
      if (createdCategory) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdCategory,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateCategory = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await Category.findById(id);
      if (checkCategory === null) {
        resolve({
          status: "ERR",
          message: "category not found",
        });
      }

      const checkNameCategory = await Category.findOne({
        name: data.name,
      });
      // console.log(checkNameCategory);
      if (checkNameCategory !== null && checkCategory.name !== data.name) {
        resolve({
          status: "ERR",
          message: "category already exists",
        });
      }

      const updatedCategory = await Category.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedCategory,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteCategory = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await Category.findById(id);
      console.log("checkCategory", checkCategory);
      if (checkCategory === null) {
        resolve({
          status: "ERR",
          message: "category not found",
        });
      }

      await Category.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "delete category success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyCategory = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Category.deleteMany(ids);
      resolve({
        status: "OK",
        message: "delete categories success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllCategories = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allCategory = await Category.find().sort({
        createdAt: -1,
        updatedAt: -1,
      }); // sắp xếp theo thời gian giảm dần, nghĩa là mới nhât --> cập nhật gần nhất
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allCategory,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsCategory = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const category = await Category.findById(id);
      if (category === null) {
        resolve({
          status: "ERR",
          message: "category not found",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: category,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  deleteManyCategory,
  getAllCategories,
  getDetailsCategory,
};
