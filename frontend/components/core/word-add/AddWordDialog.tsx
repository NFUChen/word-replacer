import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AlertCircle, Plus } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

interface IAddWordDialog {
  isOpen: boolean;
  onOpenChange(open: boolean): void;
  onSuggestionAdd(suggestion: string): void;
}

export const AddWordDialog: React.FC<IAddWordDialog> = ({ isOpen, onOpenChange, onSuggestionAdd }) => {
  const suggestionWordRef = useRef<HTMLInputElement>(null);
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = suggestionWordRef.current?.value;
    if (!value) {
      setHasError(true);
      return;
    }
    onSuggestionAdd(value);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="text-sm">
          <Plus size={16} />
          添加詞語
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加詞語</DialogTitle>
          <DialogDescription>請依需求添加建議的詞語</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center space-x-2 space-y-1">
              <Input ref={suggestionWordRef} id="name" placeholder="建議字詞" className="col-span-full" />
              <div data-show={hasError} className="text-xs text-destructive flex items-center data-[show=false]:hidden">
                <AlertCircle size={12} />
                <span className="ml-1">此欄位必填</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">送出</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
