import React, { forwardRef, useEffect } from "react";
import { Editor, EditorContent, EditorOptions, useEditor } from "@tiptap/react";
import { editorCss, StarterKit } from "@syfxlin/tiptap-starter-kit";
import { css } from "@emotion/react";
import Box from "../layout/Box";
import { FileView, uploadFile } from "../../api/file";
import { mod } from "../../api/url";
import useToast from "../../utils/use-toast";

type TiptapProps = {
  editable?: boolean;
  value: string;
  onChange: (value: string) => void;
  options?: Partial<EditorOptions>;
};

const Tiptap = forwardRef<Editor, TiptapProps>((props, ref) => {
  const toast = useToast();

  const editor = useEditor({
    editable: props.editable !== false,
    extensions: [
      StarterKit.configure({
        uploader: {
          uploader: async (files) => {
            const items: File[] = [];
            for (let i = 0; i < files.length; i++) {
              const file = files.item(i);
              if (!file) {
                continue;
              }
              items.push(file);
            }
            const result = toast.create({
              color: "cyan",
              autoClose: false,
              title: "上传中...",
              message: `正在上传 ${items.length} 个文件...`,
            });
            try {
              const results = await Promise.all(
                items.map((item) => uploadFile(item))
              );
              result.update({
                color: "green",
                autoClose: 3000,
                title: "上传成功!",
                message: `上传所有文件成功!`,
              });
              return results
                .map((item) => item.data as FileView)
                .map((item, index) => ({
                  type: item.contentType || items[index].type,
                  name: item.name,
                  url: mod("hoshi-file", item.url),
                  size: item.size,
                }));
            } catch (e: any) {
              result.update({
                color: "red",
                autoClose: 3000,
                title: "上传失败!",
                message: e.response?.data.message ?? "未知错误",
              });
              throw e;
            }
          },
        },
      }),
    ],
    ...props.options,
  });

  // emit ref
  useEffect(() => {
    if (ref === null) {
      return;
    } else if (typeof ref === "function") {
      ref(editor);
    } else {
      ref.current = editor;
    }
  }, [editor]);

  // editable change
  useEffect(() => {
    editor?.setEditable(props.editable !== false);
  }, [editor, props.editable]);

  // value change
  useEffect(() => {
    // if not equals, indicates a state change caused by an external change
    if (editor && JSON.stringify(editor.getJSON()) !== props.value) {
      editor.commands.setContent(JSON.parse(props.value), false);
    }
  }, [editor, props.value]);
  // editor input, emit change
  useEffect(() => {
    const update = () => {
      editor && props.onChange(JSON.stringify(editor.getJSON()));
    };
    editor?.on("update", update);
    return () => {
      editor?.off("update", update);
    };
  }, [editor, props.onChange]);

  return (
    <>
      <EditorContent
        editor={editor}
        className={editorCss}
        css={css`
          cursor: text;
        `}
      />
      <Box
        onClick={() => editor?.commands.focus()}
        css={css`
          cursor: text;
          min-height: 10em;
          flex-grow: 100;
        `}
      />
    </>
  );
});

export default Tiptap;
