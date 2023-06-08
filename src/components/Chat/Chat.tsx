import { MessageLeft } from "./MessageLeft";
import { MessageRight } from "./MessageRight";
import chatBg from "../../assets/chatBg.png";
import { TextField } from "@mui/material";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Response } from "../../types/receiveMesgType";

type ChatProps = {
  idInstance: string;
  apiTokenInstance: string;
  receiverPhone: string;
};

export const Chat = ({
  idInstance,
  apiTokenInstance,
  receiverPhone,
}: ChatProps) => {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<
    Array<{ sender: string; content: string; timestamp: Date }>
  >([]);

  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [message]);

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formattedReceiverPhone = receiverPhone.replace("+", "");

    const apiURL = `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
    const postData = {
      chatId: `${formattedReceiverPhone}@c.us`,
      message,
    };

    try {
      const response = await axios.post(apiURL, postData);
      setMessages([
        ...messages,
        { sender: "right", content: message, timestamp: new Date() },
      ]);

      setMessage("");
      console.log(response.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const receiveNotification = useCallback(async () => {
    const deleteNotification = async (receiptId: number) => {
      const deleteUrl = `https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;

      try {
        await axios.delete(deleteUrl);
        console.log("Notification deleted:", receiptId);
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    };

    const apiUrl = `https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`;

    try {
      const response = await axios.get<Response>(apiUrl);

      if (response.data && response.data.body) {
        const messageData = response.data.body.messageData;

        if (messageData) {
          const typeMessage = messageData.typeMessage;
          const textMessage = messageData.textMessageData?.textMessage;
          const receiptId = response.data.receiptId;

          if (typeMessage === "textMessage") {
            if (textMessage) {
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  sender: "left",
                  content: textMessage,
                  timestamp: new Date(response.data.body.timestamp * 1000),
                },
              ]);
            }
          }

          await deleteNotification(receiptId);
        }
      }
    } catch (error) {
      console.error("Error receiving message", error);
    }
  }, [idInstance, apiTokenInstance]);

  useEffect(() => {
    const receiveNotificationInterval = setInterval(() => {
      receiveNotification();
    }, 7000);

    return () => {
      clearInterval(receiveNotificationInterval);
    };
  }, [receiveNotification]);

  const chatBgStyle = {
    backgroundImage: `url(${chatBg})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };
  return (
    <>
      <section className="bg-green-600 min-h-screen flex items-center">
        <div
          className="w-3/5 mx-auto flex flex-col justify-between h-[750px] rounded-xl overflow-hidden pt-3"
          style={chatBgStyle}
        >
          <div className="flex flex-col-reverse overflow-y-auto">
            <div ref={chatRef}>
              {messages.map((msg, index) => {
                if (msg.sender === "right") {
                  return (
                    <MessageRight
                      key={index}
                      message={msg.content}
                      timestamp={msg.timestamp}
                    />
                  );
                } else {
                  return (
                    <MessageLeft
                      key={index}
                      message={msg.content}
                      timestamp={msg.timestamp}
                    />
                  );
                }
              })}
            </div>
          </div>

          <form
            noValidate
            autoComplete="off"
            className="bg-gray-100 p-3"
            onSubmit={sendMessage}
          >
            <TextField
              placeholder="Enter a message"
              fullWidth
              sx={{ backgroundColor: "white" }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </form>
        </div>
      </section>
    </>
  );
};
