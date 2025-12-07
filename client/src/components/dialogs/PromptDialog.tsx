import { useState, useEffect } from 'react';
import { Copy, Layout, Server } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import type { Prompt, PromptType } from '@/types';

interface PromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: Prompt | null;
  onSave: (content: string, type: PromptType) => Promise<void>;
}

export function PromptDialog({
  open,
  onOpenChange,
  prompt,
  onSave,
}: PromptDialogProps) {
  const [content, setContent] = useState('');
  const [type, setType] = useState<PromptType>('ui');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { copy } = useCopyToClipboard();

  useEffect(() => {
    if (open && prompt) {
      setContent(prompt.content);
      setType(prompt.type);
    }
  }, [open, prompt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSave(content.trim(), type);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    copy(content);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Prompt</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <ToggleGroup
                type="single"
                value={type}
                onValueChange={(value) => value && setType(value as PromptType)}
                className="bg-muted rounded-lg p-1"
              >
                <ToggleGroupItem
                  value="ui"
                  className="px-3 py-1.5 text-sm gap-1.5 data-[state=on]:bg-green-100 data-[state=on]:text-green-800 dark:data-[state=on]:bg-green-900 dark:data-[state=on]:text-green-200 rounded"
                >
                  <Layout className="h-4 w-4" />
                  Frontend
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="backend"
                  className="px-3 py-1.5 text-sm gap-1.5 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-800 dark:data-[state=on]:bg-blue-900 dark:data-[state=on]:text-blue-200 rounded"
                >
                  <Server className="h-4 w-4" />
                  Backend
                </ToggleGroupItem>
              </ToggleGroup>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>

            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter prompt content..."
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!content.trim() || isSubmitting}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
