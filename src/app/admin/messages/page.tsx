"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Mail,
  MailOpen,
  Star,
  Trash2,
  Filter,
  Calendar,
  ExternalLink,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import DeleteDialog from "@/components/ui/DeleteDialog";
import Button from "@/components/ui/Button";
import { useAdminMenu } from "@/hooks/useAdminMenu";
import { formatFullDate, timeAgo, getInitials } from "@/lib/utils";
import toast from "react-hot-toast";
import type { IMessage } from "@/types";

export default function AdminMessagesPage() {
  const { onMenuClick } = useAdminMenu();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/messages?filter=${filter}`);
      const data = await res.json();
      if (data.success) setMessages(data.data);
    } catch (error) {
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const toggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !currentRead }),
      });

      if (res.ok) {
        setMessages(
          messages.map((m) =>
            m._id === id ? { ...m, isRead: !currentRead } : m
          )
        );
      }
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const toggleStarred = async (id: string, currentStarred: boolean) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isStarred: !currentStarred }),
      });

      if (res.ok) {
        setMessages(
          messages.map((m) =>
            m._id === id ? { ...m, isStarred: !currentStarred } : m
          )
        );
      }
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const openMessage = async (msg: IMessage) => {
    setSelectedMessage(msg);

    // Mark as read
    if (!msg.isRead) {
      await toggleRead(msg._id, false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/messages/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessages(messages.filter((m) => m._id !== deleteId));
        toast.success("Message deleted!");
        if (selectedMessage?._id === deleteId) setSelectedMessage(null);
      }
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <>
      <AdminHeader
        title="Messages"
        subtitle={`${messages.length} total, ${unreadCount} unread`}
        onMenuClick={onMenuClick}
      />

      <div className="p-4 md:p-6 space-y-4">
        {/* Filters */}
        <div className="flex gap-2">
          {[
            { key: "all", label: "All" },
            { key: "unread", label: "Unread" },
            { key: "starred", label: "Starred" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setFilter(f.key);
                setLoading(true);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-primary text-white"
                  : "bg-surface-2 text-text-secondary hover:text-text-primary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20">
            <Mail className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted text-lg">No messages found</p>
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex items-start gap-4 p-4 cursor-pointer hover:bg-surface-2/50 transition-colors ${
                  !msg.isRead ? "bg-primary/5" : ""
                }`}
                onClick={() => openMessage(msg)}
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    !msg.isRead
                      ? "bg-primary/20 text-primary"
                      : "bg-surface-2 text-text-muted"
                  }`}
                >
                  {getInitials(msg.name)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm truncate ${
                        !msg.isRead ? "font-semibold" : "font-medium"
                      }`}
                    >
                      {msg.name}
                    </p>
                    {!msg.isRead && (
                      <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-text-secondary truncate">
                    {msg.subject}
                  </p>
                  <p className="text-xs text-text-muted truncate mt-0.5">
                    {msg.message}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-text-muted hidden sm:block">
                    {timeAgo(msg.createdAt)}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStarred(msg._id, msg.isStarred);
                    }}
                    className="p-1.5 rounded-lg hover:bg-surface-2 transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        msg.isStarred
                          ? "text-amber-400 fill-amber-400"
                          : "text-text-muted"
                      }`}
                    />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(msg._id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      <Modal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title="Message Details"
        size="lg"
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center text-lg font-bold">
                {getInitials(selectedMessage.name)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {selectedMessage.name}
                </h3>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-sm text-primary hover:underline"
                >
                  {selectedMessage.email}
                </a>
                <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatFullDate(selectedMessage.createdAt)}
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="font-medium text-sm text-text-muted mb-1">
                Subject
              </h4>
              <p className="font-medium">{selectedMessage.subject}</p>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="font-medium text-sm text-text-muted mb-1">
                Message
              </h4>
              <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    toggleRead(
                      selectedMessage._id,
                      selectedMessage.isRead
                    )
                  }
                  leftIcon={
                    selectedMessage.isRead ? (
                      <MailOpen className="w-4 h-4" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )
                  }
                >
                  {selectedMessage.isRead ? "Mark Unread" : "Mark Read"}
                </Button>
              </div>

              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                target="_blank"
              >
                <Button
                  leftIcon={<ExternalLink className="w-4 h-4" />}
                  size="sm"
                >
                  Reply via Email
                </Button>
              </a>
            </div>
          </div>
        )}
      </Modal>

      <DeleteDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Message"
        isLoading={deleting}
      />
    </>
  );
}
