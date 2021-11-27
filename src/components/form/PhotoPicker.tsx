import React, { ChangeEvent, useState } from "react";
import { useTh } from "../../theme/hooks/use-th";
import useFiles from "../../api/use-files";
import { usePexelsCurated, usePexelsSearch } from "../../api/use-pexels";
import {
  Anchor,
  Button,
  Col,
  Grid,
  Image,
  Input,
  Loader,
  Tabs,
  Text,
} from "@mantine/core";
import { css } from "@emotion/react";
import AspectRatio from "../layout/AspectRatio";
import { mod } from "../../api/url";
import { Dropzone } from "@mantine/dropzone";
import { HStack, VStack } from "../layout/Stack";
import { FileAdditionOne } from "@icon-park/react";
import useLoading from "../../utils/use-loading";
import { FileView } from "../../api/file";

type PhotoPickerProps = {
  onSelect: (photo?: { name: string; url: string }) => void;
};

const PhotoPicker: React.FC<PhotoPickerProps> = ({ onSelect }) => {
  const th = useTh();

  const files = useFiles();
  const curated = usePexelsCurated(1, 30);
  const search = usePexelsSearch(1, 30);

  const uploadLoading = useLoading();
  const [link, setLink] = useState("");

  return (
    <Tabs
      css={css`
        width: 550px;
      `}
    >
      <Tabs.Tab label="画廊">
        <VStack
          css={css`
            padding: ${th.spacing(2)} ${th.spacing(4)};
            max-height: 350px;
            overflow-y: auto;
          `}
        >
          <Input
            size="xs"
            placeholder="搜索图片"
            value={files.search}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              files.setSearch(e.currentTarget.value)
            }
            rightSection={
              !files.error && !files.data ? <Loader size="xs" /> : <div />
            }
          />
          <Grid gutter="xs">
            {files
              .values()
              ?.filter((item) => item.contentType?.startsWith("image"))
              .map((item) => (
                <Col key={item.id} span={3}>
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      radius="sm"
                      withPlaceholder
                      src={mod("hoshi-file", item.url)}
                      alt={item.name}
                      onClick={() =>
                        onSelect({
                          name: item.name,
                          url: mod("hoshi-file", item.url),
                        })
                      }
                      styles={{
                        root: {
                          transition: "opacity 150ms",
                          cursor: "pointer",
                          "&:hover": {
                            opacity: 0.85,
                          },
                        },
                        figure: {
                          width: "100%",
                          height: "100%",
                        },
                      }}
                    />
                  </AspectRatio>
                  <Text
                    size="xs"
                    color="dimmed"
                    css={css`
                      white-space: nowrap;
                      overflow-x: hidden;
                      text-overflow: ellipsis;
                    `}
                  >
                    {item.name}
                  </Text>
                </Col>
              ))}
          </Grid>
        </VStack>
      </Tabs.Tab>
      <Tabs.Tab label="上传">
        <VStack
          css={css`
            padding: ${th.spacing(4)};
            padding-top: ${th.spacing(2)};
          `}
        >
          <Dropzone
            loading={uploadLoading.loading}
            multiple={false}
            onDrop={(_files) => {
              uploadLoading.wrap(
                files.$uploadFile(_files[0]).then((entity) => {
                  const data = entity.data as FileView;
                  onSelect({
                    name: data.name,
                    url: data.url,
                  });
                })
              );
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
        </VStack>
      </Tabs.Tab>
      <Tabs.Tab label="链接">
        <VStack
          css={css`
            padding: ${th.spacing(4)};
            padding-top: ${th.spacing(2)};
          `}
        >
          <Input
            size="xs"
            placeholder="输入或粘贴链接"
            value={link}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setLink(e.currentTarget.value)
            }
          />
          <Button
            type="submit"
            size="xs"
            fullWidth
            onClick={() => {
              onSelect({
                name: "image",
                url: link,
              });
              setLink("");
            }}
          >
            提交
          </Button>
        </VStack>
      </Tabs.Tab>
      <Tabs.Tab label="Pexels">
        <VStack
          css={css`
            padding: ${th.spacing(2)} ${th.spacing(4)};
            max-height: 350px;
            overflow-y: auto;
          `}
        >
          <Input
            size="xs"
            placeholder="搜索图片"
            value={search.search}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              search.setSearch(e.currentTarget.value)
            }
            rightSection={search.loading() ? <Loader size="xs" /> : <div />}
          />
          <Grid gutter="xs">
            {(search.data ? search.data : curated.data)?.map((photo) => (
              <Col key={photo.id} span={3}>
                <AspectRatio ratio={16 / 9}>
                  <Image
                    radius="sm"
                    withPlaceholder
                    src={photo.src.medium}
                    alt={`by ${photo.photographer}`}
                    onClick={() =>
                      onSelect({
                        name: `by ${photo.photographer}`,
                        url: photo.src.original,
                      })
                    }
                    styles={{
                      root: {
                        cursor: "pointer",
                        transition: "opacity 150ms",
                        "&:hover": {
                          opacity: 0.85,
                        },
                      },
                      figure: {
                        width: "100%",
                        height: "100%",
                      },
                    }}
                  />
                </AspectRatio>
                <Text
                  size="xs"
                  color="dimmed"
                  css={css`
                    white-space: nowrap;
                    overflow-x: hidden;
                    text-overflow: ellipsis;
                  `}
                >
                  by{" "}
                  <Anchor
                    color="dimmed"
                    size="xs"
                    href={photo.photographer_url}
                  >
                    {photo.photographer}
                  </Anchor>
                </Text>
              </Col>
            ))}
          </Grid>
        </VStack>
      </Tabs.Tab>
      <Tabs.Tab label="移除" color="red">
        <VStack
          css={css`
            padding: ${th.spacing(4)};
            padding-top: ${th.spacing(2)};
          `}
        >
          <Button
            type="submit"
            size="xs"
            fullWidth
            color="red"
            onSelect={() => onSelect()}
          >
            确认移除
          </Button>
        </VStack>
      </Tabs.Tab>
    </Tabs>
  );
};

export default PhotoPicker;
