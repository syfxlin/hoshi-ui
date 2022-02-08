import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useTh } from "../../theme/hooks/use-th";
import useSearch from "../../api/use-search";
import Box from "../layout/Box";
import { css } from "@emotion/react";
import {
  ActionIcon,
  Breadcrumbs,
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
import { ListNoteView } from "../../api/note";
import scrollIntoView from "smooth-scroll-into-view-if-needed";
import { Assign } from "../../utils/types";
import { Link } from "../Link";
import { useHotkeys } from "@mantine/hooks";
import { Helmet } from "react-helmet";

type OmnibarProps = Assign<
  ModalProps,
  {
    placeholder: string;
    onSelect: (note: ListNoteView) => void;
  }
>;

const Omnibar: React.FC<OmnibarProps> = ({
  placeholder,
  onSelect,
  children,
  ...props
}) => {
  const th = useTh();
  const search = useSearch();

  const [filter, setFilter] = useState(false);
  const [selected, setSelected] = useState(0);

  useHotkeys(
    props.opened
      ? [
          [
            "ArrowUp",
            () =>
              setSelected((v) =>
                v - 1 < 0 ? search.values.length - 1 : v - 1
              ),
          ],
          [
            "ArrowDown",
            () =>
              setSelected((v) => (v + 1 >= search.values.length ? 0 : v + 1)),
          ],
          ["Enter", () => onSelect(search.values[selected])],
          ["Escape", () => props.onClose()],
        ]
      : []
  );

  return (
    <Modal {...props} hideCloseButton size="lg" padding={0}>
      <Helmet>
        <title>搜索 - Hoshi-Note</title>
      </Helmet>
      <Box
        css={css`
          padding: ${th.spacing(2)} 0;
        `}
      >
        <Input
          placeholder={placeholder}
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
          <NoteItem
            key={note.id}
            note={note}
            active={index === selected}
            onSelect={onSelect}
          />
        ))}
      </VStack>
      {children}
    </Modal>
  );
};

const NoteItem = React.memo<{
  note: ListNoteView;
  active: boolean;
  onSelect: (node: ListNoteView) => void;
}>(({ note, active, onSelect }) => {
  const th = useTh();

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
      onClick={() => onSelect(note)}
      wrapChildren={false}
      css={css`
        width: 100%;
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
      <HStack
        justify="space-between"
        align="center"
        wrapChildren={false}
        css={css`
          width: 100%;
          overflow-x: hidden;
        `}
      >
        <Ellipsis>{note.name}</Ellipsis>
        <Breadcrumbs
          styles={{
            root: {
              maxWidth: "50%",
            },
          }}
        >
          <Ellipsis
            as={Link}
            size="sm"
            to={`/workspace/${note.breadcrumb.workspace.id}`}
          >
            {note.breadcrumb.workspace.name}
          </Ellipsis>
          {note.breadcrumb.parent.map((item) => (
            <Ellipsis
              key={item.id}
              as={Link}
              size="sm"
              to={`/doc/${item.id}/preview`}
            >
              {item.name}
            </Ellipsis>
          ))}
        </Breadcrumbs>
      </HStack>
    </HStack>
  );
});

export default Omnibar;
