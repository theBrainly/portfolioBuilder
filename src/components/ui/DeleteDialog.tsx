"use client";
import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

interface Props { isOpen: boolean; onClose: () => void; onConfirm: () => void; title?: string; description?: string; isLoading?: boolean; }

export default function DeleteDialog({ isOpen, onClose, onConfirm, title = "Delete Item", description = "Are you sure? This cannot be undone.", isLoading }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-text-secondary text-sm">{description}</p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>Delete</Button>
        </div>
      </div>
    </Modal>
  );
}
