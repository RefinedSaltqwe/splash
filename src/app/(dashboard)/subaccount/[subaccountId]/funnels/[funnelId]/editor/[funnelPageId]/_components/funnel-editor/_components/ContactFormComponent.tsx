"use client";

import {
  useEditor,
  type EditorElement,
} from "@/components/providers/editor/EditorProvider";
import { Badge } from "@/components/ui/badge";
import { type EditorBtns } from "@/constants/defaultsValues";
import { getFunnel } from "@/server/actions/fetch";
import clsx from "clsx";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "@/hooks/useAction";
import { upsertContact } from "@/server/actions/upsert-contact";
import { type UpsertContact } from "@/server/actions/upsert-contact/schema";
import React from "react";
import { type z } from "zod";
import ContactForm from "./forms/ContactForm";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  element: EditorElement;
};

const ContactFormComponent = (props: Props) => {
  const { dispatch, state, subaccountId, funnelId, pageDetails } = useEditor();
  const router = useRouter();
  const { data: funnelPages } = useQuery({
    queryKey: ["funnel", funnelId],
    queryFn: () => getFunnel(funnelId),
  });

  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: props.element,
      },
    });
  };

  const styles = props.element.styles;

  const goToNextPage = () => {
    if (!state.editor.liveMode) return;
    if (!funnelPages || !pageDetails) return;
    if (funnelPages.FunnelPages.length > pageDetails.order + 1) {
      const nextPage = funnelPages.FunnelPages.find(
        (page) => page.order === pageDetails.order + 1,
      );
      if (!nextPage) return;
      router.replace(
        `${process.env.NEXT_PUBLIC_SCHEME}${funnelPages.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${nextPage.pathName}`,
      );
    }
  };

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: props.element },
    });
  };

  const { execute: executeUpsertContact, isLoading: upsertingContact } =
    useAction(upsertContact, {
      onSuccess: (data) => {
        if (data)
          toast.success("Success", {
            description: "Successfully saved a new contact",
          });
        goToNextPage();
      },
      onError: (error) => {
        toast.error(error);
      },
    });

  const onFormSubmit = (values: z.infer<typeof UpsertContact>) => {
    if (!state.editor.liveMode) return;
    void executeUpsertContact({
      ...values,
      subaccountId,
    });
  };

  return (
    <div
      style={styles}
      draggable
      onDragStart={(e) => handleDragStart(e, "contactForm")}
      onClick={handleOnClickBody}
      className={clsx(
        "relative m-[5px] flex w-full items-center justify-center p-[2px] text-[16px] transition-all",
        {
          "!border-blue-500":
            state.editor.selectedElement.id === props.element.id,

          "!border-solid": state.editor.selectedElement.id === props.element.id,
          "border-[1px] border-dashed border-slate-300": !state.editor.liveMode,
        },
      )}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -left-[1px] -top-[23px] rounded-none rounded-t-lg ">
            {state.editor.selectedElement.name}
          </Badge>
        )}
      <ContactForm
        subTitle="Contact Us"
        title="Want a free quote? We can help you"
        apiCall={onFormSubmit}
        isLoading={upsertingContact}
      />
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <div className="absolute -right-[1px] -top-[25px] rounded-none rounded-t-lg bg-primary  px-2.5 py-1 text-xs font-bold !text-white">
            <Trash
              className="cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  );
};

export default ContactFormComponent;
