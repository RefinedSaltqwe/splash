/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { useEditor } from "@/components/providers/editor/EditorProvider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  AlignCenter,
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEndIcon,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceAround,
  AlignHorizontalSpaceBetween,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  ChevronsLeftRightIcon,
  LucideImageDown,
} from "lucide-react";

type SettingsTabProps = object;

const SettingsTab = (props: SettingsTabProps) => {
  const { state, dispatch } = useEditor();

  const handleOnChanges = (e: any) => {
    const styleSettings = e.target.id;
    const value = e.target.value;
    const styleObject = {
      [styleSettings]: value,
    };

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          styles: {
            ...state.editor.selectedElement.styles,
            ...styleObject,
          },
        },
      },
    });
  };

  const handleChangeCustomValues = (e: any) => {
    const settingProperty = e.target.id;
    const value = e.target.value;
    const styleObject = {
      [settingProperty]: value,
    };

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          content: {
            ...state.editor.selectedElement.content,
            ...styleObject,
          },
        },
      },
    });
  };

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={["Typography", "Dimensions", "Decorations", "Flexbox"]}
    >
      <AccordionItem value="Custom" className="px-4 py-0">
        <AccordionTrigger className="!no-underline">Custom</AccordionTrigger>
        <AccordionContent className="px-1">
          {state.editor.selectedElement.type === "link" &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Link Path</p>
                <Input
                  id="href"
                  placeholder="https:domain.example.com/pathname"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.href ?? ""}
                  className={cn(
                    "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                    "splash-base-input splash-inputs",
                  )}
                />
              </div>
            )}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Typography" className="border-y-[1px] px-4 py-0">
        <AccordionTrigger className="!no-underline">
          Typography
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 px-1">
          <div className="flex flex-col gap-2 ">
            <p className="text-muted-foreground">Text Align</p>
            <Tabs
              onValueChange={(e) =>
                handleOnChanges({
                  target: {
                    id: "textAlign",
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.styles.textAlign}
            >
              <TabsList className="splash-border-color flex h-fit flex-row items-center justify-between gap-4 rounded-md border-[1px] bg-transparent">
                <TabsTrigger
                  value="left"
                  className="h-10 w-10 p-0 data-[state=active]:bg-muted"
                >
                  <AlignLeft size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="right"
                  className="h-10 w-10 p-0 data-[state=active]:bg-muted"
                >
                  <AlignRight size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="center"
                  className="h-10 w-10 p-0 data-[state=active]:bg-muted"
                >
                  <AlignCenter size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="justify"
                  className="h-10 w-10 p-0 data-[state=active]:bg-muted "
                >
                  <AlignJustify size={18} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Font Family</p>
            <Input
              id="DM Sans"
              onChange={handleOnChanges}
              value={state.editor.selectedElement.styles.fontFamily ?? ""}
              className={cn(
                "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                "splash-base-input splash-inputs",
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Color</p>
            <Input
              id="color"
              onChange={handleOnChanges}
              value={state.editor.selectedElement.styles.color ?? ""}
              className={cn(
                "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                "splash-base-input splash-inputs",
              )}
            />
          </div>
          <div className="flex gap-4">
            <div>
              <Label className="text-muted-foreground">Weight</Label>
              <Select
                onValueChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: "font-weight",
                      value: e,
                    },
                  })
                }
              >
                <SelectTrigger
                  className={cn(
                    "w-[180px] font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                    "splash-base-input splash-inputs",
                  )}
                >
                  <SelectValue placeholder="Select a weight" />
                </SelectTrigger>
                <SelectContent
                  className={cn(
                    "z-[555] border-[1px] !border-transparent border-slate-200 !bg-card font-normal !backdrop-blur placeholder:text-gray-400 dark:border-slate-700 dark:!bg-muted/75 dark:placeholder:text-gray-600",
                  )}
                >
                  <SelectGroup>
                    <SelectLabel>Font Weights</SelectLabel>
                    <SelectItem
                      value="bold"
                      className="hover:!bg-muted-foreground/5"
                    >
                      Bold
                    </SelectItem>
                    <SelectItem
                      value="normal"
                      className="hover:!bg-muted-foreground/5"
                    >
                      Regular
                    </SelectItem>
                    <SelectItem
                      value="lighter"
                      className="hover:!bg-muted-foreground/5"
                    >
                      Light
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-muted-foreground">Size</Label>
              <Input
                placeholder="px"
                id="fontSize"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.fontSize ?? ""}
                className={cn(
                  "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                  "splash-base-input splash-inputs",
                )}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Dimensions" className=" px-4 py-0 ">
        <AccordionTrigger className="!no-underline">
          Dimensions
        </AccordionTrigger>
        <AccordionContent className="px-1">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Height</Label>
                    <Input
                      id="height"
                      placeholder="px"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.height ?? ""}
                      className={cn(
                        "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                        "splash-base-input splash-inputs",
                      )}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Width</Label>
                    <Input
                      placeholder="px"
                      id="width"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.width ?? ""}
                      className={cn(
                        "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                        "splash-base-input splash-inputs",
                      )}
                    />
                  </div>
                </div>
              </div>
              <p className="font-bold">Margin px</p>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Top</Label>
                    <Input
                      id="marginTop"
                      placeholder="px"
                      onChange={handleOnChanges}
                      value={
                        state.editor.selectedElement.styles.marginTop ?? ""
                      }
                      className={cn(
                        "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                        "splash-base-input splash-inputs",
                      )}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Bottom</Label>
                    <Input
                      placeholder="px"
                      id="marginBottom"
                      onChange={handleOnChanges}
                      value={
                        state.editor.selectedElement.styles.marginBottom ?? ""
                      }
                      className={cn(
                        "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                        "splash-base-input splash-inputs",
                      )}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Left</Label>
                    <Input
                      placeholder="px"
                      id="marginLeft"
                      onChange={handleOnChanges}
                      value={
                        state.editor.selectedElement.styles.marginLeft ?? ""
                      }
                      className={cn(
                        "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                        "splash-base-input splash-inputs",
                      )}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Right</Label>
                    <Input
                      placeholder="px"
                      id="marginRight"
                      onChange={handleOnChanges}
                      value={
                        state.editor.selectedElement.styles.marginRight ?? ""
                      }
                      className={cn(
                        "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                        "splash-base-input splash-inputs",
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-bold">Padding px</p>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Top</Label>
                    <Input
                      placeholder="px"
                      id="paddingTop"
                      onChange={handleOnChanges}
                      value={
                        state.editor.selectedElement.styles.paddingTop ?? ""
                      }
                      className={cn(
                        "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                        "splash-base-input splash-inputs",
                      )}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Bottom</Label>
                    <Input
                      placeholder="px"
                      id="paddingBottom"
                      onChange={handleOnChanges}
                      value={
                        state.editor.selectedElement.styles.paddingBottom ?? ""
                      }
                      className={cn(
                        "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                        "splash-base-input splash-inputs",
                      )}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Left</Label>
                    <Input
                      placeholder="px"
                      id="paddingLeft"
                      onChange={handleOnChanges}
                      value={
                        state.editor.selectedElement.styles.paddingLeft ?? ""
                      }
                      className={cn(
                        "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                        "splash-base-input splash-inputs",
                      )}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Right</Label>
                    <Input
                      placeholder="px"
                      id="paddingRight"
                      onChange={handleOnChanges}
                      value={
                        state.editor.selectedElement.styles.paddingRight ?? ""
                      }
                      className={cn(
                        "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                        "splash-base-input splash-inputs",
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Decorations" className="px-4 py-0 ">
        <AccordionTrigger className="!no-underline">
          Decorations
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 px-1">
          <div>
            <Label className="text-muted-foreground">Opacity</Label>
            <div className="flex items-center justify-end">
              <small className="p-2">
                {typeof state.editor.selectedElement.styles?.opacity ===
                "number"
                  ? state.editor.selectedElement.styles?.opacity
                  : parseFloat(
                      (
                        state.editor.selectedElement.styles?.opacity ?? "0"
                      ).replace("%", ""),
                    ) || 0}
                %
              </small>
            </div>
            <Slider
              onValueChange={(e) => {
                handleOnChanges({
                  target: {
                    id: "opacity",
                    value: `${e[0]}%`,
                  },
                });
              }}
              defaultValue={[
                typeof state.editor.selectedElement.styles?.opacity === "number"
                  ? state.editor.selectedElement.styles?.opacity
                  : parseFloat(
                      (
                        state.editor.selectedElement.styles?.opacity ?? "0"
                      ).replace("%", ""),
                    ) || 0,
              ]}
              max={100}
              step={1}
            />
          </div>
          <div>
            <Label className="text-muted-foreground">Border Radius</Label>
            <div className="flex items-center justify-end">
              <small className="">
                {typeof state.editor.selectedElement.styles?.borderRadius ===
                "number"
                  ? state.editor.selectedElement.styles?.borderRadius
                  : parseFloat(
                      (
                        state.editor.selectedElement.styles?.borderRadius ?? "0"
                      ).replace("px", ""),
                    ) || 0}
                px
              </small>
            </div>
            <Slider
              onValueChange={(e) => {
                handleOnChanges({
                  target: {
                    id: "borderRadius",
                    value: `${e[0]}px`,
                  },
                });
              }}
              defaultValue={[
                typeof state.editor.selectedElement.styles?.borderRadius ===
                "number"
                  ? state.editor.selectedElement.styles?.borderRadius
                  : parseFloat(
                      (
                        state.editor.selectedElement.styles?.borderRadius ?? "0"
                      ).replace("%", ""),
                    ) || 0,
              ]}
              max={100}
              step={1}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Background Color</Label>
            <div className="splash-border-color  flex overflow-clip rounded-md border-[1px]">
              <div
                className="w-12 "
                style={{
                  backgroundColor:
                    state.editor.selectedElement.styles.backgroundColor,
                }}
              />
              <Input
                placeholder="#HFI245"
                id="backgroundColor"
                onChange={handleOnChanges}
                value={
                  state.editor.selectedElement.styles.backgroundColor ?? ""
                }
                className={cn(
                  "!border-r-0font-normal mr-2 rounded-none !border-y-0  placeholder:text-gray-400 dark:placeholder:text-gray-600",
                  "splash-base-input splash-inputs",
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Background Image</Label>
            <div className="splash-border-color  flex overflow-clip rounded-md border-[1px]">
              <div
                className="w-12 "
                style={{
                  backgroundImage:
                    state.editor.selectedElement.styles.backgroundImage,
                }}
              />
              <Input
                placeholder="url()"
                id="backgroundImage"
                onChange={handleOnChanges}
                value={
                  state.editor.selectedElement.styles.backgroundImage ?? ""
                }
                className={cn(
                  "!border-r-0font-normal mr-2 rounded-none !border-y-0  placeholder:text-gray-400 dark:placeholder:text-gray-600",
                  "splash-base-input splash-inputs",
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Image Position</Label>
            <Tabs
              onValueChange={(e) =>
                handleOnChanges({
                  target: {
                    id: "backgroundSize",
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.styles.backgroundSize?.toString()}
            >
              <TabsList className="splash-border-color flex h-fit flex-row items-center justify-between gap-4 rounded-md border-[1px] bg-transparent">
                <TabsTrigger
                  value="cover"
                  className="h-10 w-10 p-0 data-[state=active]:bg-muted"
                >
                  <ChevronsLeftRightIcon size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="contain"
                  className="h-10 w-10 p-0 data-[state=active]:bg-muted"
                >
                  <AlignVerticalJustifyCenter size={22} />
                </TabsTrigger>
                <TabsTrigger
                  value="auto"
                  className="h-10 w-10 p-0 data-[state=active]:bg-muted"
                >
                  <LucideImageDown size={18} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Flexbox" className="px-4 py-0  ">
        <AccordionTrigger className="!no-underline">Flexbox</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 px-1">
          <div className="flex w-full flex-col gap-2">
            <Label className="text-muted-foreground">Justify Content</Label>
            <Tabs
              onValueChange={(e) =>
                handleOnChanges({
                  target: {
                    id: "justifyContent",
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.styles.justifyContent}
            >
              <TabsList className="splash-border-color flex h-fit flex-row items-center justify-between gap-4 rounded-md border-[1px] bg-transparent">
                <TabsTrigger
                  value="space-between"
                  className="h-10 w-10 p-0 data-[state=active]:bg-muted"
                >
                  <AlignHorizontalSpaceBetween size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="space-evenly"
                  className="h-10 w-10 p-0 data-[state=active]:bg-muted"
                >
                  <AlignHorizontalSpaceAround size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="center"
                  className="h-10 w-10 p-0 data-[state=active]:bg-muted"
                >
                  <AlignHorizontalJustifyCenterIcon size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="start"
                  className="h-10 w-10 p-0 data-[state=active]:bg-muted "
                >
                  <AlignHorizontalJustifyStart size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="end"
                  className="h-10 w-10 p-0 data-[state=active]:bg-muted "
                >
                  <AlignHorizontalJustifyEndIcon size={18} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex w-full flex-col gap-2">
            <Label className="text-muted-foreground">Align Items</Label>
            <Tabs
              onValueChange={(e) =>
                handleOnChanges({
                  target: {
                    id: "alignItems",
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.styles.alignItems}
            >
              <TabsList className="splash-border-color flex h-fit flex-row items-center justify-between gap-4 rounded-md border-[1px] bg-transparent">
                <TabsTrigger
                  value="center"
                  className="h-10 w-10 p-0 data-[state=active]:bg-muted"
                >
                  <AlignVerticalJustifyCenter size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="normal"
                  className="h-10 w-10 p-0 data-[state=active]:bg-muted "
                >
                  <AlignVerticalJustifyStart size={18} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 items-center">
              <Input
                placeholder="px"
                type="checkbox"
                aria-describedby="flex-direction"
                id="display"
                onChange={(va) => {
                  handleOnChanges({
                    target: {
                      id: "display",
                      value: va.target.checked ? "flex" : "block",
                    },
                  });
                }}
                className={cn(
                  "splash-border-color h-5 w-5 rounded text-primary focus:ring-primary",
                  "splash-base-input splash-inputs",
                )}
              />
            </div>
            <div className="ml-3 text-sm leading-6">
              <label
                htmlFor="comments"
                className="font-medium text-muted-foreground"
              >
                Flex
              </label>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2">
            <Label className="text-muted-foreground"> Direction</Label>
            <Input
              placeholder="row, column, row-reverse, column-reverse"
              id="flexDirection"
              onChange={handleOnChanges}
              value={state.editor.selectedElement.styles.flexDirection ?? ""}
              className={cn(
                "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                "splash-base-input splash-inputs",
              )}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SettingsTab;
