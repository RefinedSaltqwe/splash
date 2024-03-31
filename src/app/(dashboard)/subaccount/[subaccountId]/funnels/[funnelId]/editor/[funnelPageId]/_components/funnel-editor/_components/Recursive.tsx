import { type EditorElement } from "@/components/providers/editor/EditorProvider";
import Checkout from "./Checkout";
import ContactFormComponent from "./ContactFormComponent";
import Container from "./Container";
import LinkComponent from "./LinkComponent";
import TextComponent from "./Text";
import VideoComponent from "./Video";

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
      return <Container element={element} />;
    case "__body":
      return <Container element={element} />;

    case "link":
      return <LinkComponent element={element} />;
    default:
      return null;
  }
};

export default Recursive;
