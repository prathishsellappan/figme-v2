import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";
import {
  CustomFabricObject,
  ElementDirection,
  ImageUpload,
  ModifyShape,
} from "../types/IEditorProps";

export const createRectangle = (pointer: fabric.Point) => {
  const rect = new fabric.Rect({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "#fff",
    objectId: uuidv4(),
    rx: 0,
    ry: 0,
  } as unknown as fabric.Rect & CustomFabricObject);

  return rect;
};

export const createTriangle = (pointer: fabric.Point) => {
  return new fabric.Triangle({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "#fff",
    objectId: uuidv4(),
  } as unknown as fabric.Triangle & CustomFabricObject);
};

export const createCircle = (pointer: fabric.Point) => {
  return new fabric.Circle({
    left: pointer.x,
    top: pointer.y,
    radius: 50,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as unknown as fabric.Circle & CustomFabricObject);
};

export const createLine = (pointer: fabric.Point) => {
  return new fabric.Line(
    [pointer.x, pointer.y, pointer.x + 100, pointer.y + 100],
    {
      stroke: "#aabbcc",
      strokeWidth: 2,
      objectId: uuidv4(),
    } as unknown as Partial<fabric.TClassProperties<fabric.Line>> & {
      objectId: string;
    }
  );
};

export const createText = (pointer: fabric.Point, text: string) => {
  return new fabric.IText(text, {
    left: pointer.x,
    top: pointer.y,
    fill: "#aabbcc",
    fontFamily: "Helvetica",
    fontSize: 36,
    fontWeight: "400",
    objectId: uuidv4()
  });
};

export const createSpecificShape = (
  shapeType: string,
  pointer: fabric.Point
) => {
  switch (shapeType) {
    case "rectangle":
      return createRectangle(pointer);

    case "triangle":
      return createTriangle(pointer);

    case "circle":
      return createCircle(pointer);

    case "line":
      return createLine(pointer);

    case "text":
      return createText(pointer, "Tap to Type");

    default:
      return null;
  }
};


export const handleImageUpload = ({
  file,
  canvas,
  shapeRef,
  syncShapeInStorage,
}: ImageUpload) => {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async () => {
    const img = await fabric.Image.fromURL(reader.result as string);
    if (!img) return;

    img.scaleToWidth(200);
    img.scaleToHeight(200);

    canvas.current.add(img);

    img.set("objectId", uuidv4());

    shapeRef.current = img;

    syncShapeInStorage(img);
    canvas.current.requestRenderAll();
  };

  reader.readAsDataURL(file);
};

export const createShape = (
  canvas: fabric.Canvas,
  pointer: fabric.Point,
  shapeType: string
) => {
  if (shapeType === "freeform") {
    canvas.isDrawingMode = true;
    return null;
  }

  return createSpecificShape(shapeType, pointer);
};

export const modifyShape = ({
  canvas,
  property,
  value,
  activeObjectRef,
  syncShapeInStorage,
}: ModifyShape) => {
  const selectedElement = canvas.getActiveObject();

  if (!selectedElement || selectedElement?.type === "activeSelection") return;

  // if property is width or height, set the scale of the selected element
  if (property === "width") {
    selectedElement.set("scaleX", 1);
    selectedElement.set("width", value);  
  } else if (property === "height") {
    selectedElement.set("scaleY", 1);
    selectedElement.set("height", value);
  } else {
    // Handle rx and ry separately
    if (property === "rx") {
      selectedElement.set("rx", value);
      selectedElement.set("ry", value);
    } else if (property === "ry") {
      selectedElement.set("ry", value);
    } else {
      if (selectedElement[property as keyof object] === value) return;
      selectedElement.set(property as keyof object, value);
    }
  }

  // set selectedElement to activeObjectRef
  activeObjectRef.current = selectedElement;

  syncShapeInStorage(selectedElement);
};

export const bringElement = ({
  canvas,
  direction,
  syncShapeInStorage,
}: ElementDirection) => {
  if (!canvas) return;

  const selectedElement = canvas.getActiveObject();

  if (!selectedElement || selectedElement.type === "activeSelection") return;

  if (direction === "front") {
    canvas.bringObjectToFront(selectedElement);
  } else if (direction === "back") {
    canvas.sendObjectToBack(selectedElement);
  }

  syncShapeInStorage(selectedElement);
};
