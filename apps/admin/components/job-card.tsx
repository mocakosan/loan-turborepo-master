import { cn } from "@/lib/utils";

type Props = {
  title1: string;
  title2: string;
  lenderName: string;
  content: string;
  phoneNumber: string;
  backgroundImage: string;
  onClick?: () => void;
};

export default function JobCard({
  title1,
  title2,
  lenderName,
  content,
  phoneNumber,
  backgroundImage,
  onClick,
}: Props) {
  return (
    <div
      className={cn("py-1 max-w-[200px]", onClick && "cursor-pointer")}
      onClick={onClick}
    >
      <div className="relative block overflow-hidden rounded-[15px] bg-[#FFF8ED]">
        <div
          className={cn(
            "table w-full h-[84px] text-center",
            `bg-no-repeat bg-center bg-cover`
          )}
          style={{
            backgroundImage: `url("/admin/images/${backgroundImage}")`,
          }}
        >
          <b className="table-cell text-[#FFF] text-[15px] font-bold leading-[22px] align-middle">
            <span className="text-[#FFA015]">{title1}</span>
            <br />
            {title2}
          </b>
        </div>
        <div className="p-[15px_20px_20px]">
          <span className="block text-[13px] text-[#FFA015] font-normal">
            {lenderName}
          </span>
          <p
            className="text-[#7D7D7D] text-[13px] font-normal leading-[17px] mt-2.5"
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
          <hr className="block w-full h-[1px] border-0 m-[10px_0px] bg-[#CACACA]" />
          <span className="inline-block align-top text-[14px] text-[#FFA015] leading-[17px] font-normal pl-[23px] bg-[url('/admin/images/ico_tel.png')] bg-no-repeat bg-[0_0] bg-auto">
            {phoneNumber}
          </span>
        </div>
      </div>
    </div>
  );
}
