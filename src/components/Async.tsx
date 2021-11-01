import React from "react";
import LoadingBox from "./LoadingBox";
import { AxiosError } from "axios";
import { ApiEntity } from "../api/request";
import { Button } from "@mantine/core";
import AlertBox from "./AlertBox";
import { SWRResponse } from "swr";

export type AsyncProps<T, E> = {
  query: SWRResponse<T, E>;
  loading?: React.ReactNode;
  error?: React.ReactNode;
  children?: React.ReactNode | ((data: T, props: any) => React.ReactNode);
};

export default function Async<T, E extends AxiosError<ApiEntity>>({
  children,
  query,
  loading,
  error,
  ...props
}: AsyncProps<T, E>) {
  // error
  if (query.error) {
    return (
      <AlertBox title={error ?? "获取失败"} {...props}>
        {(query.error as AxiosError<ApiEntity>).response?.data.message ??
          query.error.message}
        <Button color="red" variant="link" onClick={() => query.mutate()}>
          重试？
        </Button>
      </AlertBox>
    );
  }
  // loading
  if (!query.data) {
    return <LoadingBox {...props}>{loading}</LoadingBox>;
  }
  // success
  return (
    <>
      {typeof children === "function"
        ? children(query.data as T, props)
        : children}
    </>
  );
}
