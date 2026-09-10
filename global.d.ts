import { Vector3 } from "three";
import { MeshProps } from "@react-three/fiber";

type Vector3Like = Vector3 | [number, number, number];

declare module "@react-three/fiber" {
  interface ThreeElements {
    mesh: MeshProps & {
      position?: Vector3Like; // extend existing position type if needed
    };
  }
}
