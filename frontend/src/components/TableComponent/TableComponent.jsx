import { Table } from "antd";
import React from "react";
import Loading from "../../components/LoadingComponent/Loading";

const TableComponent = (props) => {
  const { data: dataSource = [], isPending = false, columns = [] } = props;

  return (
    <Loading isPending={isPending}>
      <Table columns={columns} dataSource={dataSource} {...props} />
    </Loading>
  );
};

export default TableComponent;
