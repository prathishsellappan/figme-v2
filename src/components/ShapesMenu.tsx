import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ShapesMenuProps } from "../types/IEditorProps";
import { Button } from "./common/ui/button";

export default function ShapesMenu({ item, activeElement, handleActiveElement, handleImageUpload, imageInputRef }: ShapesMenuProps) {
  const currentValue = activeElement?.value;
  const currentIcon = activeElement?.icon;
  const isDropdownElem = item.value.some((elem) => elem?.value === currentValue);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center w-[40px]">
            <Button variant="noneUse" size="icon"
              onClick={() => handleActiveElement(item.value[0])}>
              <img
                src={isDropdownElem && currentIcon ? currentIcon : item.icon}
                alt={item.name}
                className={isDropdownElem ? "invert" : ""}
                width={17}
              />
            </Button>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="mt-5 flex flex-col 
      gap-y-1 border-none bg-borderColor py-4 text-white">

          {item.value.map((elem) => (
            <Button
              variant={"noneUse"}
              key={elem?.name}
              onClick={() => handleActiveElement(elem)}
              className={`flex h-fit  justify-between gap-10 
              rounded-none px-5 py-3 focus:border-none
               ${currentValue === elem?.value ?
                  "bg-green-500" : "hover:bg-gray-500"
                }`}
            >
              <div className="group flex items-center gap-2">
                <img
                  src={elem?.icon as string}
                  alt={elem?.name as string}
                  width={20}
                  height={20}
                  className={currentValue === elem?.value ? "invert" : ""}
                />
                <p
                  className={`text-sm 
                  ${currentValue === elem?.value ?
                      "text-black" : "text-white"}`}
                >
                  {elem?.name}
                </p>
              </div>
            </Button>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <input
        type="file"
        className="hidden"
        ref={imageInputRef}
        accept="image/*"
        onChange={handleImageUpload}
      />
    </>
  );
}
