import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useTh } from "../../theme/hooks/use-th";
import useSearch from "../../api/use-search";
import Box from "../layout/Box";
import { css } from "@emotion/react";
import {
  ActionIcon,
  Button,
  Col,
  Collapse,
  Divider,
  Grid,
  Input,
  Modal,
  ModalProps,
  Select,
  ThemeIcon,
} from "@mantine/core";
import { Close, Filter, Search } from "@icon-park/react";
import { HStack, VStack } from "../layout/Stack";
import { DatePicker } from "@mantine/dates";
import { Emoji } from "emoji-mart-virtualized";
import Ellipsis from "../Ellipsis";
import { useHotkeys } from "@mantine/hooks";
import { ListNoteView } from "../../api/note";
import scrollIntoView from "smooth-scroll-into-view-if-needed";
import { useNavigate } from "react-router-dom";

const Omnibar: React.FC<ModalProps> = (props) => {
  const th = useTh();
  const navigate = useNavigate();
  const search = useSearch();

  const [filter, setFilter] = useState(false);
  const [selected, setSelected] = useState(0);

  useHotkeys([
    [
      "ArrowUp",
      () => setSelected((v) => (v - 1 < 0 ? search.values.length - 1 : v - 1)),
    ],
    [
      "ArrowDown",
      () => setSelected((v) => (v + 1 >= search.values.length ? 0 : v + 1)),
    ],
    ["Enter", () => navigate(`/doc/${search.values[selected].id}/preview`)],
    ["Escape", () => props.onClose()],
  ]);

  return (
    <Modal {...props} hideCloseButton size="lg" padding={0}>
      <Box
        css={css`
          padding: ${th.spacing(2)} 0;
        `}
      >
        <Input
          placeholder="搜索..."
          variant="unstyled"
          size="md"
          icon={<Search />}
          value={search.search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            search.setSearch(e.currentTarget.value)
          }
          rightSection={
            <ActionIcon
              loading={!search.error && !search.data}
              onClick={() => search.setSearch("")}
              styles={{
                root: {
                  color: th.color("gray.5", "dark.2"),
                  marginRight: th.spacing(2),
                },
              }}
            >
              {search.search ? <Close /> : <span />}
            </ActionIcon>
          }
        />
      </Box>
      <Divider />
      <HStack
        justify="space-between"
        css={css`
          padding: ${th.spacing(2)} ${th.spacing(4)};
        `}
      >
        <HStack>
          <Select
            size="xs"
            variant="filled"
            value={search.sort[0]}
            onChange={(value: string) =>
              search.setSort([value, search.sort[1]])
            }
            data={[
              { label: "笔记名称", value: "name" },
              { label: "创建时间", value: "createdTime" },
              { label: "最后修改时间", value: "updatedTime" },
            ]}
          />
          <Select
            size="xs"
            variant="filled"
            value={search.sort[1]}
            onChange={(value: "asc" | "desc") =>
              search.setSort([search.sort[0], value])
            }
            data={[
              { label: "顺序", value: "asc" },
              { label: "逆序", value: "desc" },
            ]}
          />
        </HStack>
        <Button
          size="xs"
          variant="light"
          leftIcon={<Filter />}
          onClick={() => setFilter((v) => !v)}
        >
          过滤器
        </Button>
      </HStack>
      <Collapse in={filter}>
        <Grid
          css={css`
            padding: ${th.spacing(2)} ${th.spacing(4)};
          `}
        >
          <Col span={4}>
            <Select
              size="xs"
              variant="filled"
              label="仅匹配标题"
              value={search.filters.onlyName ? "true" : "false"}
              onChange={(value) =>
                search.setFilters((prev) => ({
                  ...prev,
                  onlyName: value === "true",
                }))
              }
              data={[
                { value: "false", label: "所有" },
                { value: "true", label: "仅匹配" },
              ]}
            />
          </Col>
          <Col span={4}>
            <Select
              size="xs"
              variant="filled"
              label="工作区"
              value={search.filters.workspace}
              onChange={(value) =>
                search.setFilters((prev) => ({
                  ...prev,
                  workspace: value ?? "",
                }))
              }
              data={[
                { value: "", label: "所有" },
                ...search.workspaces.map((w) => ({
                  value: w.id,
                  label: w.name,
                })),
              ]}
            />
          </Col>
          <Col span={4}>
            <Select
              size="xs"
              variant="filled"
              label="状态"
              value={search.filters.status}
              onChange={(value) =>
                search.setFilters((prev) => ({
                  ...prev,
                  status: value ?? "",
                }))
              }
              data={[
                { value: "", label: "所有" },
                { value: "NORMAL", label: "活动" },
                { value: "ARCHIVE", label: "归档" },
                { value: "DELETED", label: "已删除" },
              ]}
            />
          </Col>
          <Col span={6}>
            <DatePicker
              size="xs"
              variant="filled"
              label="最后修改时间（起始）"
              placeholder="选择一个时间"
              zIndex={1001}
              // @ts-ignore
              value={
                search.filters.updatedTimeStart
                  ? new Date(search.filters.updatedTimeStart)
                  : null
              }
              onChange={(value) =>
                search.setFilters((prev) => ({
                  ...prev,
                  updatedTimeStart: value ? value.toISOString() : "",
                }))
              }
            />
          </Col>
          <Col span={6}>
            <DatePicker
              size="xs"
              variant="filled"
              label="最后修改时间（结束）"
              placeholder="选择一个时间"
              zIndex={1001}
              // @ts-ignore
              value={
                search.filters.updatedTimeEnd
                  ? new Date(search.filters.updatedTimeEnd)
                  : null
              }
              onChange={(value) =>
                search.setFilters((prev) => ({
                  ...prev,
                  updatedTimeEnd: value ? value.toISOString() : "",
                }))
              }
            />
          </Col>
          <Col span={6}>
            <DatePicker
              size="xs"
              variant="filled"
              label="创建时间（起始）"
              placeholder="选择一个时间"
              zIndex={1001}
              // @ts-ignore
              value={
                search.filters.createdTimeStart
                  ? new Date(search.filters.createdTimeStart)
                  : null
              }
              onChange={(value) =>
                search.setFilters((prev) => ({
                  ...prev,
                  createdTimeStart: value ? value.toISOString() : "",
                }))
              }
            />
          </Col>
          <Col span={6}>
            <DatePicker
              size="xs"
              variant="filled"
              label="创建时间（结束）"
              placeholder="选择一个时间"
              zIndex={1001}
              // @ts-ignore
              value={
                search.filters.createdTimeEnd
                  ? new Date(search.filters.createdTimeEnd)
                  : null
              }
              onChange={(value) =>
                search.setFilters((prev) => ({
                  ...prev,
                  createdTimeEnd: value ? value.toISOString() : "",
                }))
              }
            />
          </Col>
        </Grid>
      </Collapse>
      <VStack
        spacing={0}
        css={css`
          overflow-y: auto;
          max-height: calc(100vh - 285px);
        `}
      >
        {search.values.map((note, index) => (
          <NoteItem note={note} active={index === selected} key={note.id} />
        ))}
      </VStack>
    </Modal>
  );
};

const NoteItem = React.memo<{ note: ListNoteView; active: boolean }>(
  ({ note, active }) => {
    const th = useTh();

    const navigate = useNavigate();

    const ref = useRef<any>();
    useEffect(() => {
      if (ref.current && active) {
        scrollIntoView(ref.current, {
          scrollMode: "if-needed",
          block: "center",
        });
      }
    }, [ref, active]);

    return (
      <HStack
        ref={ref}
        onClick={() => navigate(`/doc/${note.id}/preview`)}
        css={css`
          padding: ${th.spacing(3)} ${th.spacing(4)};
          border-radius: ${th.radius("sm")};
          cursor: pointer;
          transition: background-color 150ms;

          &:hover {
            background-color: ${th.color("gray.1", "dark.5")};
          }

          ${active &&
          css`
            background-color: ${th.color("gray.1", "dark.5")};
          `}
        `}
      >
        <ThemeIcon variant="light" size="md">
          <Emoji
            set="twitter"
            size={th.theme.fontSizes.base}
            emoji={note.icon || "spiral_note_pad"}
          />
        </ThemeIcon>
        <Ellipsis>{note.name}</Ellipsis>
      </HStack>
    );
  }
);

export default Omnibar;
