import React from "react";
import ChatThread from "./ChatThread";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as Icons from "lucide-react";

export default function renderNode(node, state, handlers, key) {
  if (!node) return null;

  switch (node.type) {
    case "page":
      return (
        <div className="relative" key={key}>
          {node.children?.map((c, i) =>
            renderNode(c, state, handlers, `${key || "page"}-${i}`)
          )}
        </div>
      );

    case "floatingPopover":
      return (
        <div key={key}>
          <Popover open={state.popoverOpen} onOpenChange={handlers.setPopover}>
            <PopoverTrigger asChild>
              {renderNode(node.trigger, state, handlers, `${key}-trigger`)}
            </PopoverTrigger>

            <PopoverContent className="w-96" align="end">
              {renderNode(node.content, state, handlers, `${key}-content`)}
            </PopoverContent>
          </Popover>
        </div>
      );

    case "popoverContent":
      return (
        <div className="flex flex-col gap-3" key={key}>
          {node.children?.map((c, i) =>
            renderNode(c, state, handlers, `${key}-${i}`)
          )}
        </div>
      );

    case "row":
      return (
        <div className="flex gap-2 items-center" key={key}>
          {node.children?.map((c, i) =>
            renderNode(c, state, handlers, `${key}-${i}`)
          )}
        </div>
      );

    case "chatThread":
      return <ChatThread key={key} messages={state.messages} />;

    case "textInput":
      return (
        <Input
          key={key}
          value={state.prompt}
          placeholder="Type a message..."
          onChange={(e) => handlers.onChange("prompt", e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
      );

    case "button": {
      const Icon = node.icon ? Icons[node.icon] : null;
      const hasLabel = !!node.label;
      const hasIcon = !!Icon;

      return (
        <Button
          key={key}
          onClick={handlers.onClickSend}
          className="rounded bg-blue-950 shadow-2xl text-white flex items-center gap-2"
        >
          {/* ICON LEFT */}
          {hasIcon && node.iconPosition !== "right" && <Icon size={18} />}

          {/* LABEL ONLY */}
          {hasLabel && <span>{node.label}</span>}

          {/* ICON RIGHT */}
          {hasIcon && node.iconPosition === "right" && <Icon size={18} />}
        </Button>
      );
    }

    default:
      return null;
  }
}
