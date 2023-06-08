export type MessageProps = {
  message: string;
  timestamp: Date;
};

export const MessageLeft = ({ message, timestamp }: MessageProps) => {
  const formattedTimestamp = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
  return (
    <>
      <div
        className="relative ml-5 mb-3 p-3 text-left rounded-lg bg-gray-200 mr-auto inline-block float-left"
        style={{
          minWidth: "20%",
          maxWidth: "60%",
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
        }}
      >
        <p className="text-black">{message}</p>
        <div className="text-gray-400 text-xs float-right mr-2 -mt-1">
          {formattedTimestamp}
        </div>
        <div className="absolute -left-1 top-0 h-0 w-0 border-r-4 border-r-transparent border-t-4 border-t-gray-200 border-l-4 border-l-transparent"></div>
      </div>
      <div className="clear-left"></div>
    </>
  );
};
