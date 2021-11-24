import React, { forwardRef, useEffect } from "react";
import { Editor, EditorContent, EditorOptions, useEditor } from "@tiptap/react";
import { editorCss, StarterKit } from "@syfxlin/tiptap-starter-kit";
import { css } from "@emotion/react";
import Box from "../layout/Box";

type TiptapProps = {
  editable?: boolean;
  value: string;
  onChange: (value: string) => void;
  options?: Partial<EditorOptions>;
};

const Tiptap = forwardRef<Editor, TiptapProps>((props, ref) => {
  const editor = useEditor({
    editable: props.editable !== false,
    extensions: [StarterKit],
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
      <EditorContent editor={editor} className={editorCss} />
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
