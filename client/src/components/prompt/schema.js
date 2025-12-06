// uiSchema.js
export default {
  type: "page",
  children: [
    {
      type: "floatingPopover",
      id: "chatPopover",
      trigger: {
        type: "button",
        id: "openChat",
        icon: "Bot",
      },
      content: {
        type: "popoverContent",
        children: [
          { type: "chatThread", id: "thread" },
          {
            type: "row",
            children: [
              { type: "textInput", id: "prompt" },
              {
                type: "button",
                id: "send",
                label: "Send",
                icon: "SendHorizonal",
                iconPosition: "right",
              },
            ],
          },
        ],
      },
    },
  ],
};
