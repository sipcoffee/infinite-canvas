import React from "react";

export default function Message({ role, content }) {
  const cls = role === "user" ? "msg user" : "msg assistant";
  return <div className={cls}>{content}</div>;
}
