import React, { forwardRef } from "react";
import { ActionIcon, TextInput, TextInputProps, Tooltip } from "@mantine/core";
import useCountDown from "../../utils/use-count-down";
import { Assign } from "../../utils/types";
import { ApiEntity } from "../../api/request";
import useToast from "../../utils/use-toast";
import { TwoDimensionalCode } from "@icon-park/react";

type VerifyCodeInputProps = Assign<
  TextInputProps,
  {
    sendCode: () => Promise<ApiEntity> | void | undefined | null;
  }
>;

const VerifyCodeInput = forwardRef<HTMLInputElement, VerifyCodeInputProps>(
  ({ sendCode, ...props }, ref) => {
    const toast = useToast();
    const [timeout, setTimeout] = useCountDown();
    const sendVerifyCode = () => {
      if (timeout > 0) {
        toast.def.error({
          title: "验证码发送过于频繁",
          message: "请等待一分钟后再发送",
        });
        return;
      }
      const send = sendCode();
      if (!send) {
        return;
      }
      send
        .then(
          toast.api.success({
            title: "发送验证码成功",
          })
        )
        .then(() => setTimeout(60))
        .catch(
          toast.api.error({
            title: "发送验证码失败",
          })
        );
    };
    return (
      <TextInput
        label="验证码"
        placeholder={
          timeout === 0 ? "点击右侧图标获取验证码" : `重新发送 (${timeout} 秒)`
        }
        {...props}
        ref={ref}
        rightSection={
          <ActionIcon onClick={sendVerifyCode}>
            <Tooltip
              withArrow
              label={
                timeout === 0 ? "点击发送验证码" : `重新发送 (${timeout} 秒)`
              }
            >
              <TwoDimensionalCode />
            </Tooltip>
          </ActionIcon>
        }
      />
    );
  }
);

export default VerifyCodeInput;
