import { useState } from "react";
import { FiSearch } from "react-icons/fi";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const AVATAR_COLORS = [
  "bg-primary text-primary-foreground",
  "bg-info text-info-foreground",
  "bg-success text-success-foreground",
  "bg-warning text-warning-foreground",
  "bg-chart-5 text-primary-foreground",
];

function avatarColor(id) {
  const idx = String(id).split("").reduce((sum, c) => sum + c.charCodeAt(0), 0);
  return AVATAR_COLORS[idx % AVATAR_COLORS.length];
}

function ContactList({ contacts, selectedContact, setSelectedContact }) {
  const [search, setSearch] = useState("");

  const filteredContacts = contacts.filter((contact) => {
    const value = search.toLowerCase();

    return (
      contact.name.toLowerCase().includes(value) ||
      contact.lastMessage.toLowerCase().includes(value)
    );
  });

  return (
    <div className="flex h-full w-full flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold">Messages</h2>
      </div>

      {/* Search */}
      <div className="relative px-4 py-3">
        <FiSearch className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-input bg-input/30 py-2 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {filteredContacts.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No conversations found.
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors ${
                selectedContact.id === contact.id
                  ? "bg-accent"
                  : "hover:bg-accent/50"
              }`}
            >
              <div className="relative shrink-0">
                <Avatar>
                  <AvatarFallback className={avatarColor(contact.id)}>{contact.avatar}</AvatarFallback>
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-card ${
                    contact.online ? "bg-success" : "bg-muted-foreground"
                  }`}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="truncate text-sm font-medium">{contact.name}</h4>
                  <span className="shrink-0 text-xs text-muted-foreground">{contact.time}</span>
                </div>

                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <p className="truncate text-xs text-muted-foreground">{contact.lastMessage}</p>
                  {contact.unread > 0 && <Badge>{contact.unread}</Badge>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ContactList;