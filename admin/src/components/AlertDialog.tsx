"use client";

import { useState } from "react";
import { useAlertStore } from "../store/alert.store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface Props {}

export default function Alert({}: Props) {
  const {
    title: titleText,
    message: messageText,
    isOpen,
    close,
    onCancel,
    onConfirm,
  } = useAlertStore();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const handleClose = async () => {
    try {
      setCancelLoading(true);
      if (onCancel) await onCancel();
      close();
    } finally {
      setCancelLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setConfirmLoading(true);
      if (onConfirm) await onConfirm();
      close();
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{titleText}</AlertDialogTitle>
          <AlertDialogDescription>{messageText}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={cancelLoading}>
            {cancelLoading ? <Loader2 className="animate-spin" /> : "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction disabled={confirmLoading} onClick={handleConfirm}>
            {confirmLoading ? <Loader2 className="animate-spin" /> : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
