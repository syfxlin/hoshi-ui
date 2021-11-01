import React from "react";
import Main from "../layout/Main";
import AlertBox from "../components/AlertBox";
import { Button } from "@mantine/core";
import { useHistory } from "react-router-dom";

type Props = {
  roles?: string[];
  message?: React.ReactNode;
  type?: "success" | "info" | "warning" | "error";
  closable?: boolean;
  closeText?: React.ReactNode;
  description?: React.ReactNode;
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  afterClose?: () => void;
  showIcon?: boolean;
  role?: string;
  style?: React.CSSProperties;
  prefixCls?: string;
  className?: string;
  banner?: boolean;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const Block: React.FC<Props> = (props) => {
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
