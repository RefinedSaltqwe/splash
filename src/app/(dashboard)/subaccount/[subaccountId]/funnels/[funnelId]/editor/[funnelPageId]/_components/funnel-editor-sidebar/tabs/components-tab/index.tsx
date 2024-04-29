import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import TextPlaceholder from "./TextPlaceholder";
import ContainerPlaceholder from "./ContainerPlaceholder";
import VideoPlaceholder from "./VideoPlaceholder";
import TwoColumnsPlaceholder from "./TwoColumnsPlaceholder";
import LinkPlaceholder from "./LinkPlaceholder";
import ContactFormComponentPlaceholder from "./ContactPlaceholder";
import CheckoutPlaceholder from "./CheckoutPlaceholder";
import { type EditorBtns } from "@/constants/defaultsValues";
import Hero1Placeholder from "./Hero1Placeholder";

type ComponentsTabProps = object;

const ComponentsTab = (props: ComponentsTabProps) => {
  const elements: {
    Component: React.ReactNode;
    label: string;
    id: EditorBtns;
    group: "layout" | "elements" | "sections";
  }[] = [
    {
      Component: <Hero1Placeholder />,
      label: "Hero 1",
      id: "hero1",
      group: "sections",
    },
    {
      Component: <TextPlaceholder />,
      label: "Text",
      id: "text",
      group: "elements",
    },
    {
      Component: <ContainerPlaceholder />,
      label: "Container",
      id: "container",
      group: "layout",
    },
    {
      Component: <TwoColumnsPlaceholder />,
      label: "2 Columns",
      id: "2Col",
      group: "layout",
    },
    {
      Component: <VideoPlaceholder />,
      label: "Video",
      id: "video",
      group: "elements",
    },
    {
      Component: <ContactFormComponentPlaceholder />,
      label: "Contact",
      id: "contactForm",
      group: "elements",
    },
    {
      Component: <CheckoutPlaceholder />,
      label: "Checkout",
      id: "paymentForm",
      group: "elements",
    },
    {
      Component: <LinkPlaceholder />,
      label: "Link",
      id: "link",
      group: "elements",
    },
  ];

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={["Layout", "Elements", "Sections"]}
    >
      <AccordionItem value="Layout" className="border-y-[1px] px-6 py-0">
        <AccordionTrigger className="!no-underline">Layout</AccordionTrigger>
        <AccordionContent className="flex flex-wrap gap-2 ">
          {elements
            .filter((element) => element.group === "layout")
            .map((element) => (
              <div
                key={element.id}
                className="flex flex-col items-center justify-center"
              >
                {element.Component}
                <span className="text-muted-foreground">{element.label}</span>
              </div>
            ))}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Elements" className="px-6 py-0 ">
        <AccordionTrigger className="!no-underline">Elements</AccordionTrigger>
        <AccordionContent className="flex flex-wrap gap-2 ">
          {elements
            .filter((element) => element.group === "elements")
            .map((element) => (
              <div
                key={element.id}
                className="flex flex-col items-center justify-center"
              >
                {element.Component}
                <span className="text-muted-foreground">{element.label}</span>
              </div>
            ))}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Sections" className="px-6 py-0 ">
        <AccordionTrigger className="!no-underline">Sections</AccordionTrigger>
        <AccordionContent className="flex flex-wrap gap-2 ">
          {elements
            .filter((element) => element.group === "sections")
            .map((element) => (
              <div
                key={element.id}
                className="flex flex-col items-center justify-center"
              >
                {element.Component}
                <span className="text-muted-foreground">{element.label}</span>
              </div>
            ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ComponentsTab;
