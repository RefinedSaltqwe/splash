import MediaComponent from "@/app/(dashboard)/subaccount/[subaccountId]/media/_components/Media";
import { cn } from "@/lib/utils";

type MediaBucketTabProps = {
  subaccountId: string;
  className?: string;
  overflowEnabled?: boolean;
};

const MediaBucketTab = ({
  subaccountId,
  className,
  overflowEnabled = true,
}: MediaBucketTabProps) => {
  return (
    <div className={cn(" p-4", overflowEnabled && "h-[900px] overflow-auto")}>
      <MediaComponent subaccountId={subaccountId} className={className} />
    </div>
  );
};

export default MediaBucketTab;
