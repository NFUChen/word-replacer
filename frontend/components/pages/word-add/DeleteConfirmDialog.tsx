import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Trash2 } from "lucide-react";

interface IDeleteConfirmDialog {
  isOpen: boolean;
  isDisabled: boolean;
  seletedLength: number;
  onOpenChange(open: boolean): void;
  onIllegalWordRemove(): void;
}

export const DeleteConfirmDialog: React.FC<IDeleteConfirmDialog> = ({
  isOpen,
  isDisabled,
  seletedLength,
  onOpenChange,
  onIllegalWordRemove,
}) => {
  const handleSubmit = () => {
    onIllegalWordRemove();
  };
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger disabled={isDisabled} asChild>
        <Button disabled={isDisabled} size="icon" variant="ghost" className="text-destructive hover:text-destructive">
          <Trash2 size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-md sm:max-w-[425px]">
        <div className="flex items-center mb-4">
          <AlertTriangle size={40} className="text-destructive" />
          <div className="ml-4">
            <DialogHeader className="mb-2 text-left">
              <DialogTitle>確認</DialogTitle>
            </DialogHeader>
            <DialogDescription>確定要刪除 {seletedLength} 筆危險字詞嗎？</DialogDescription>
          </div>
        </div>
        <DialogFooter className="grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={handleClose}>
            取消
          </Button>
          <Button className="bg-destructive hover:bg-destructive/80 dark:text-primary" onClick={handleSubmit}>
            確定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
