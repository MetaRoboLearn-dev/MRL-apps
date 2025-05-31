import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import {Group, Euler, Mesh} from "three";

const getRandomRotation = () =>
  new Euler(0, Math.random() * Math.PI * 2, 0); // rotate only on Y axis

const SimTree = () => {
  const big = useGLTF('barrier/Tree_big.glb').scene;
  const medium = useGLTF('barrier/Tree_medium.glb').scene;
  const small = useGLTF('barrier/Tree_small.glb').scene;

  const group = useMemo(() => {
    const container = new Group();

    const variant = Math.floor(Math.random() * 3);

    if (variant === 0) {
      const tree = big.clone(true);
      tree.rotation.copy(getRandomRotation());
      container.add(tree);
    } else if (variant === 1) {
      const medTree = medium.clone(true);
      medTree.position.set(1.3, 0, 1.3);
      medTree.rotation.copy(getRandomRotation());
      container.add(medTree);

      const smallTree_1 = small.clone(true);
      smallTree_1.position.set(-1.3, 0, 0);
      smallTree_1.rotation.copy(getRandomRotation());
      container.add(smallTree_1);

      const smallTree_2 = small.clone(true);
      smallTree_2.position.set(1.3, 0, -1.3);
      smallTree_2.rotation.copy(getRandomRotation());
      container.add(smallTree_2);
    } else {
      const smallTree_1 = small.clone(true);
      smallTree_1.position.set(1.3, 0, 1.3);
      smallTree_1.rotation.copy(getRandomRotation());
      container.add(smallTree_1);

      const smallTree_2 = small.clone(true);
      smallTree_2.position.set(-1.3, 0, 1.3);
      smallTree_2.rotation.copy(getRandomRotation());
      container.add(smallTree_2);

      const smallTree_3 = small.clone(true);
      smallTree_3.position.set(1.3, 0, -1.3);
      smallTree_3.rotation.copy(getRandomRotation());
      container.add(smallTree_3);
    }

    container.rotation.copy(getRandomRotation());
    container.scale.set(0.14, 0.16, 0.16);
    container.position.y = 0.5;
    container.traverse((child) => {
      if (child as Mesh) {
        child.castShadow = true;
        child.receiveShadow = false;
      }
    });

    return container;
  }, [big, medium, small]);

  return <primitive object={group} />;
};

export default SimTree;