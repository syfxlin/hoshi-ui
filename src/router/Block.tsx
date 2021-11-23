import React from "react";
import Main from "../components/Main";
import AlertBox from "../components/AlertBox";
import { Anchor } from "@mantine/core";
import { useNavigate } from "react-router-dom";

type BlockProps = {
  roles?: string[];
  message?: React.ReactNode;
};

const Block: React.FC<BlockProps> = (props) => {
  const navigate = useNavigate();
  const description =
    props.roles && props.roles.length > 0
      ? `有 [${props.roles}] 的权限`
      : "登录";
  return (
    <Main>
      <AlertBox title={props.message ?? "您无权访问该页面"}>
        该页面需要
        {description}
        才可访问。
        <Anchor color="red" onClick={() => navigate(-1)}>
          返回？
        </Anchor>
      </AlertBox>
    </Main>
  );
};

export default Block;
