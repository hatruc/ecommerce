import React from "react";
import Category from "../../components/Category/Category";
import { WrapperButtonMore, WrapperCategory, WrapperProducts } from "./style";
import CardComponent from "../../components/CardComponent/CardComponent";
import * as ProductService from "../../services/ProductService";
import * as CategoryService from "../../services/CategoryService";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import Loading from "../../components/LoadingComponent/Loading";

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  // console.log('searchDebounce:', searchDebounce);
  const [limit, setLimit] = useState(6);

  const fetchAllProducts = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2];
    const res = await ProductService.getAllProducts(search, limit);
    // console.log(res);
    return res;
  };

  const fetchAllCategories = async () => {
    const res = await CategoryService.getAllCategories();
    // console.log(res);
    return res;
  };

  const {
    isPending: isPendingProducts,
    data: products,
    isPreviousData: isPreviousDataProducts,
  } = useQuery({
    queryKey: ["products", limit, searchDebounce],
    queryFn: fetchAllProducts,
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  const {
    isPending: isPendingCategories,
    data: categories,
    error: categoryError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchAllCategories,
  });
  if (categoryError) console.log(categoryError);
  // console.log(categories);

  // console.log(isPendingProducts, isPendingCategories);

  return (
    <>
      <div style={{ width: "1270px", margin: "0 auto" }}>
        <Loading isPending={isPendingCategories}>
          <WrapperCategory>
            <h3 style={{ marginLeft: "10px" }}>Danh mục:</h3>
            {categories?.data?.map((item) => {
              return <Category category={item} key={item._id} />;
            })}
          </WrapperCategory>
        </Loading>
      </div>
      <div
        className="body"
        style={{ width: "100%", backgroundColor: "#efefef" }}
      >
        <div
          id="container"
          style={{ height: "1000px", width: "1270px", margin: "0 auto" }}
        >
          <Loading isPending={isPendingProducts}>
            <WrapperProducts>
              {products?.data?.map((product) => {
                return (
                  <CardComponent
                    key={product._id}
                    quantityInStock={product.quantityInStock}
                    description={product.description}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    category={product.category}
                    sold={product.sold}
                    discount={product.discount}
                    id={product._id}
                  />
                );
              })}
            </WrapperProducts>
          </Loading>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <WrapperButtonMore
              buttonText={isPreviousDataProducts ? "Load more" : "Xem thêm"}
              type="outline"
              buttonStyle={{
                border: `1px solid ${
                  products?.total === products?.data?.length
                    ? "#f5f5f5"
                    : "var(--primary-color)"
                }`,
                color: `${
                  products?.total === products?.data?.length
                    ? "#f5f5f5"
                    : "var(--primary-color)"
                }`,
                width: "240px",
                height: "38px",
                borderRadius: "4px",
              }}
              disabled={
                products?.total === products?.data?.length ||
                products?.totalPage === 1
              }
              buttonTextStyle={{
                fontWeight: 500,
                color: products?.total === products?.data?.length && "#fff",
              }}
              onClick={() => setLimit((prev) => prev + 6)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
