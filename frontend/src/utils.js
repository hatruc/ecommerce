export const convertPrice = (price) => {
  try {
    // Chuyển đổi số thành chuỗi và định dạng lại bằng dấu chấm
    const formattedPrice = price.toLocaleString("vi-VN");
    // console.log(price, formattedPrice);
    return `${formattedPrice}đ`;
  } catch (error) {
    return null;
  }
};

export const isJsonString = (data) => {
  try {
    JSON.parse(data);
  } catch (error) {
    return false;
  }
  return true;
};

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const validateNumber = (rule, value) => {
  return new Promise((resolve, reject) => {
    if (isNaN(value)) {
      reject("Please enter a valid number");
    } else {
      resolve();
    }
  });
};
