interface MessageRightProps {
  message: string;
  timestamp: Date;
}

export const MessageRight = ({ message, timestamp }: MessageRightProps) => {
  const formattedTimestamp = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);

  return (
    <>
      <div className=" clear-fix">
        <div
          className="relative mr-5 mb-3 p-3 text-left rounded-lg bg-blue-600 ml-auto inline-block float-right"
          style={{
            minWidth: "20%",
            maxWidth: "60%",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
          }}
        >
          <p className="text-white">{message}</p>
          <div className="text-gray-400 text-xs float-right mr-2 -mt-1">
            {formattedTimestamp}
          </div>

          <div className="absolute -right-1 top-0 h-0 w-0 border-l-4 border-l-transparent border-t-4 border-t-blue-600 border-r-4 border-r-transparent"></div>
        </div>
      </div>
      <div className="clear-right"></div>
    </>
  );
};
