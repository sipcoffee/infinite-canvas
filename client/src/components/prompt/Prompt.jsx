import React, { useState } from "react";
import renderNode from "./render";
import schema from "./schema";

export default function Prompt() {
  const [state, setState] = useState({
    messages: [],
    prompt: "",
    popoverOpen: false,
  });

  const handlers = {
    onChange: (field, value) => setState((s) => ({ ...s, [field]: value })),

    onClickSend: async () => {
      const message = state.prompt.trim();
      if (!message) return;

      // add user message
      setState((s) => ({
        ...s,
        messages: [...s.messages, { role: "user", content: message }],
        prompt: "",
      }));

      // call backend
      try {
        const res = await fetch("http://localhost:8000/api/chat/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });
        const data = await res.json();
        setState((s) => ({
          ...s,
          messages: [...s.messages, { role: "assistant", content: data.reply }],
        }));
      } catch (err) {
        setState((s) => ({
          ...s,
          messages: [
            ...s.messages,
            { role: "assistant", content: "Error contacting server" },
          ],
        }));
      }
    },
    setPopover: (open) => setState((s) => ({ ...s, popoverOpen: open })),
  };

  return (
    <div className="z-20 absolute top-10 right-6  flex  gap-2 text-white">
      {/* RENDER THE COMPONENT VIA SCHEMA */}
      {renderNode(schema, state, handlers)}
    </div>
  );
}
