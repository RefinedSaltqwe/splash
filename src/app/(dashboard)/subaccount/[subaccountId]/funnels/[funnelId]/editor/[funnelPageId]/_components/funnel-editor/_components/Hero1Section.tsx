"use client";
import {
  useEditor,
  type EditorElement,
} from "@/components/providers/EditorProvider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDivSpacer } from "@/stores/funnelDivSpacer";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { Dialog } from "@headlessui/react";
import { Menu, Trash, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

type Hero1SectionProps = {
  element: EditorElement;
  index: number;
  level: number;
};
const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Marketplace", href: "#" },
  { name: "Company", href: "#" },
];

const Hero1Section: React.FC<Hero1SectionProps> = (props) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const onOpen = useDivSpacer((state) => state.onOpen);
  const onClose = useDivSpacer((state) => state.onClose);
  const subaccount = useCurrentUserStore((state) => state.subaccountData);

  const { dispatch, state } = useEditor();
  const handleDeleteElement = () => {
    onClose();
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: props.element },
    });
  };
  const styles = props.element.styles;

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (props.index === 0 && props.level === 2) {
      onOpen();
    } else {
      onClose();
    }
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: props.element,
      },
    });
  };
  return (
    <>
      {!Array.isArray(props.element.content) && (
        <section
          onClick={handleOnClickBody}
          className={cn(
            "relative flex w-full items-center justify-center bg-gray-900 text-[16px] transition-all",
            {
              "!border-blue-500":
                state.editor.selectedElement.id === props.element.id,
              "!border-solid":
                state.editor.selectedElement.id === props.element.id,
              "border-[1px] border-dashed border-slate-300":
                !state.editor.liveMode,
            },
          )}
          style={styles}
        >
          {state.editor.selectedElement.id === props.element.id &&
            !state.editor.liveMode && (
              <Badge className="absolute -left-[1px] -top-[23px] rounded-none rounded-t-lg ">
                {state.editor.selectedElement.name}
              </Badge>
            )}
          <header className="absolute inset-x-0 top-0 z-50">
            <nav
              className="flex items-center justify-between p-6 lg:px-8"
              aria-label="Global"
            >
              <div className="flex lg:flex-1">
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">{subaccount?.name}</span>
                  <Image
                    src={subaccount?.subAccountLogo ?? ""}
                    alt="Hero Logo"
                    sizes="(max-width: 50px) 100vw, (max-width: 75px) 50vw, 33vw"
                    fill
                    className="!left-5 !w-auto rounded-md object-contain"
                  />
                </a>
              </div>
              <div className="flex lg:hidden">
                <button
                  type="button"
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open main menu</span>
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="hidden lg:flex lg:gap-x-12">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-sm font-semibold leading-6 text-white"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                {/* heere */}
              </div>
            </nav>
            <Dialog
              as="div"
              className="lg:hidden"
              open={mobileMenuOpen}
              onClose={setMobileMenuOpen}
            >
              <div className="fixed inset-0 z-50" />
              <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
                <div className="flex items-center justify-between">
                  <a href="#" className="-m-1.5 p-1.5">
                    <span className="sr-only">{subaccount?.name}</span>
                    <Image
                      src={subaccount?.subAccountLogo ?? ""}
                      alt="Hero Logo"
                      sizes="(max-width: 50px) 100vw, (max-width: 75px) 50vw, 33vw"
                      fill
                      className="w-auto rounded-md object-contain"
                    />
                  </a>
                  <button
                    type="button"
                    className="-m-2.5 rounded-md p-2.5 text-gray-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-gray-500/25">
                    <div className="space-y-2 py-6">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Dialog>
          </header>

          <div className="relative isolate w-full overflow-hidden pt-14">
            <Image
              src={
                props.element.content.hero1?.backgroundHref ??
                "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
              }
              alt="Hero Image"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={cn(
                "absolute inset-0 -z-10 h-full w-full object-cover",
                props.element.content.hero1?.opacity,
              )}
            />

            <div
              className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3c82f6] to-[#6da8f4] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
            <div
              className={cn(
                "mx-auto flex h-[690px] w-full flex-col p-8",
                props.element.content.hero1?.position === "center" &&
                  "items-center justify-center",
                props.element.content.hero1?.position === "top-center" &&
                  "items-center justify-start",
                props.element.content.hero1?.position === "bottom-center" &&
                  "items-center justify-end",
                props.element.content.hero1?.position === "center-left" &&
                  "items-start justify-center",
                props.element.content.hero1?.position === "top-left" &&
                  "items-start justify-start",
                props.element.content.hero1?.position === "bottom-left" &&
                  "items-start justify-end",
                props.element.content.hero1?.position === "center-right" &&
                  "items-end justify-center",
                props.element.content.hero1?.position === "top-right" &&
                  "items-end justify-start",
                props.element.content.hero1?.position === "bottom-right" &&
                  "items-end justify-end",
              )}
            >
              <div
                className={cn(
                  "text-center",
                  props.element.content.hero1?.position.includes("left") &&
                    "text-start",
                  props.element.content.hero1?.position.includes("right") &&
                    "text-end",
                )}
              >
                <h1
                  className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
                  suppressContentEditableWarning={true}
                  contentEditable={!state.editor.liveMode}
                  onBlur={(e) => {
                    const headingElement = e.target as HTMLHeadingElement;
                    if (!Array.isArray(props.element.content))
                      dispatch({
                        type: "UPDATE_ELEMENT",
                        payload: {
                          elementDetails: {
                            ...props.element,
                            content: {
                              ...props.element.content,
                              hero1: {
                                ...props.element.content.hero1!,
                                title: headingElement.innerText,
                              },
                            },
                          },
                        },
                      });
                  }}
                >
                  {props.element.content.hero1?.title}
                </h1>
                <p
                  className="mt-6 text-lg leading-8 text-gray-300"
                  suppressContentEditableWarning={true}
                  contentEditable={!state.editor.liveMode}
                  onBlur={(e) => {
                    const paragraphElement = e.target as HTMLParagraphElement;
                    if (!Array.isArray(props.element.content))
                      dispatch({
                        type: "UPDATE_ELEMENT",
                        payload: {
                          elementDetails: {
                            ...props.element,
                            content: {
                              ...props.element.content,
                              hero1: {
                                ...props.element.content.hero1!,
                                description: paragraphElement.innerText,
                              },
                            },
                          },
                        },
                      });
                  }}
                >
                  {props.element.content.hero1?.description}
                </p>
                <div
                  className={cn(
                    "mt-10 flex items-center justify-center gap-x-6",
                    props.element.content.hero1?.position.includes("left") &&
                      "justify-start",
                    props.element.content.hero1?.position.includes("right") &&
                      "justify-end",
                  )}
                >
                  {!state.editor.liveMode ? (
                    <>
                      {props.element.content.hero1?.primaryButton.visible && (
                        <span className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/80">
                          {props.element.content.hero1?.primaryButton.name}
                        </span>
                      )}

                      <span className="text-sm font-semibold leading-6 text-white">
                        Learn more <span aria-hidden="true">→</span>
                      </span>
                    </>
                  ) : (
                    <>
                      {props.element.content.hero1?.primaryButton.visible && (
                        <a
                          href={props.element.content.hero1?.primaryButton.href}
                          className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/80"
                          style={
                            props.element.content.hero1?.primaryButton.styles
                          }
                        >
                          {props.element.content.hero1?.primaryButton.name}
                        </a>
                      )}
                      <a
                        href={props.element.content.hero1?.primaryButton.href}
                        className="text-sm font-semibold leading-6 text-white"
                      >
                        Learn more <span aria-hidden="true">→</span>
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div
              className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#3c82f6] to-[#6da8f4] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
          </div>
          {state.editor.selectedElement.id === props.element.id &&
            !state.editor.liveMode && (
              <div
                className="absolute -right-[1px] -top-[25px] cursor-pointer rounded-none rounded-t-lg bg-primary px-2.5 py-1 text-xs font-bold !text-white"
                onClick={handleDeleteElement}
              >
                <Trash size={16} />
              </div>
            )}
        </section>
      )}
    </>
  );
};
export default Hero1Section;
