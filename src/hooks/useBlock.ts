import {useContext} from "react";
import {BlockContext} from "../providers/Context.tsx";

export const useBlock = () => {
  const context = useContext(BlockContext);

  if (!context) {
    throw new Error('useBlock must be used within a BlockProvider');
  }

  return context;
}