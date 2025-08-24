import { createRecommendedLender } from "@/actions/admin/lender-ad-management/create-recommended-lender";
import TiptapEditor from "@/components/editor/tiptap-editor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function RecommendedLenderAddModal() {
  const [loading, startTransition] = useTransition();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLenderData, setNewLenderData] = useState({
    lenderName: "",
    title1: "",
    title2: "",
    content: "",
    phoneNumber: "",
    link: "",
  });

  const handleNewLenderChange = (
    field: keyof typeof newLenderData,
    value: string
  ) => {
    setNewLenderData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateRecommendedLender = async () => {
    const { lenderName, title1, title2, content, phoneNumber, link } =
      newLenderData;

    if (
      !lenderName ||
      !title1 ||
      !title2 ||
      !content ||
      !phoneNumber ||
      !link
    ) {
      toast.error("모든 항목을 입력해주세요.");
      return;
    }

    startTransition(async () => {
      const result = await createRecommendedLender({
        ...newLenderData,
      });

      if (result) {
        toast.success("신규 대부업체가 추가되었습니다.");
        setNewLenderData({
          lenderName: "",
          title1: "",
          title2: "",
          content: "",
          phoneNumber: "",
          link: "",
        });
        setIsAddModalOpen(false);
      } else {
        toast.error("추가 중 오류가 발생했습니다.");
      }
    });
  };

  return (
    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          추천 대출 대부업체 추가
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>추천 대출 대부업체 추가</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 mt-4">
          <Input
            placeholder="제목1"
            value={newLenderData.title1}
            onChange={(e) => handleNewLenderChange("title1", e.target.value)}
          />
          <Input
            placeholder="제목2"
            value={newLenderData.title2}
            onChange={(e) => handleNewLenderChange("title2", e.target.value)}
          />
          <TiptapEditor
            content={newLenderData.content}
            onChangeContent={(value) => handleNewLenderChange("content", value)}
            maxHeight={100}
            extensions={[]}
          />
          <Input
            placeholder="업체명"
            value={newLenderData.lenderName}
            onChange={(e) =>
              handleNewLenderChange("lenderName", e.target.value)
            }
          />
          <Input
            placeholder="연락처"
            value={newLenderData.phoneNumber}
            onChange={(e) =>
              handleNewLenderChange("phoneNumber", e.target.value)
            }
          />
          <Input
            placeholder="링크"
            value={newLenderData.link}
            onChange={(e) => handleNewLenderChange("link", e.target.value)}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleCreateRecommendedLender} disabled={loading}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
