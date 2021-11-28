import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import Omnibar from "../../../components/panel/Omnibar";
import { useHotkeys } from "@mantine/hooks";

export const SearchModalContext =
  // @ts-ignore
  createContext<[boolean, Dispatch<SetStateAction<boolean>>]>(null);

export const useSearchModal = () => {
  const ctx = useContext(SearchModalContext);
  if (!ctx) {
    throw new Error(
      "useSearchModal hook was called outside of context, make sure your app is wrapped with Search component"
    );
  }
  return ctx;
};

export const Search: React.FC = ({ children }) => {
  const [opened, setOpened] = useState(false);

  useHotkeys([["mod+P", () => setOpened((v) => !v)]]);

  return (
    <SearchModalContext.Provider value={[opened, setOpened]}>
      {children}
      <Omnibar opened={opened} onClose={() => setOpened(false)} />
    </SearchModalContext.Provider>
  );
};
