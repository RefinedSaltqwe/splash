import { type EditorElement } from "@/components/providers/EditorProvider";
import Checkout from "./Checkout";
import ContactFormComponent from "./ContactFormComponent";
import Container from "./Container";
import LinkComponent from "./LinkComponent";
import TextComponent from "./Text";
import VideoComponent from "./Video";
import Hero1Section from "./Hero1Section";

type Props = {
  element: EditorElement;
  index: number;
  level: number;
};

const Recursive = ({ element, index, level }: Props) => {
  switch (element.type) {
    case "hero1":
      return <Hero1Section element={element} index={index} level={level} />;
    case "text":
      return <TextComponent element={element} index={index} level={level} />;
    case "container":
      return <Container element={element} index={index} level={level} />;
    case "video":
      return <VideoComponent element={element} index={index} level={level} />;
    case "contactForm":
      return (
        <ContactFormComponent element={element} index={index} level={level} />
      );
    case "paymentForm":
      return <Checkout element={element} index={index} level={level} />;
    case "2Col":
      return <Container element={element} index={index} level={level} />;
    case "__body":
      return <Container element={element} index={index} level={level} />;
    case "link":
      return <LinkComponent element={element} index={index} level={level} />;
    default:
      return null;
  }
};

export default Recursive;
