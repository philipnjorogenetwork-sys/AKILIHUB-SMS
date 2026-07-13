import { describe, expect, it } from "vitest";
import { getVisibleConversationsForUser, getVisibleMessagesForUser } from "@/lib/messagePrivacy";

describe("messaging privacy", () => {
  it("only exposes conversations and messages that belong to the current user", () => {
    const conversations = [
      { id: "c1", participantIds: ["alice", "bob"] },
      { id: "c2", participantIds: ["charlie", "dana"] },
    ];

    const messages = [
      { id: "m1", conversationId: "c1", senderId: "alice" },
      { id: "m2", conversationId: "c2", senderId: "dana" },
    ];

    expect(getVisibleConversationsForUser(conversations, "alice")).toEqual([conversations[0]]);
    expect(getVisibleMessagesForUser(messages, conversations, "alice")).toEqual([messages[0]]);
  });
});
