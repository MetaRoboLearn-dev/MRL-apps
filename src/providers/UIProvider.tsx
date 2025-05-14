import {PropsWithChildren, ReactNode, useState} from "react";
import {UIContext} from "./Context.tsx";

const UIProvider = ({children} : PropsWithChildren) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalHeader, setModalHeader] = useState<ReactNode>('');
  const [modalBody, setModalBody] = useState<ReactNode>('');
  const [modalFooter, setModalFooter] = useState<ReactNode>('');

  return (
    <UIContext.Provider value={{
      modalVisible, setModalVisible,
      modalHeader, setModalHeader,
      modalBody, setModalBody,
      modalFooter, setModalFooter,
    }}>
      {children}
    </UIContext.Provider>
  );
};

export default UIProvider;
