import React from "react";
import TextComponent from "./Text";
import Container from "./Container";
import VideoComponent from "./Video";
import LinkComponent from "./LinkComponent";
import Checkout from "./Checkout";
import { type EditorElement } from "@/components/providers/editor/EditorProvider";
import ContactFormComponent from "./ContactFormComponent";
import TwoColumns from "./TwoColumns";

type Props = {
  element: EditorElement;
};

const Recursive = ({ element }: Props) => {
  switch (element.type) {
    case "text":
      return <TextComponent element={element} />;
    case "container":
      return <Container element={element} />;
    case "video":
      return <VideoComponent element={element} />;
    case "contactForm":
      return <ContactFormComponent element={element} />;
    case "paymentForm":
      return <Checkout element={element} />;
    case "2Col":
      return <TwoColumns element={element} />;
    case "__body":
      return <Container element={element} />;

    case "link":
      return <LinkComponent element={element} />;
    default:
      return null;
  }
};

export default Recursive;
