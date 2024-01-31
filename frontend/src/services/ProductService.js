import axios from "axios";
import { axiosJWT } from "./UserService";
// import { getDetailsCategory } from "./CategoryService";
export const getAllProducts = async (search, limit) => {
  try {
    let res = {};

    if (search?.length > 0) {
      res = await axios.get(
        `${process.env.REACT_APP_API_URL}/product/get-all-products?filter=name&filter=${search}&limit=${limit}`
      );
    } else {
      res = await axios.get(
        `${process.env.REACT_APP_API_URL}/product/get-all-products?limit=${limit}`
      );
    }
    // console.log(res);

    // await Promise.all(
    //   res.data.data.map(async (product) => {
    //     const detail = await getDetailsCategory(product.category);
    //     if(detail.status === "OK"){
    //         product.category = detail.data.name
    //     }
    //     else {
    //         product.category = detail.message
    //     }
    //   })
    // );

    // console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error in getAllProducts in ProductService:", error);
    throw error; 
  }
};

export const createProduct = async (data, access_token) => {
  console.log(data);
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/product/create-product`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getDetailsProduct = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/get-details-product/${id}`
  );
  return res.data;
};

export const updateProduct = async (id, data, access_token) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/product/update-product/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteProduct = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/product/delete-product/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteManyProducts = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/product/delete-many-products`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
