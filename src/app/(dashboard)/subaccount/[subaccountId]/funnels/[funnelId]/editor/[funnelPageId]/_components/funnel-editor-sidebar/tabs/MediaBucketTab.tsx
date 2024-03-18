import MediaComponent from "@/app/(dashboard)/subaccount/[subaccountId]/media/_components/Media";

type MediaBucketTabProps = {
  subaccountId: string;
  className?: string;
};

const MediaBucketTab = (props: MediaBucketTabProps) => {
  return (
    <div className="h-[900px] overflow-scroll p-4">
      <MediaComponent
        subaccountId={props.subaccountId}
        className={props.className}
      />
    </div>
  );
};

export default MediaBucketTab;
