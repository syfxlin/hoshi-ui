import React, { useState } from "react";
import { Button } from "@mantine/core";
import Omnibar from "../../../components/panel/Omnibar";

const Home: React.FC = () => {
  const [opened, setOpened] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpened(true)}>Open</Button>
      <Omnibar opened={opened} onClose={() => setOpened(false)} />
    </div>
  );
};

export default Home;
