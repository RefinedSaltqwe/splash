"use client";
import { useEditor } from "@/components/providers/editor/EditorProvider";
import { Button } from "@/components/ui/button";
import { type FunnelPage } from "@prisma/client";
import clsx from "clsx";
import { EyeOff } from "lucide-react";
import { useEffect } from "react";
import Recursive from "./_components/Recursive";

type Props = {
  funnelPageId: string;
  liveMode?: boolean;
  funnelPageDetails: FunnelPage;
};

const FunnelEditor = ({ funnelPageId, liveMode, funnelPageDetails }: Props) => {
  const { dispatch, state } = useEditor();

  useEffect(() => {
    if (liveMode) {
      dispatch({
        type: "TOGGLE_LIVE_MODE",
        payload: { value: true },
      });
    }
  }, [liveMode]);

  //CHALLENGE: make this more performant
  useEffect(() => {
    if (!funnelPageDetails) return;

    dispatch({
      type: "LOAD_DATA",
      payload: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        elements: funnelPageDetails.content
          ? JSON.parse(funnelPageDetails?.content)
          : "",
        withLive: !!liveMode,
      },
    });
  }, [funnelPageId]);

  const handleClick = () => {
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {},
    });
  };

  const handleUnpreview = () => {
    dispatch({ type: "TOGGLE_PREVIEW_MODE" });
    dispatch({ type: "TOGGLE_LIVE_MODE" });
  };
  return (
    <div
      className={clsx(
        "use-automation-zoom-in splash-scroll splash-scroll-x mr-[385px] h-full bg-background transition-all",
        {
          "!mr-0 !p-0":
            state.editor.previewMode === true || state.editor.liveMode === true,
          "!w-[850px]": state.editor.device === "Tablet",
          "!w-[420px]": state.editor.device === "Mobile",
          "w-full": state.editor.device === "Desktop",
        },
      )}
      onClick={handleClick}
    >
      {state.editor.previewMode && state.editor.liveMode && (
        <Button
          variant={"ghost"}
          size={"icon"}
          className="fixed left-0 top-0 z-[100] h-6 w-6 bg-slate-600 p-[2px]"
          onClick={handleUnpreview}
        >
          <EyeOff />
        </Button>
      )}
      {Array.isArray(state.editor.elements) &&
        state.editor.elements.map((childElement) => (
          <Recursive key={childElement.id} element={childElement} />
        ))}
    </div>
  );
};

export default FunnelEditor;
