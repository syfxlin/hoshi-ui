import React, { useMemo, useState } from "react";
import AppShellContainer from "../../../components/app-shell/AppShellContainer";
import AppShellHeader from "../../../components/app-shell/AppShellHeader";
import { HStack, VStack } from "../../../components/layout/Stack";
import ColorModeButton from "../../../components/header/ColorModeButton";
import Panel from "../../../components/Panel";
import AuthorizeView from "../../../router/AuthorizeView";
import {
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
import {
  deleteFile,
  listFiles,
  updateFile,
  UpdateFile,
  uploadFile,
} from "../../../api/file";
import useToast from "../../../utils/use-toast";
import useLoading from "../../../utils/use-loading";
import useSWR from "swr";
import { useDebouncedValue } from "@mantine/hooks";
import Async from "../../../components/Async";
import { mod } from "../../../api/url";
import Box from "../../../components/layout/Box";
import useForm from "../../../utils/use-form";
import Form from "../../../components/form/Form";
import { Submit } from "../../ums/form";

const File: React.FC = () => {
  // tool
  const th = useTh();
  const toast = useToast();
  // upload
  const [upload, setUpload] = useState(false);
  const uploadLoading = useLoading();
  // query & data
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<[string, "asc" | "desc"]>([
    "uploadedTime",
    "desc",
  ]);
  const [search, setSearch] = useState("");
  const [debounced] = useDebouncedValue(search, 1000);
  const query = useSWR(
    ["listFiles", page, sort, debounced],
    (key, page, sort, search) =>
      listFiles(
        {
          page,
          sort: {
            [sort[0]]: sort[1],
          },
        },
        search === "" ? undefined : search
      )
  );
  const data = useMemo(() => query.data?.data, [query.data]);
  // form
  const edit = useForm({
    initial: {
      id: 0,
      name: "",
      description: "",
    },
    handleSubmit: (values, loading) => {
      const file: UpdateFile = {};
      if (values.name) {
        file.name = values.name;
      }
      if (values.description) {
        file.description = values.description;
      }
      loading(
        updateFile(values.id, file)
          .then(
            toast.api.success({
              title: "修改成功",
            })
          )
          .then(() => query.mutate())
          .then(() => edit.reset())
          .catch(
            toast.api.error({
              title: "修改失败",
            })
          )
      );
    },
  });
  return (
    <AppShellContainer>
      <AppShellHeader>
        <div />
        <HStack spacing="xs" align="center">
          <SegmentedControl
            value={sort[0]}
            onChange={(value) => setSort([value, sort[1]])}
            size="xs"
            data={[
              { label: "文件名称", value: "name" },
              { label: "文件大小", value: "size" },
              { label: "文件类型", value: "contentType" },
              { label: "上传时间", value: "uploadedTime" },
            ]}
          />
          <SegmentedControl
            value={sort[1]}
            onChange={(value: "asc" | "desc") => setSort([sort[0], value])}
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
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            rightSection={
              !query.error && !query.data ? <Loader size="xs" /> : <div />
            }
          />
          <Button size="xs" onClick={() => setUpload(true)}>
            上传
          </Button>
          <ColorModeButton />
        </HStack>
      </AppShellHeader>
      <Panel title="文件管理">
        <Tabs tabPadding="md">
          <Tab label="文件列表">
            <AuthorizeView>
              {(user) => {
                if (!user) {
                  return null;
                }
                return (
                  <Async query={query}>
                    <Grid>
                      {data?.records.map((item) => (
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

                                .mantine-Text-root {
                                  white-space: nowrap;
                                  text-overflow: ellipsis;
                                  overflow-x: hidden;
                                }
                              `}
                            >
                              <Text weight={500} title={item.name}>
                                {item.name}
                              </Text>
                              <Text color="dimmed" size="xs">
                                {item.contentType ?? "Unknown"} - {item.size}
                              </Text>
                              <HStack spacing={2}>
                                <Button
                                  size="sm"
                                  variant="link"
                                  onClick={() =>
                                    window.open(
                                      mod("hoshi-file", item.url, "download")
                                    )
                                  }
                                >
                                  下载
                                </Button>
                                <Button
                                  size="sm"
                                  variant="link"
                                  onClick={() => {
                                    edit.setValues({
                                      id: item.id,
                                      name: item.name,
                                      description: item.description ?? "",
                                    });
                                  }}
                                >
                                  编辑
                                </Button>
                                <Button
                                  size="sm"
                                  variant="link"
                                  color="red"
                                  onClick={() =>
                                    deleteFile(item.disk)
                                      .then(
                                        toast.api.success({
                                          title: "删除成功",
                                        })
                                      )
                                      .then(() => query.mutate())
                                      .catch(
                                        toast.api.error({
                                          title: "删除失败",
                                        })
                                      )
                                  }
                                >
                                  删除
                                </Button>
                              </HStack>
                            </VStack>
                          </Card>
                        </Col>
                      ))}
                    </Grid>
                    {data && (
                      <Pagination
                        total={data.pages}
                        page={page}
                        onChange={setPage}
                        position="center"
                        css={css`
                          margin-top: ${th.spacing(2)};
                          margin-bottom: ${th.spacing(4)};
                        `}
                      />
                    )}
                  </Async>
                );
              }}
            </AuthorizeView>
          </Tab>
        </Tabs>
      </Panel>
      <Modal opened={upload} onClose={() => setUpload(false)} title="上传文件">
        <Dropzone
          loading={uploadLoading.loading}
          onDrop={(files) => {
            uploadLoading.wrap(
              uploadFile(files[0])
                .then(
                  toast.api.success({
                    title: "上传成功",
                  })
                )
                .then(() => query.mutate())
                .catch(
                  toast.api.error({
                    title: "上传失败",
                  })
                )
            );
          }}
          multiple={false}
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
          <Submit loading={edit.loading}>提交</Submit>
        </Form>
      </Modal>
    </AppShellContainer>
  );
};

export default File;
