import React, { useState } from "react";
import { Button, Popover } from "@mantine/core";
import PhotoPicker from "../../../components/form/PhotoPicker";

const Home: React.FC = () => {
  const [opened, setOpened] = useState(false);
  return (
    <div>
      <Popover
        opened={opened}
        onClose={() => setOpened(false)}
        target={
          <Button onClick={() => setOpened((o) => !o)}>Toggle popover</Button>
        }
        position="bottom"
        spacing={0}
        withArrow
      >
        <PhotoPicker onSelect={(p) => console.log(p)} />
      </Popover>
    </div>
  );
};

export default Home;
