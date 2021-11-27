import React, { useState } from "react";
import { ActionIcon, Popover } from "@mantine/core";
import { Emoji, Picker } from "emoji-mart-virtualized";
import { EmojiData } from "emoji-mart";
import { MantineNumberSize } from "@mantine/styles";
import { useColorScheme } from "../../theme/EmotionSystemProvider";

type EmojiPickerProps = {
  size: [number, MantineNumberSize];
  emoji: string | EmojiData;
  onSelect: (emoji: EmojiData) => Promise<void>;
};

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  size,
  emoji,
  onSelect,
  ...props
}) => {
  const [opened, setOpened] = useState(false);
  const [colorMode] = useColorScheme();
  return (
    <Popover
      zIndex={1001}
      opened={opened}
      onClose={() => setOpened(false)}
      withArrow
      spacing={0}
      target={
        <ActionIcon size={size[1]} onClick={() => setOpened(!opened)}>
          <Emoji set="twitter" size={size[0]} emoji={emoji} />
        </ActionIcon>
      }
      styles={{
        root: {
          display: "inline-flex",
          alignItems: "center",
          width: size[1],
        },
        target: {
          display: "inline-block",
        },
      }}
      {...props}
    >
      <Picker
        set="twitter"
        showPreview={false}
        showSkinTones={false}
        emojiTooltip={true}
        theme={colorMode}
        style={{ border: "none" }}
        onSelect={(emoji) => {
          onSelect(emoji).then(() => setOpened(false));
        }}
      />
    </Popover>
  );
};

export default EmojiPicker;
