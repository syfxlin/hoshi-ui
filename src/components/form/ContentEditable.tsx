import React, {
  FocusEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { css } from "@emotion/react";
import { useTh } from "../../theme/hooks/use-th";

type ContentEditableProps = {
  editable?: boolean;
  value: string;
  onChange?: (value: string) => void;
  onBlur?: (e: FocusEvent) => void;
  onInput?: (e: FormEvent) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  placeholder?: string;
  autofocus?: boolean;
};

const ContentEditable: React.FC<ContentEditableProps> = (props) => {
  const th = useTh();
  const ref = useRef<HTMLSpanElement>(null);
  const [innerHTML, setInnerHTML] = useState(props.value);
  const lastValue = useRef("");
  // on change
  const onChange = () => {
    const value = ref.current?.innerText ?? "";
    if (value !== lastValue.current) {
      lastValue.current = value;
      props.onChange?.(value);
    }
  };
  // autofocus
  useLayoutEffect(() => {
    if (props.autofocus) {
      ref.current?.focus();
    }
  });
  // update by parent component
  useEffect(() => {
    if (props.value !== ref.current?.innerText) {
      setInnerHTML(props.value);
    }
  }, [props.value]);
  return (
    <span
      ref={ref}
      contentEditable={props.editable !== false}
      dangerouslySetInnerHTML={{ __html: innerHTML }}
      data-placeholder={props.placeholder}
      onInput={(e) => {
        onChange();
        props.onInput?.(e);
      }}
      onBlur={(e) => {
        onChange();
        props.onBlur?.(e);
      }}
      onKeyDown={(e) => {
        onChange();
        props.onKeyDown?.(e);
      }}
      css={css`
        outline: none;
        display: block;

        &:empty::before {
          display: inline-block;
          color: ${th.color("gray.5", "gray.7")};
          content: attr(data-placeholder);
          pointer-events: none;
          height: 0;
        }
      `}
    />
  );
};

export default ContentEditable;
