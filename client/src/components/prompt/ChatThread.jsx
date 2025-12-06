import React, { useEffect, useRef } from "react";
import Message from "./Message";

export default function ChatThread({ messages = [] }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);

  return (
    <div ref={ref} className="max-h-56 overflow-scroll p-3">
      {messages.length === 0 ? (
        <ConversationEmpty />
      ) : (
        messages.map((m, idx) => (
          <Message key={idx} role={m.role} content={m.content} />
        ))
      )}
    </div>
  );
}

const ConversationEmpty = () => {
  return (
    <div className="text-center text-sm text-gray-600 italic h-10 flex items-center justify-center">
      How can I help you captain!
    </div>
  );
};
