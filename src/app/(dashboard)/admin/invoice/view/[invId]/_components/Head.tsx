import { formatDateTime } from "@/lib/utils";
import React from "react";

type HeadProps = {
  title: string;
  name: string;
  completeAddress: string;
  phoneNumber: string;
  dateTitle: "Due" | "Created";
  date: Date;
};

const Head: React.FC<HeadProps> = ({
  title,
  name,
  completeAddress,
  phoneNumber,
  dateTitle,
  date,
}) => {
  return (
    <div className="flex flex-1 flex-col items-start space-y-8 px-3 py-4">
      <div className="flex w-full flex-col items-start space-y-3">
        <span className="text-sm font-semibold">{title}</span>
        <div className="flex flex-col items-start">
          <span className="text-sm font-normal">{name}</span>
          <span className="text-sm font-normal">{completeAddress}</span>
          <span className="text-sm font-normal">Phone: {phoneNumber}</span>
        </div>
      </div>
      <div className="flex w-full flex-col items-start space-y-2">
        <span className="text-sm font-semibold">Date {dateTitle}</span>
        <span className="text-sm font-normal">
          {formatDateTime(date).dateOnly}
        </span>
      </div>
    </div>
  );
};
export default Head;
