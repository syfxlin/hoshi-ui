import React, { useState } from "react";
import AppShellContainer from "../../../components/app-shell/AppShellContainer";
import AppShellHeader from "../../../components/app-shell/AppShellHeader";
import { HStack, VStack } from "../../../components/layout/Stack";
import ColorModeButton from "../../../components/header/ColorModeButton";
import Panel from "../../../components/panel/Panel";
import {
  Anchor,
  Button,
  Card,
  Col,
  Grid,
  Image,
  Loader,
  Modal,
  Pagination,
  SegmentedControl,
  Tab,
  Tabs,
  Text,
  TextInput,
} from "@mantine/core";
import AspectRatio from "../../../components/layout/AspectRatio";
import { css } from "@emotion/react";
import { useTh } from "../../../theme/hooks/use-th";
import { Dropzone } from "@mantine/dropzone";
import { FileAdditionOne, FileQuestion, Search } from "@icon-park/react";
import { UpdateFileView } from "../../../api/file";
import useLoading from "../../../utils/use-loading";
import Async from "../../../components/Async";
import { mod } from "../../../api/url";
import Box from "../../../components/layout/Box";
import useForm from "../../../utils/use-form";
import Form from "../../../components/form/Form";
import useFiles from "../../../api/use-files";
import Ellipsis from "../../../components/Ellipsis";

const File: React.FC = () => {
  // tool
  const th = useTh();
  // upload
  const [upload, setUpload] = useState(false);
  const uploadLoading = useLoading();
  // files
  const files = useFiles();
  // form
  const edit = useForm<UpdateFileView>({
    initial: {
      id: 0,
      name: "",
      description: "",
    },
    handleSubmit: (values, loading) => {
      loading(
        files
          .$updateFile({
            id: values.id,
            name: values.name || undefined,
            description: values.description || undefined,
          })
          .then(() => edit.close())
      );
    },
  });
  return (
    <AppShellContainer>
      <AppShellHeader>
        <div />
        <HStack spacing="xs" align="center">
          <SegmentedControl
            value={files.sort[0]}
            onChange={(value) => files.setSort([value, files.sort[1]])}
            size="xs"
            data={[
              { label: "文件名称", value: "name" },
              { label: "文件大小", value: "size" },
              { label: "文件类型", value: "contentType" },
              { label: "上传时间", value: "uploadedTime" },
            ]}
          />
          <SegmentedControl
            value={files.sort[1]}
            onChange={(value: "asc" | "desc") =>
              files.setSort([files.sort[0], value])
            }
            size="xs"
            data={[
              { label: "顺序", value: "asc" },
              { label: "逆序", value: "desc" },
            ]}
          />
          <TextInput
            aria-label="搜索文件"
            placeholder="搜索文件"
            size="xs"
            icon={<Search />}
            value={files.search}
            onChange={(e) => files.setSearch(e.currentTarget.value)}
            rightSection={
              !files.error && !files.data ? <Loader size="xs" /> : <div />
            }
          />
          <Button size="xs" onClick={() => setUpload(true)}>
            上传
          </Button>
          <ColorModeButton />
        </HStack>
      </AppShellHeader>
      <Panel title="文件">
        <Tabs tabPadding="md">
          <Tab label="文件列表">
            <Async query={files}>
              <Grid>
                {files.values.map((item) => (
                  <Col key={item.id} span={2}>
                    <Card withBorder padding="sm">
                      <Card.Section>
                        <AspectRatio ratio={4 / 3}>
                          {item.contentType?.startsWith("image") ? (
                            <Image
                              src={mod("hoshi-file", item.url)}
                              alt={item.name}
                              css={css`
                                .mantine-Image-figure {
                                  height: 100%;
                                }
                              `}
                            />
                          ) : (
                            <Box
                              css={css`
                                background-color: ${th.color(
                                  "gray.1",
                                  "gray.8"
                                )};
                              `}
                            >
                              <FileQuestion size="30%" />
                            </Box>
                          )}
                        </AspectRatio>
                      </Card.Section>
                      <VStack
                        spacing={1}
                        css={css`
                          margin-top: ${th.spacing(1)};
                          cursor: pointer;
                        `}
                      >
                        <Ellipsis weight={500} title={item.name}>
                          {item.name}
                        </Ellipsis>
                        <Ellipsis color="dimmed" size="xs">
                          {item.contentType ?? "Unknown"} - {item.size}
                        </Ellipsis>
                        <HStack spacing={2}>
                          <Anchor
                            size="sm"
                            onClick={() =>
                              window.open(
                                mod("hoshi-file", item.url, "download")
                              )
                            }
                          >
                            下载
                          </Anchor>
                          <Anchor
                            size="sm"
                            onClick={() => {
                              edit.open({
                                id: item.id,
                                name: item.name,
                                description: item.description ?? "",
                              });
                            }}
                          >
                            编辑
                          </Anchor>
                          <Anchor
                            size="sm"
                            color="red"
                            onClick={() => files.$deleteFile(item.id)}
                          >
                            删除
                          </Anchor>
                        </HStack>
                      </VStack>
                    </Card>
                  </Col>
                ))}
              </Grid>
              {files.data && (
                <Pagination
                  total={files.data.pages}
                  page={files.page}
                  onChange={files.setPage}
                  position="center"
                  css={css`
                    margin-top: ${th.spacing(2)};
                    margin-bottom: ${th.spacing(4)};
                  `}
                />
              )}
            </Async>
          </Tab>
        </Tabs>
      </Panel>
      <Modal opened={upload} onClose={() => setUpload(false)} title="上传文件">
        <Dropzone
          loading={uploadLoading.loading}
          multiple={false}
          onDrop={(_files) => {
            uploadLoading.wrap(files.$uploadFile(_files[0]));
          }}
        >
          {() => (
            <HStack align="center" spacing={6}>
              <FileAdditionOne
                css={css`
                  svg {
                    width: ${th.size(10)};
                    height: ${th.size(10)};
                  }
                `}
              />
              <VStack spacing={2}>
                <Text size="md">拖放文件或点击上传</Text>
                <Text size="sm" color="dimmed">
                  随意附上多个文件，每个文件不应超过 20 MB
                </Text>
              </VStack>
            </HStack>
          )}
        </Dropzone>
      </Modal>
      <Modal
        opened={edit.values.id !== 0}
        onClose={() => edit.reset()}
        title="编辑文件信息"
      >
        <Form onSubmit={edit.onSubmit}>
          <TextInput
            label="名称"
            placeholder="名称"
            value={edit.values.name}
            onChange={(e) => edit.setValue("name", e.currentTarget.value)}
            error={edit.errors.name}
          />
          <TextInput
            label="描述"
            placeholder="描述"
            value={edit.values.description ?? ""}
            onChange={(e) =>
              edit.setValue("description", e.currentTarget.value)
            }
            error={edit.errors.description}
          />
          <Button type="submit" fullWidth loading={edit.loading}>
            提交
          </Button>
        </Form>
      </Modal>
    </AppShellContainer>
  );
};

export default File;
