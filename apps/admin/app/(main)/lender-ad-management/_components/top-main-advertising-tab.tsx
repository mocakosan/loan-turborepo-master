"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Crown, Edit, Phone, Save } from "lucide-react";
import { GetTopMainAdvertising } from "@/actions/admin/top-main-advertising/get-top-main-advertising";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateTopMainAdvertising } from "@/actions/admin/lender-ad-management/update-top-main-advertising";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  topMainAdvertising: GetTopMainAdvertising["topMainAdvertisings"];
};

export default function TopMainAdvertisingTab({ topMainAdvertising }: Props) {
  const [loading, startTransition] = useTransition();

  const [editingAdId, setEditingAdId] = useState<number | null>(null);
  const [editedValues, setEditedValues] = useState<Pick<
    GetTopMainAdvertising["topMainAdvertisings"][0],
    "lenderName" | "title1" | "title2" | "content" | "phoneNumber" | "link"
  > | null>(null);

  useEffect(() => {
    if (!editingAdId) return;

    const values = topMainAdvertising.find((item) => item.id === editingAdId);
    if (!values) return;

    setEditedValues({
      ...values,
    });
  }, [editingAdId]);

  const handleEditAd = (
    ad: GetTopMainAdvertising["topMainAdvertisings"][0]
  ) => {
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
      GetTopMainAdvertising["topMainAdvertisings"][0],
      "lenderName" | "title1" | "title2" | "content" | "phoneNumber" | "link"
    >,
    value: string
  ) => {
    setEditedValues((prev) => {
      if (!prev) return null;

      return { ...prev, [field]: value };
    });
  };

  const handleSaveAd = (id: number) => {
    if (!editedValues) {
      toast.error("모든 값을 입력해주세요.");
      return;
    }

    startTransition(async () => {
      const res = await updateTopMainAdvertising({
        id,
        ...editedValues,
      });

      if (res.success) {
        toast.success("광고가 저장되었습니다.");
      } else {
        toast.error("저장 중 오류가 발생했습니다.");
      }
    });

    setEditingAdId(null);
    setEditedValues(null);
  };

  return (
    <TabsContent value="ads">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>상위 메인 광고 관리</CardTitle>
              <CardDescription>
                메인 페이지 상단에 표시될 광고를 관리합니다
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-between gap-y-7">
            {topMainAdvertising.map((ad) => {
              const isEditing = editingAdId === ad.id;

              return (
                <div key={ad.id} className="max-w-[400px] w-full">
                  <Card
                    className={cn(
                      "border-2 border-orange-300 bg-orange-50",
                      !isEditing && "cursor-pointer"
                    )}
                    onClick={() => {
                      if (isEditing) return;

                      if (!ad.link) {
                        toast.error("링크가 존재하지 않습니다.");
                        return;
                      }

                      window.open(`${ad.link}`, "_blank");
                    }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-orange-500" />
                        {isEditing && editedValues ? (
                          <Input
                            className="bg-white"
                            value={editedValues.lenderName}
                            onChange={(e) =>
                              handleChange("lenderName", e.target.value)
                            }
                            placeholder="업체명"
                          />
                        ) : (
                          <span className="text-sm text-orange-600 font-medium">
                            {ad.lenderName}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {isEditing && editedValues ? (
                        <>
                          <div className="flex gap-2">
                            <Input
                              className="bg-white"
                              value={editedValues.title1}
                              onChange={(e) =>
                                handleChange("title1", e.target.value)
                              }
                              placeholder="제목1"
                            />
                            <Input
                              className="bg-white"
                              value={editedValues.title2}
                              onChange={(e) =>
                                handleChange("title2", e.target.value)
                              }
                              placeholder="제목2"
                            />
                          </div>
                          <Textarea
                            className="bg-white"
                            value={editedValues.content}
                            onChange={(e) =>
                              handleChange("content", e.target.value)
                            }
                            placeholder="내용"
                          />
                          <Input
                            className="bg-white"
                            value={editedValues.phoneNumber}
                            onChange={(e) =>
                              handleChange("phoneNumber", e.target.value)
                            }
                            placeholder="전화번호"
                          />
                        </>
                      ) : (
                        <>
                          <div className="text-orange-600 font-medium">
                            <span className="text-orange-500">{ad.title1}</span>{" "}
                            <span className="text-gray-700">{ad.title2}</span>
                          </div>
                          <p className="text-sm text-gray-600">{ad.content}</p>
                          <div className="flex items-center gap-1 text-orange-500">
                            <Phone className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {ad.phoneNumber}
                            </span>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

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
                      value={ad.link}
                      placeholder="링크"
                      disabled={true}
                    />
                  )}

                  <div className="flex space-x-2 justify-end mt-2">
                    {isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveAd(ad.id)}
                        disabled={loading}
                      >
                        <Save className="w-4 h-4 mr-1" />
                        저장
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAd(ad)}
                        disabled={loading}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
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
