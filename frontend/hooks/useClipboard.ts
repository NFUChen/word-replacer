import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export function useClipboard({ timeout = 2000 } = {}) {
  const [copied, setCopied] = useState(false);
  const [copyTimeout, setCopyTimeout] = useState<NodeJS.Timeout>();
  const { toast } = useToast();

  const handleCopyResult = (value: boolean) => {
    clearTimeout(copyTimeout);
    setCopyTimeout(setTimeout(() => setCopied(false), timeout));
    setCopied(value);
  };

  const copy = (valueToCopy: any) => {
    if ("clipboard" in navigator) {
      navigator.clipboard
        .writeText(valueToCopy)
        .then(() => handleCopyResult(true))
        .catch(err =>
          toast({
            title: "無法使用剪貼簿",
            description: err.toString(),
            variant: "destructive",
          }),
        );
    } else {
      toast({
        title: "目前無法使用剪貼簿",
        variant: "destructive",
      });
    }
  };

  const reset = () => {
    setCopied(false);
    clearTimeout(copyTimeout);
  };

  return { copy, reset, copied };
}
