"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Edit, Phone, Save, Trash2 } from "lucide-react";
import { GetRecommendedLenders } from "@/actions/admin/recommended-lender/get-recommended-lender";
import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import TiptapEditor from "@/components/editor/tiptap-editor";
import { toast } from "sonner";
import { updateRecommendedLender } from "@/actions/admin/lender-ad-management/update-recommended-lender";
import { deleteRecommendedLender } from "@/actions/admin/lender-ad-management/delete-recommended-lender";
import RecommendedLenderAddModal from "./recommended-lender-add-modal";
import { cn } from "@/lib/utils";

type Props = {
  recommendedLenders: GetRecommendedLenders["recommendedLenders"];
};

export default function RecommendedLenderTab({ recommendedLenders }: Props) {
  const [loading, startTransition] = useTransition();

  const [editingAdId, setEditingAdId] = useState<number | null>(null);
  const [editedValues, setEditedValues] = useState<Pick<
    GetRecommendedLenders["recommendedLenders"][0],
    "lenderName" | "title1" | "title2" | "content" | "phoneNumber" | "link"
  > | null>(null);

  useEffect(() => {
    if (!editingAdId) return;

    const values = recommendedLenders.find((item) => item.id === editingAdId);
    if (!values) return;

    setEditedValues({
      ...values,
    });
  }, [editingAdId]);

  const handleEditAd = (ad: GetRecommendedLenders["recommendedLenders"][0]) => {
    setEditingAdId(ad.id);
    setEditedValues({
      lenderName: ad.lenderName,
      title1: ad.title1,
      title2: ad.title2,
      content: ad.content,
      phoneNumber: ad.phoneNumber,
      link: ad.link,
    });
  };

  const handleChange = (
    field: keyof Pick<
      GetRecommendedLenders["recommendedLenders"][0],
      "lenderName" | "title1" | "title2" | "content" | "phoneNumber" | "link"
    >,
    value: string
  ) => {
    setEditedValues((prev) => {
      if (!prev) return null;

      return { ...prev, [field]: value };
    });
  };

  // 저장 클릭
  const handleSaveAd = (id: number) => {
    if (!editedValues) {
      toast.error("모든 값을 입력해주세요.");
      return;
    }

    startTransition(async () => {
      const res = await updateRecommendedLender({
        id,
        ...editedValues,
      });

      if (res) {
        toast.success("저장이 완료되었습니다.");
      } else {
        toast.error("저장 중 오류가 발생했습니다.");
      }
    });

    setEditingAdId(null);
    setEditedValues(null);
  };

  // 삭제 클릭
  const handleDeleteRecommended = (id: number) => {
    const isConfirm = confirm("정말 삭제하시겠습니까?");
    if (!isConfirm) return;

    startTransition(async () => {
      const result = await deleteRecommendedLender({ id });

      if (result) {
        toast.success("삭제가 완료되었습니다.");
      } else {
        toast.error("삭제 중 오류가 발생했습니다.");
      }
    });
  };

  return (
    <TabsContent value="recommended">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>추천 대출 대부업체 관리</CardTitle>
              <CardDescription>
                메인 페이지에 표시될 추천 대출 대부업체를 관리합니다
              </CardDescription>
            </div>

            <RecommendedLenderAddModal />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-between gap-y-7">
            {recommendedLenders.map((loan, index) => {
              const isEditing = editingAdId === loan.id;

              return (
                <div key={index} className={cn("max-w-[227px] w-full h-full")}>
                  <div
                    className={cn(
                      "max-w-[227px] bg-[#FFF9F2] rounded-2xl p-4 shadow-sm text-sm flex flex-col justify-between h-full",
                      !isEditing && "cursor-pointer"
                    )}
                    onClick={() => {
                      if (isEditing) return;

                      if (!loan.link) {
                        toast.error("링크가 존재하지 않습니다.");
                        return;
                      }

                      window.open(`${loan.link}`, "_blank");
                    }}
                  >
                    <div>
                      {isEditing && editedValues ? (
                        <>
                          <Input
                            className="bg-white text-[#FFA015]"
                            value={editedValues.title1}
                            onChange={(e) =>
                              handleChange("title1", e.target.value)
                            }
                            placeholder="제목1"
                          />

                          <Input
                            className="mt-1 bg-white"
                            value={editedValues.title2}
                            onChange={(e) =>
                              handleChange("title2", e.target.value)
                            }
                            placeholder="제목2"
                          />

                          <div className="text-gray-600 text-sm mt-2 leading-relaxed space-y-1">
                            <TiptapEditor
                              content={editedValues.content}
                              onChangeContent={(value) =>
                                handleChange("content", value)
                              }
                              maxHeight={80}
                              extensions={[]}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="font-semibold text-[#FFA015]">
                            {loan.title1}
                          </div>
                          <div className="font-bold text-gray-900 text-base mt-1">
                            {loan.title2}
                          </div>

                          <div
                            className="text-gray-600 text-sm mt-2 leading-relaxed space-y-1"
                            dangerouslySetInnerHTML={{
                              __html: loan.content,
                            }}
                          />
                        </>
                      )}

                      <hr className="my-4 border-gray-300" />
                    </div>

                    {isEditing && editedValues ? (
                      <div className="text-[#FFA015] font-semibold space-y-1">
                        <Input
                          className="mt-1 bg-white"
                          value={editedValues.lenderName}
                          onChange={(e) =>
                            handleChange("lenderName", e.target.value)
                          }
                          placeholder="업체명"
                        />
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <Input
                            className="mt-1 bg-white"
                            value={editedValues.phoneNumber}
                            onChange={(e) =>
                              handleChange("phoneNumber", e.target.value)
                            }
                            placeholder="연락처"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-[#FFA015] font-semibold space-y-1">
                        <div>{loan.lenderName}</div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <span className="font-normal">
                            {loan.phoneNumber}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <Input
                      className="mt-1 bg-white"
                      value={editedValues?.link}
                      onChange={(e) => handleChange("link", e.target.value)}
                      placeholder="링크"
                    />
                  ) : (
                    <Input
                      className="mt-1 bg-white"
                      value={loan.link}
                      placeholder="링크"
                      disabled={true}
                    />
                  )}

                  <div className="flex justify-end space-x-2 mt-2">
                    {isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveAd(loan.id)}
                        disabled={loading}
                      >
                        <Save className="w-4 h-4 mr-1" />
                        저장
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAd(loan)}
                        disabled={loading}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRecommended(loan.id)}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
