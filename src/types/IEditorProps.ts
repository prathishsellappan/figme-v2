import { BaseUserMeta, User } from "@liveblocks/client";
import { Canvas, FabricObject, Path, TEvent } from "fabric";

export enum CursorMode {
  Hidden,
  Chat,
  ReactionSelector,
  Reaction,
}

export type CursorState = 

  | {
    mode: CursorMode.Hidden;
  }
  | {
    mode: CursorMode.Chat;
    message: string;
    previousMessage: string | null;
  }
  | {
    mode: CursorMode.ReactionSelector;
  }
  | {
    mode: CursorMode.Reaction;
    reaction: string;
    isPressed: boolean;
  };
  




export type ShapeData = {
  type: string;
  width: number;
  height: number;
  fill: string;
  left: number;
  top: number;
  objectId: string | undefined;
};

export type Attributes = {
  width: string;
  rx?: string;
  ry?: string;
  height: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  fill: string;
  stroke: string;
};

export type ActiveElement = {
  name: string;
  value: string;
  icon: string;
} | null;

export type NavbarProps = {
  activeElement: ActiveElement;
  imageInputRef: React.MutableRefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleActiveElement: (element: ActiveElement) => void;
  documentId: string;
  documentTitle: string;
  ownerId: string;
  ownerEmail: string;
  collaboratorEmails: string[];
};


export interface CustomFabricObject extends FabricObject {
  objectId?: string;
}

export type ModifyShape = {
  canvas: Canvas;
  property: string;
  value: string;
  activeObjectRef: React.MutableRefObject<FabricObject | null>;
  syncShapeInStorage: (shape: FabricObject) => void;
};

export type ElementDirection = {
  canvas: Canvas;
  direction: string;
  syncShapeInStorage: (shape: FabricObject) => void;
};

export type ImageUpload = {
  file: File;
  canvas: React.MutableRefObject<Canvas>;
  shapeRef: React.MutableRefObject<FabricObject | null>;
  syncShapeInStorage: (shape: FabricObject) => void;
};

export type RightSidebarProps = {
  elementAttributes: Attributes;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
  fabricRef: React.RefObject<Canvas | null>;
  activeObjectRef: React.RefObject<FabricObject | null>;
  isEditingRef: React.MutableRefObject<boolean>;
  syncShapeInStorage: (obj: FabricObject) => void;
};



export type ShapesMenuProps = {
  item: {
    name: string;
    icon: string;
    value: Array<ActiveElement>;
  };
  activeElement: ActiveElement;
  handleActiveElement: (element: ActiveElement) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageInputRef: React.MutableRefObject<HTMLInputElement | null>;
};

export type Presence = {
  cursor: { x: number; y: number } | null;
  cursorColor?: string | null;
  editingText?: string | null;
  message?: string | null;
};

export type LiveCursorProps = {
  others: readonly User<Presence, BaseUserMeta>[];
};

export type CanvasPointerEvent = TEvent<MouseEvent> & {
  target?: FabricObject;
  selected?: FabricObject[];
  path?: Path;
};

export type CanvasMouseDown = {
  options: CanvasPointerEvent;
  canvas: Canvas;
  selectedShapeRef: React.MutableRefObject<string | null>;
  isDrawing: React.MutableRefObject<boolean>;
  shapeRef: React.MutableRefObject<FabricObject | null>;
};

export type CanvasMouseMove = {
  options: CanvasPointerEvent;
  canvas: Canvas;
  isDrawing: React.MutableRefObject<boolean>;
  selectedShapeRef: React.MutableRefObject<string | null>;
  shapeRef: React.MutableRefObject<FabricObject | null>;
  syncShapeInStorage: (shape: FabricObject) => void;
};

export type CanvasMouseUp = {
  canvas: Canvas;
  isDrawing: React.MutableRefObject<boolean>;
  shapeRef: React.MutableRefObject<FabricObject | null>;
  activeObjectRef: React.MutableRefObject<FabricObject | null>;
  selectedShapeRef: React.MutableRefObject<string | null>;
  syncShapeInStorage: (shape: FabricObject) => void;
  setActiveElement: React.Dispatch<React.SetStateAction<ActiveElement>>;
};

export type CanvasObjectModified = {
  options: CanvasPointerEvent;
  syncShapeInStorage: (shape: FabricObject) => void;
};

export type CanvasPathCreated = {
  options: CanvasPointerEvent;
  syncShapeInStorage: (shape: FabricObject) => void;
};

export type CanvasSelectionCreated = {
  options: CanvasPointerEvent;
  isEditingRef: React.MutableRefObject<boolean>;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
};

export type CanvasObjectScaling = {
  options: CanvasPointerEvent;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
};

export type RenderCanvas = {
  fabricRef: React.MutableRefObject<Canvas | null>;
  canvasObjects: { values(): IterableIterator<unknown> };
  activeObjectRef: React.MutableRefObject<FabricObject | null>;
  canvas?: Canvas,
};

export type CursorChatProps = {
  cursor: { x: number; y: number };
  cursorState: CursorState;
  setCursorState: (cursorState: CursorState) => void;
  updateMyPresence: (
    presence: Partial<{
      cursor: { x: number; y: number };
      cursorColor: string;
      message: string;
    }>
  ) => void;
};
