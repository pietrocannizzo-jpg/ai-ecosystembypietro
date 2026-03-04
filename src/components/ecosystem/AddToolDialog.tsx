import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { categories } from "@/data/cardData";
import { useAddTool } from "@/hooks/useTools";
import { toast } from "@/hooks/use-toast";

export const AddToolDialog = () => {
  const [open, setOpen] = useState(false);
  const addTool = useAddTool();

  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("🔧");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [summary, setSummary] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [linksStr, setLinksStr] = useState("");

  const selectedCat = categories.find((c) => c.id === category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category) {
      toast({ title: "Missing fields", description: "Title and category are required.", variant: "destructive" });
      return;
    }

    try {
      await addTool.mutateAsync({
        title: title.trim(),
        icon,
        category,
        subcategory: subcategory.trim(),
        color: selectedCat?.color || "#6366f1",
        summary: summary.trim(),
        tags: tagsStr.split(",").map((t) => t.trim()).filter(Boolean),
        links: linksStr.split("\n").map((l) => l.trim()).filter(Boolean),
      });

      toast({ title: "Tool added!", description: `${title} has been added to the ecosystem.` });
      setOpen(false);
      setTitle(""); setIcon("🔧"); setCategory(""); setSubcategory("");
      setSummary(""); setTagsStr(""); setLinksStr("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to add tool.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2 font-mono text-xs">
          <Plus className="w-3.5 h-3.5" />
          Add Tool
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-display">Add an AI Tool</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-[auto_1fr] gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Icon</Label>
              <Input value={icon} onChange={(e) => setIcon(e.target.value)} className="w-16 text-center text-lg" maxLength={2} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Name *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. ChatGPT" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: cat.color }} />
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Subcategory</Label>
              <Input value={subcategory} onChange={(e) => setSubcategory(e.target.value)} placeholder="e.g. AI IDE" />
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Summary</Label>
            <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Brief description..." rows={2} />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Tags (comma-separated)</Label>
            <Input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} placeholder="e.g. Open Source, Fast, Free" />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Links (one per line)</Label>
            <Textarea value={linksStr} onChange={(e) => setLinksStr(e.target.value)} placeholder="https://docs.example.com" rows={2} />
          </div>

          <Button type="submit" className="w-full" disabled={addTool.isPending}>
            {addTool.isPending ? "Adding..." : "Add Tool"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
