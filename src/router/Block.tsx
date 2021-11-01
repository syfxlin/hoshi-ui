import React from "react";
import Main from "../components/Main";
import AlertBox from "../components/AlertBox";
import { Button } from "@mantine/core";
import { useHistory } from "react-router-dom";

type BlockProps = {
  roles?: string[];
  message?: React.ReactNode;
};

const Block: React.FC<BlockProps> = (props) => {
  const history = useHistory();
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
        <Button color="red" variant="link" onClick={() => history.goBack()}>
          返回？
        </Button>
      </AlertBox>
    </Main>
  );
};

export default Block;
