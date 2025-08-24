"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, FileText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { GetEnterpriser } from "@/actions/admin/get-enterpriser";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { deleteEnterpriser } from "@/actions/admin/delete-enterpriser";
import { updateEnterpriser } from "@/actions/admin/update-enterpriser";

type Props = {
  data: GetEnterpriser;
};

export default function Detail({ data }: Props) {
  const router = useRouter();
  const params = useParams();
  const [loading, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    name: data?.name || "",
    phoneNumber: data?.phoneNumber || "",
    companyName: data?.companyName || "",
    registrationStartDate: data?.registrationStartDate || "",
    registrationEndDate: data?.registrationEndDate || "",
    zip: data?.zip || "",
    address: data?.address || "",
    addressDetail: data?.addressDetail || "",
    identity: data?.identity || "",
    password: data?.password || "",
    registrationNumber: data?.registrationNumber || "",
    advertisingPhoneNumber: data?.advertisingPhoneNumber || "",
    registrationAuthority: data?.registrationAuthority || "",
    registrationAuthorityPhoneNumber:
      data?.registrationAuthorityPhoneNumber || "",
  });
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [loanLicense, setLoanLicense] = useState<File | null>(null);
  const [businessLicense, setBusinessLicense] = useState<File | null>(null);
  const [loanLicensePreview, setLoanLicensePreview] = useState<string | null>(
    null
  );
  const [businessLicensePreview, setBusinessLicensePreview] = useState<
    string | null
  >(null);
  const [existingLoanLicenseUrl, setExistingLoanLicenseUrl] = useState<
    string | null
  >(data?.loanLicense || null);
  const [existingBusinessLicenseUrl, setExistingBusinessLicenseUrl] = useState<
    string | null
  >(data?.businessLicense || null);

  const getFileTypeFromUrl = (url: string): "image" | "pdf" | "other" => {
    const extension = url.split(".").pop()?.toLowerCase();
    if (
      ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")
    ) {
      return "image";
    }
    if (extension === "pdf") {
      return "pdf";
    }
    return "other";
  };

  const getFileNameFromUrl = (url: string): string => {
    return url.split("/").pop() || "Unknown file";
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const createFilePreview = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      } else {
        resolve(null);
      }
    });
  };

  const handleFileUpload = async (
    type: "businessLicense" | "loanLicense",
    file: File
  ) => {
    const preview = await createFilePreview(file);

    if (type === "businessLicense") {
      setBusinessLicense(file);
      setBusinessLicensePreview(preview);
    } else {
      setLoanLicense(file);
      setLoanLicensePreview(preview);
    }
  };

  const removeFile = (type: "businessLicense" | "loanLicense") => {
    if (type === "businessLicense") {
      setBusinessLicense(null);
      setBusinessLicensePreview(null);
      setExistingBusinessLicenseUrl(null);
    } else {
      setLoanLicense(null);
      setLoanLicensePreview(null);
      setExistingLoanLicenseUrl(null);
    }
  };

  // 삭제 버튼 클릭
  const handleDelete = () => {
    const isConfirm = confirm("정말 삭제하시겠습니까?");
    if (!isConfirm) return;

    startTransition(async () => {
      // 대부업 등록증 기존 파일 삭제
      if (data?.loanLicense) {
        const deleteRes = await fetch(
          `/admin/api/enterpriser/delete-file?fileUrl=${encodeURIComponent(data?.loanLicense)}`,
          {
            method: "DELETE",
          }
        );

        if (!deleteRes.ok) {
          toast.error("대부업 등록증 삭제 실패");
          return;
        }
      }

      // 사업자 등록증 기존 파일 삭제
      if (data?.businessLicense) {
        const deleteRes = await fetch(
          `/admin/api/enterpriser/delete-file?fileUrl=${encodeURIComponent(data?.businessLicense)}`,
          {
            method: "DELETE",
          }
        );

        if (!deleteRes.ok) {
          toast.error("사업자 등록증 삭제 실패");
          return;
        }
      }

      const result = await deleteEnterpriser(Number(params.id));

      if (result) {
        router.back();

        toast.success("삭제가 완료되었습니다!");
      } else {
        toast.error("삭제를 실패했습니다.");
      }
    });
  };

  // 저장 버튼 클릭
  const handleSave = () => {
    startTransition(async () => {
      // 대부업 등록증 기존 파일 삭제
      if (!existingLoanLicenseUrl && data?.loanLicense) {
        const deleteRes = await fetch(
          `/admin/api/enterpriser/delete-file?fileUrl=${encodeURIComponent(data?.loanLicense)}`,
          {
            method: "DELETE",
          }
        );

        if (!deleteRes.ok) {
          toast.error("대부업 등록증 삭제 실패");
          return;
        }
      }

      // 사업자 등록증 기존 파일 삭제
      if (!existingBusinessLicenseUrl && data?.businessLicense) {
        const deleteRes = await fetch(
          `/admin/api/enterpriser/delete-file?fileUrl=${encodeURIComponent(data?.businessLicense)}`,
          {
            method: "DELETE",
          }
        );

        if (!deleteRes.ok) {
          toast.error("사업자 등록증 삭제 실패");
          return;
        }
      }

      // 대부업 등록증 업로드
      let loanLicenseUrl = existingLoanLicenseUrl || "";
      if (loanLicense instanceof File) {
        const loanFormData = new FormData();
        loanFormData.append("file", loanLicense);

        const res = await fetch("/admin/api/enterpriser/upload", {
          method: "POST",
          body: loanFormData,
        });
        const result = await res.json();

        if (res.ok) {
          loanLicenseUrl = result.url;
        } else {
          toast.error("대부업 등록증 업로드 실패");
          return;
        }
      }

      // 사업자 등록증 업로드
      let businessLicenseUrl = existingBusinessLicenseUrl || "";
      if (businessLicense instanceof File) {
        const businessFormData = new FormData();
        businessFormData.append("file", businessLicense);

        const res = await fetch("/admin/api/enterpriser/upload", {
          method: "POST",
          body: businessFormData,
        });
        const result = await res.json();

        if (res.ok) {
          businessLicenseUrl = result.url;
        } else {
          toast.error("사업자 등록증 업로드 실패");
          return;
        }
      }

      const result = await updateEnterpriser(
        Number(params.id),
        {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          companyName: formData.companyName,
          registrationStartDate: formData.registrationStartDate,
          registrationEndDate: formData.registrationEndDate,
          registrationNumber: formData.registrationNumber,
          advertisingPhoneNumber: formData.advertisingPhoneNumber,
          registrationAuthority: formData.registrationAuthority,
          registrationAuthorityPhoneNumber:
            formData.registrationAuthorityPhoneNumber,
        },
        loanLicenseUrl,
        businessLicenseUrl
      );

      if (result) {
        router.back();

        toast.success("저장이 완료되었습니다!");
      } else {
        toast.error("저장을 실패했습니다.");
      }
    });
  };

  const FilePreview = ({
    file,
    preview,
    onRemove,
  }: {
    file: File;
    preview: string | null;
    onRemove: () => void;
  }) => {
    const isImage = file.type.startsWith("image/");
    const isPDF = file.type === "application/pdf";

    return (
      <div className="relative w-full">
        {isImage && preview ? (
          <div className="relative">
            <Image
              src={preview || "/placeholder.svg"}
              alt={file.name}
              width={400}
              height={300}
              className="w-full h-64 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setFullscreenImage(preview)}
            />
            <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-75 text-white p-2 rounded text-sm truncate">
              {file.name}
            </div>
          </div>
        ) : isPDF ? (
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg border">
            <div className="text-center">
              <FileText className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-700 mb-1">PDF 파일</p>
              <p className="text-xs text-gray-500 px-4 truncate max-w-xs">
                {file.name}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg border">
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-700 mb-1">파일</p>
              <p className="text-xs text-gray-500 px-4 truncate max-w-xs">
                {file.name}
              </p>
            </div>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onRemove}
          className="absolute top-2 right-2 text-red-600 border-red-600 hover:bg-red-50 bg-white"
          disabled={loading}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const ExistingFilePreview = ({
    url,
    onRemove,
  }: {
    url: string;
    onRemove: () => void;
  }) => {
    const fileType = getFileTypeFromUrl(url);
    const fileName = getFileNameFromUrl(url);

    return (
      <div className="relative w-full">
        {fileType === "image" ? (
          <div className="relative">
            <Image
              src={url || "/placeholder.svg"}
              alt={fileName}
              width={400}
              height={300}
              className="w-full h-64 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setFullscreenImage(url)}
            />
            <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-75 text-white p-2 rounded text-sm truncate">
              {fileName}
            </div>
          </div>
        ) : fileType === "pdf" ? (
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg border">
            <div className="text-center">
              <FileText className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-700 mb-1">PDF 파일</p>
              <p className="text-xs text-gray-500 px-4 truncate max-w-xs">
                {fileName}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg border">
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-700 mb-1">파일</p>
              <p className="text-xs text-gray-500 px-4 truncate max-w-xs">
                {fileName}
              </p>
            </div>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onRemove}
          className="absolute top-2 right-2 text-red-600 border-red-600 hover:bg-red-50 bg-white"
          disabled={loading}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={(e) => {
              e.stopPropagation();

              router.back();
            }}
            disabled={loading}
          >
            <ArrowLeft className="h-5 w-5" />
            <h1 className="text-lg font-medium">돌아가기</h1>
          </Button>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">회원정보</h2>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                대표자명
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <Label
                htmlFor="phoneNumber"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                연락처
              </Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className="w-full"
              />
            </div>

            <div>
              <Label
                htmlFor="companyName"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                업체명
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
                className="w-full"
              />
            </div>

            <div>
              <Label
                htmlFor=""
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                등록유효기간
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="registrationStartDate"
                  value={formData.registrationStartDate}
                  onChange={(e) =>
                    handleInputChange("registrationStartDate", e.target.value)
                  }
                  className="flex-1"
                />
                <span className="text-gray-500">-</span>
                <Input
                  id="registrationEndDate"
                  value={formData.registrationEndDate}
                  onChange={(e) =>
                    handleInputChange("registrationEndDate", e.target.value)
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                사업장 소재지
              </Label>
              <Input
                value={`${formData.address} ${formData.addressDetail}`}
                className="w-full"
                readOnly
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <Label
                htmlFor="identity"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                ID
              </Label>
              <Input
                id="identity"
                value={formData.identity}
                onChange={(e) => handleInputChange("identity", e.target.value)}
                className="w-full"
                readOnly
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full"
                readOnly
              />
            </div>

            <div>
              <Label
                htmlFor="registrationNumber"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                대부업 등록(중개)번호
              </Label>
              <Input
                id="registrationNumber"
                value={formData.registrationNumber}
                onChange={(e) =>
                  handleInputChange("registrationNumber", e.target.value)
                }
                className="w-full"
              />
            </div>

            <div>
              <Label
                htmlFor="advertisingPhoneNumber"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                대출광고 전화번호
              </Label>
              <Input
                id="advertisingPhoneNumber"
                value={formData.advertisingPhoneNumber}
                onChange={(e) =>
                  handleInputChange("advertisingPhoneNumber", e.target.value)
                }
                className="w-full"
              />
            </div>

            <div>
              <Label
                htmlFor="registrationAuthority"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                대부업등록기관
              </Label>
              <Input
                id="registrationAuthority"
                value={formData.registrationAuthority}
                onChange={(e) =>
                  handleInputChange("registrationAuthority", e.target.value)
                }
                className="w-full"
              />
            </div>

            <div>
              <Label
                htmlFor="registrationAuthorityPhoneNumber"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                대부업등록기관 전화번호
              </Label>
              <Input
                id="registrationAuthorityPhoneNumber"
                value={formData.registrationAuthorityPhoneNumber}
                onChange={(e) =>
                  handleInputChange(
                    "registrationAuthorityPhoneNumber",
                    e.target.value
                  )
                }
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Representative Certificate */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              대부업 등록증
            </Label>
            <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                  {loanLicense ? (
                    <FilePreview
                      file={loanLicense}
                      preview={loanLicensePreview}
                      onRemove={() => removeFile("loanLicense")}
                    />
                  ) : existingLoanLicenseUrl ? (
                    <ExistingFilePreview
                      url={existingLoanLicenseUrl}
                      onRemove={() => removeFile("loanLicense")}
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-4 mx-auto" />
                      <p className="text-sm text-gray-500 mb-4">
                        파일을 업로드하세요
                      </p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload("loanLicense", file);
                        }}
                        className="hidden"
                        id="loan-license-upload"
                      />
                      <Label
                        htmlFor="loan-license-upload"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        파일 선택
                      </Label>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Business Registration */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              사업자 등록증
            </Label>
            <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                  {businessLicense ? (
                    <FilePreview
                      file={businessLicense}
                      preview={businessLicensePreview}
                      onRemove={() => removeFile("businessLicense")}
                    />
                  ) : existingBusinessLicenseUrl ? (
                    <ExistingFilePreview
                      url={existingBusinessLicenseUrl}
                      onRemove={() => removeFile("businessLicense")}
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-4 mx-auto" />
                      <p className="text-sm text-gray-500 mb-4">
                        파일을 업로드하세요
                      </p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload("businessLicense", file);
                        }}
                        className="hidden"
                        id="business-license-upload"
                      />
                      <Label
                        htmlFor="business-license-upload"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        파일 선택
                      </Label>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="destructive"
            className="px-8 py-2"
            onClick={handleDelete}
            disabled={loading}
          >
            삭제
          </Button>
          <Button
            className="px-8 py-2 bg-green-600 hover:bg-green-700"
            onClick={handleSave}
            disabled={loading}
          >
            저장
          </Button>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative max-w-full max-h-full">
            <Image
              src={fullscreenImage || "/placeholder.svg"}
              alt="Fullscreen view"
              width={1200}
              height={800}
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 bg-white text-black hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
