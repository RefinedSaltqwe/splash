/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import {
  useEditor,
  type EditorElement,
} from "@/components/providers/EditorProvider";
import Loading from "@/components/shared/Loading";
import { Badge } from "@/components/ui/badge";
import { type EditorBtns } from "@/constants/defaultsValues";
import { env } from "@/env";
import { getStripe } from "@/lib/stripe/stripe-client";
import { getFunnel } from "@/server/actions/fetch";
import { getSubaccountDetails } from "@/server/queries";
import { useDivSpacer } from "@/stores/funnelDivSpacer";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Props = {
  element: EditorElement;
  index: number;
  level: number;
};

const Checkout = (props: Props) => {
  const { dispatch, state, subaccountId, funnelId, pageDetails } = useEditor();
  const router = useRouter();
  const onOpen = useDivSpacer((state) => state.onOpen);
  const onClose = useDivSpacer((state) => state.onClose);
  const [clientSecret, setClientSecret] = useState("");
  const [livePrices, setLivePrices] = useState([]);
  const [subAccountConnectAccId, setSubAccountConnectAccId] = useState("");
  const options = useMemo(() => ({ clientSecret }), [clientSecret]);
  const styles = props.element.styles;

  const { data: subaccountDetails } = useQuery({
    queryKey: ["subaccount", subaccountId],
    queryFn: () => getSubaccountDetails(subaccountId),
    enabled: !!subaccountId,
  });
  const { data: funnelData } = useQuery({
    queryKey: ["funnel", funnelId],
    queryFn: () => getFunnel(funnelId),
    enabled: !!subaccountId,
  });

  useEffect(() => {
    if (!subaccountId) return;
    if (subaccountDetails) {
      if (!subaccountDetails.connectAccountId) return;
      setSubAccountConnectAccId(subaccountDetails.connectAccountId);
    }
  }, [subaccountDetails?.connectAccountId, subaccountId]);

  useEffect(() => {
    if (funnelData?.liveProducts) {
      setLivePrices(JSON.parse(funnelData?.liveProducts ?? "[]"));
    }
  }, [funnelData?.liveProducts, funnelId]);

  useEffect(() => {
    if (livePrices.length && subaccountId && subAccountConnectAccId) {
      const getClientSercet = async () => {
        try {
          const body = JSON.stringify({
            subAccountConnectAccId,
            prices: livePrices,
            subaccountId,
          });
          const response = await fetch(
            `${env.NEXT_PUBLIC_URL}api/stripe/create-checkout-session`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body,
            },
          );
          const responseJson = await response.json();
          if (!responseJson) throw new Error("somethign went wrong");
          if (responseJson.error) {
            throw new Error(responseJson.error);
          }
          if (responseJson.clientSecret) {
            setClientSecret(responseJson.clientSecret);
          }
        } catch (error) {
          if (error instanceof Error)
            toast.error("Opps!", { description: error.message });
        }
      };
      void getClientSercet();
    }
  }, [livePrices, subaccountId, subAccountConnectAccId]);

  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

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

  // const goToNextPage = () => {
  //   if (!state.editor.liveMode) return;
  //   const funnelPages = funnelData;
  //   if (!funnelPages || !pageDetails) return;
  //   if (funnelPages.FunnelPages.length > pageDetails.order + 1) {
  //     console.log(funnelPages.FunnelPages.length, pageDetails.order + 1);
  //     const nextPage = funnelPages.FunnelPages.find(
  //       (page) => page.order === pageDetails.order + 1,
  //     );
  //     if (!nextPage) return;
  //     router.replace(
  //       `${process.env.NEXT_PUBLIC_SCHEME}${funnelPages.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${nextPage.pathName}`,
  //     );
  //   }
  // };

  const handleDeleteElement = () => {
    onClose();
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: props.element },
    });
  };

  return (
    <div
      style={styles}
      draggable
      onDragStart={(e) => handleDragStart(e, "contactForm")}
      onClick={handleOnClickBody}
      className={clsx(
        "relative m-0 flex w-full items-center justify-center p-[2px] text-[16px] transition-all",
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

      <div className="w-full border-none transition-all">
        <div className="flex w-full flex-col gap-4">
          {options.clientSecret && subAccountConnectAccId && (
            <div className="text-white">
              <EmbeddedCheckoutProvider
                stripe={getStripe(subAccountConnectAccId)}
                options={options}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          )}

          {!options.clientSecret && (
            <div className="flex h-40 w-full items-center justify-center">
              <Loading />
            </div>
          )}
        </div>
      </div>

      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <div
            className="absolute -right-[1px] -top-[25px] cursor-pointer rounded-none rounded-t-lg  bg-primary px-2.5 py-1 text-xs font-bold !text-white"
            onClick={handleDeleteElement}
          >
            <Trash size={16} />
          </div>
        )}
    </div>
  );
};

export default Checkout;
