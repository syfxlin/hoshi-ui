import React from "react";
import Main from "../components/Main";
import { Navigate, useNavigate } from "react-router-dom";
import useMe from "../api/use-me";
import Header from "../components/header/Header";
import {
  Anchor,
  Button,
  Container,
  Image,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { css } from "@emotion/react";
import { useTh } from "../theme/hooks/use-th";
import { HStack, VStack } from "../components/layout/Stack";
import { Github, Right, Star } from "@icon-park/react";
import Box from "../components/layout/Box";
import preview from "../assets/preview.png";
import previewDark from "../assets/preview-dark.png";
import preview1 from "../assets/preview-1.gif";
import preview2 from "../assets/preview-2.gif";
import preview3 from "../assets/preview-3.gif";
import logo from "../assets/icon.png";
import { Helmet } from "react-helmet";

const Index: React.FC = () => {
  const th = useTh();
  const navigate = useNavigate();
  const me = useMe();
  return (
    <>
      {me.data && <Navigate to="/dashboard" />}
      <Helmet>
        <title>Hoshi-Note - 你的云端知识管理库</title>
      </Helmet>
      <Header />
      <Main
        css={css`
          margin-top: 60px;
        `}
      >
        <Box>
          <VStack
            spacing={8}
            size="lg"
            as={Container}
            css={css`
              justify-content: center;
              text-align: center;
              padding-top: ${th.spacing(25)};
              padding-bottom: ${th.spacing(25)};
            `}
          >
            <Title
              order={1}
              css={css`
                font-size: ${th.fontSize(4)};
              `}
            >
              你的云端
              <span
                css={css`
                  background-image: linear-gradient(
                    52deg,
                    ${th.color("blue.7", "blue.5")} 3%,
                    ${th.color("cyan.5", "cyan.4")} 97%
                  );
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                `}
              >
                知识管理
              </span>
              库
            </Title>
            <Text
              color="dimmed"
              css={css`
                font-size: ${th.fontSize(1.5)};
              `}
            >
              还在使用纸笔来管理你的笔记和文档吗？
              找不到上次写的笔记放在了哪台电脑？
              等需要的时候才发现笔记不在身边？
              笔记忘记保存了，丢失了辛辛苦苦写的内容？
              是时候将你的笔记托付给云平台了！
            </Text>
            <HStack justify="center">
              <Button
                size="lg"
                radius="md"
                variant="gradient"
                leftIcon={<Star />}
                onClick={() => navigate(`/register`)}
              >
                开始使用
              </Button>
              <Button
                size="lg"
                radius="md"
                variant="outline"
                color="cyan"
                leftIcon={<Github />}
                onClick={() =>
                  window.open(`https://github.com/syfxlin/hoshi-note`)
                }
              >
                Github
              </Button>
            </HStack>
            <Paper
              shadow="rgb(0 0 0 / 25%) 0px 10px 26px 0px"
              radius="md"
              css={css`
                overflow: hidden;
              `}
            >
              <Image
                src={th.colorScheme === "light" ? preview : previewDark}
                alt="Hoshi-Note preview"
              />
            </Paper>
          </VStack>
        </Box>
        <Box
          css={css`
            background-color: ${th.color("gray.1", "dark.5")};
          `}
        >
          <Box
            css={css`
              overflow: hidden;
            `}
          >
            <svg
              preserveAspectRatio="none"
              viewBox="0 0 1200 120"
              xmlns="http://www.w3.org/2000/svg"
              css={css`
                fill: ${th.color("white", "dark.7")};
                width: 150%;
                height: ${th.spacing(15)};
                transform: scaleX(-1);
                filter: drop-shadow(rgba(0, 0, 0, 0.05) 10px 5px 5px);
              `}
            >
              <path d="M321.39 56.44c58-10.79 114.16-30.13 172-41.86 82.39-16.72 168.19-17.73 250.45-.39C823.78 31 906.67 72 985.66 92.83c70.05 18.48 146.53 26.09 214.34 3V0H0v27.35a600.21 600.21 0 00321.39 29.09z" />
            </svg>
          </Box>
          <VStack
            spacing={25}
            css={css`
              margin-top: ${th.spacing(25)};
              margin-bottom: ${th.spacing(25)};
            `}
          >
            <HStack size="lg" spacing={10} as={Container}>
              <VStack spacing={8}>
                <Text
                  css={css`
                    font-size: ${th.fontSize(1.8)};
                  `}
                >
                  高效、直观的可视化编辑器
                </Text>
                <Text
                  color="dimmed"
                  css={css`
                    font-size: ${th.fontSize(1.05)};
                    line-height: 2;
                  `}
                >
                  出色的编辑性能，在 20 万单词下依然可以正常的输入。
                  <br />
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  插入块不必移动鼠标，输入 '/' 即可快速呼出菜单。
                  <br />
                  选中文本则会在光标处弹出操作按钮，无需长距离移动鼠标。
                </Text>
              </VStack>
              <Paper
                shadow="rgb(0 0 0 / 25%) 0px 10px 26px 0px"
                radius="md"
                css={css`
                  overflow: hidden;
                `}
              >
                <Image src={preview1} alt="Hoshi-Note preview 1" />
              </Paper>
            </HStack>
            <HStack size="lg" spacing={10} as={Container}>
              <Paper
                shadow="rgb(0 0 0 / 25%) 0px 10px 26px 0px"
                radius="md"
                css={css`
                  overflow: hidden;
                `}
              >
                <Image src={preview2} alt="Hoshi-Note preview 2" />
              </Paper>
              <VStack spacing={8}>
                <Text
                  css={css`
                    font-size: ${th.fontSize(1.8)};
                  `}
                >
                  丰富的内容支持
                </Text>
                <Text
                  color="dimmed"
                  css={css`
                    font-size: ${th.fontSize(1.05)};
                    line-height: 2;
                  `}
                >
                  支持常规的文本效果，你可以使用浮动菜单或 Markdown
                  短语进行输入。
                  <br />
                  除了常规的内容，你还可以为你的笔记增添代码、公式、图等高级内容。
                  <br />
                  必要时候可以使用折叠块隐藏答案，回顾时即可验证学习效果。
                </Text>
              </VStack>
            </HStack>
            <HStack size="lg" spacing={10} as={Container}>
              <VStack spacing={8}>
                <Text
                  css={css`
                    font-size: ${th.fontSize(1.8)};
                  `}
                >
                  搜索快人一步
                </Text>
                <Text
                  color="dimmed"
                  css={css`
                    font-size: ${th.fontSize(1.05)};
                    line-height: 2;
                  `}
                >
                  Ctrl + P 快速调出搜索窗口，笔记手到擒来。
                  <br />
                  排序搜索结果，更快找到目标笔记。
                  <br />
                  多模式过滤，剔除无关笔记。
                </Text>
              </VStack>
              <Paper
                shadow="rgb(0 0 0 / 25%) 0px 10px 26px 0px"
                radius="md"
                css={css`
                  overflow: hidden;
                `}
              >
                <Image src={preview3} alt="Hoshi-Note preview 3" />
              </Paper>
            </HStack>
          </VStack>
        </Box>
        <Box>
          <Box
            css={css`
              overflow: hidden;
            `}
          >
            <svg
              preserveAspectRatio="none"
              viewBox="0 0 1200 120"
              xmlns="http://www.w3.org/2000/svg"
              css={css`
                fill: ${th.color("gray.1", "dark.5")};
                width: 150%;
                height: ${th.spacing(15)};
                transform: scaleX(-1);
                filter: drop-shadow(rgba(0, 0, 0, 0.05) 10px 5px 5px);
              `}
            >
              <path d="M321.39 56.44c58-10.79 114.16-30.13 172-41.86 82.39-16.72 168.19-17.73 250.45-.39C823.78 31 906.67 72 985.66 92.83c70.05 18.48 146.53 26.09 214.34 3V0H0v27.35a600.21 600.21 0 00321.39 29.09z" />
            </svg>
          </Box>
          <VStack
            align="center"
            spacing={2}
            css={css`
              margin-top: ${th.spacing(25)};
              margin-bottom: ${th.spacing(25)};
              text-align: center;
            `}
          >
            <Image
              src={logo}
              alt="Hoshi-Note logo"
              width={th.fontSize(8)}
              height={th.fontSize(8)}
            />
            <Text
              weight={500}
              css={css`
                font-size: ${th.fontSize(2.25)};
              `}
            >
              从现在开始尝试？
            </Text>
            <Text
              color="dimmed"
              css={css`
                font-size: ${th.fontSize(1.1)};
              `}
            >
              Hoshi-Note 是开源的。
              <br />
              你可以免费的使用它。或者可以在自有的基础设施上托管。
            </Text>
            <Button
              size="lg"
              radius="md"
              variant="gradient"
              rightIcon={<Right />}
              onClick={() => navigate(`/register`)}
              css={css`
                margin-top: ${th.spacing(4)};
              `}
            >
              开始使用
            </Button>
          </VStack>
        </Box>
        <Box
          css={css`
            padding: ${th.spacing(8)};
            background-color: ${th.color("gray.1", "dark.5")};
            text-align: right;
          `}
        >
          <Container size="lg">
            <Text color="dimmed">
              {new Date().getFullYear()} ©{" "}
              <Anchor href="https://ixk.me">Otstar Lin</Anchor>. All rights
              reserved.
            </Text>
          </Container>
        </Box>
      </Main>
    </>
  );
};

export default Index;
