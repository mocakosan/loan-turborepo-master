"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check, ChevronsUpDown, FileText, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { GetRegionKinds } from "@/actions/admin/get-region-kinds";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { GetLoanKinds } from "@/actions/admin/get-loan-kinds";
import TiptapEditor from "@/components/editor/tiptap-editor";
import JobCard from "@/components/job-card";
import { BACKGROUND_OPTIONS } from "@/constants/background-options";
import { createLender } from "@/actions/admin/lender-ad-management/create-lender";
import { Switch } from "@/components/ui/switch";

type Props = {
  regionKinds: GetRegionKinds["regionKinds"];
  loanKinds: GetLoanKinds["loanKinds"];
};

export default function Add({ regionKinds, loanKinds }: Props) {
  const router = useRouter();
  const [loading, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    title1: "",
    title2: "",
    lenderName: "",
    content: "",
    phoneNumber: "",
    backgroundImage: "",
    isVisibleMain: false,
    isVisibleArea: false,
    isVisibleLoan: false,
  });

  // 업체 정보 섹션
  const [lenderInfo, setLenderInfo] = useState({
    title: "",
    companyName: "",
    registrationNumber: "",
    phoneNumber: "",
    registrationAuthority: "",
    registrationAuthorityPhoneNumber: "",
    office: "",
    monthRate: "",
    loanLimit: "",
    additionalCost: "",
    repaymentMethod: "",
    yearRate: "",
    overdueRate: "",
    earlyRepaymentFee: "",
    repaymentPeriod: "",
    description: "",
  });

  const [selectedRegions, setSelectedRegions] = useState<number[]>([]);
  const [selectedLoans, setSelectedLoans] = useState<number[]>([]);
  const [regionPopoverOpen, setRegionPopoverOpen] = useState(false);
  const [loanPopoverOpen, setLoanPopoverOpen] = useState(false);

  const handleFormDataChange = (
    field: keyof typeof formData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLenderInfoChange = (
    field: keyof typeof lenderInfo,
    value: string
  ) => {
    setLenderInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.backgroundImage.trim()) {
      toast.error("배경 이미지를 선택해주세요.");
      return;
    }

    if (!formData.title1.trim()) {
      toast.error("첫번째 타이틀을 입력해주세요.");
      return;
    }

    if (!formData.title2.trim()) {
      toast.error("두번째 타이틀을 입력해주세요.");
      return;
    }

    if (!formData.lenderName.trim()) {
      toast.error("대출업체 이름을 입력해주세요.");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    const phoneRegex = /^0\d{1,2}-\d{3,4}-\d{4}$/;
    if (!phoneRegex.test(formData.phoneNumber.trim())) {
      toast.error("올바른 형식의 번호를 입력해주세요. 예: 010-1234-5678");
      return;
    }

    startTransition(async () => {
      const result = await createLender({
        formData,
        lenderInfo,
        regionKindIds: selectedRegions,
        loanKindIds: selectedLoans,
      });

      if (result.success) {
        toast.success("저장이 완료되었습니다.");
      } else {
        toast.error("저장 실패: " + result.message);
      }
    });
  };

  const handleRegionSelect = (regionId: number) => {
    setSelectedRegions((prev) =>
      prev.includes(regionId)
        ? prev.filter((r) => r !== regionId)
        : [...prev, regionId]
    );
  };

  const removeRegion = (regionId: number) => {
    setSelectedRegions((prev) => prev.filter((region) => region !== regionId));
  };

  const handleLoanSelect = (loanId: number) => {
    setSelectedLoans((prev) =>
      prev.includes(loanId)
        ? prev.filter((r) => r !== loanId)
        : [...prev, loanId]
    );
  };

  const removeLoan = (loanId: number) => {
    setSelectedLoans((prev) => prev.filter((loan) => loan !== loanId));
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4" />
          돌아가기
        </Button>
        <Button
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md"
          disabled={loading}
        >
          {loading && <Spinner className="text-white" size={"small"} />}
          {loading ? "저장 중..." : "저장"}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
        {/* 왼쪽: 업체 썸네일 */}
        <div className="lg:w-80 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              업체 썸네일
            </h2>

            {/* 미리보기 카드 */}
            <div className="mb-6">
              <Label className="text-sm text-gray-600 mb-2 block">
                미리보기
              </Label>

              <JobCard
                title1={formData.title1}
                title2={formData.title2}
                lenderName={formData.lenderName}
                content={formData.content}
                phoneNumber={formData.phoneNumber}
                backgroundImage={formData.backgroundImage}
              />

              {/* 배경 이미지 선택 섹션 */}
              <div className="my-6">
                <Label className="text-sm text-gray-600 mb-2 block">
                  배경 이미지 선택
                </Label>
                <div className="grid grid-cols-6 gap-2">
                  {BACKGROUND_OPTIONS.map((bg, index) => (
                    <div
                      key={index}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        formData.backgroundImage === bg.imageName
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() =>
                        handleFormDataChange("backgroundImage", bg.imageName)
                      }
                    >
                      <div
                        className="w-full h-8 bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url('/admin/images/${bg.imageName}')`,
                        }}
                      />
                      {formData.backgroundImage === bg.imageName && (
                        <div className="absolute inset-0 bg-orange-500 bg-opacity-20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-orange-600" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 입력 필드들 */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-orange-500 font-medium mb-2 block">
                  첫번째 타이틀
                </Label>
                <Input
                  value={formData.title1}
                  onChange={(e) =>
                    handleFormDataChange("title1", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  두번째 타이틀
                </Label>
                <Input
                  value={formData.title2}
                  onChange={(e) =>
                    handleFormDataChange("title2", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  대출업체 이름
                </Label>
                <Input
                  value={formData.lenderName}
                  onChange={(e) =>
                    handleFormDataChange("lenderName", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">내용</Label>
                <TiptapEditor
                  content={formData.content}
                  onChangeContent={(value) =>
                    handleFormDataChange("content", value)
                  }
                  extensions={[]}
                  maxHeight={80}
                />
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">번호</Label>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleFormDataChange("phoneNumber", e.target.value)
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 중앙: 업체 정보 */}
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              업체 정보
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  타이틀
                </Label>
                <Input
                  value={lenderInfo.title}
                  onChange={(e) =>
                    handleLenderInfoChange("title", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  업체명
                </Label>
                <Input
                  value={lenderInfo.companyName}
                  onChange={(e) =>
                    handleLenderInfoChange("companyName", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  대부업(중개)등록번호
                </Label>
                <Input
                  value={lenderInfo.registrationNumber}
                  onChange={(e) =>
                    handleLenderInfoChange("registrationNumber", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  연락처
                </Label>
                <Input
                  value={lenderInfo.phoneNumber}
                  onChange={(e) =>
                    handleLenderInfoChange("phoneNumber", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  등록기관
                </Label>
                <Input
                  value={lenderInfo.registrationAuthority}
                  onChange={(e) =>
                    handleLenderInfoChange(
                      "registrationAuthority",
                      e.target.value
                    )
                  }
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  영업소
                </Label>
                <Input
                  value={lenderInfo.office}
                  onChange={(e) =>
                    handleLenderInfoChange("office", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  월금리
                </Label>
                <Input
                  value={lenderInfo.monthRate}
                  onChange={(e) =>
                    handleLenderInfoChange("monthRate", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  대출한도
                </Label>
                <Input
                  value={lenderInfo.loanLimit}
                  onChange={(e) =>
                    handleLenderInfoChange("loanLimit", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  추가비용
                </Label>
                <Input
                  value={lenderInfo.additionalCost}
                  onChange={(e) =>
                    handleLenderInfoChange("additionalCost", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  상환방식
                </Label>
                <Input
                  value={lenderInfo.repaymentMethod}
                  onChange={(e) =>
                    handleLenderInfoChange("repaymentMethod", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  지역 (다중선택 가능)
                </Label>
                <Popover
                  open={regionPopoverOpen}
                  onOpenChange={setRegionPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={regionPopoverOpen}
                      className="w-full justify-between"
                    >
                      {selectedRegions.length > 0
                        ? `${selectedRegions.length}개 지역 선택됨`
                        : "지역을 선택하세요..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="지역 검색..." />
                      <CommandList>
                        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                        <CommandGroup>
                          {regionKinds.map((item) => (
                            <CommandItem
                              key={item.id}
                              value={`${item.id}`}
                              onSelect={() => handleRegionSelect(item.id)}
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={selectedRegions.includes(item.id)}
                                  onChange={() => handleRegionSelect(item.id)}
                                />
                                <span>{item.name}</span>
                              </div>
                              <Check
                                className={`ml-auto h-4 w-4 ${
                                  selectedRegions.includes(item.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* 선택된 지역들을 Badge로 표시 */}
                {selectedRegions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedRegions.map((regionId) => (
                      <Badge
                        key={regionId}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {regionKinds.find((item) => item.id === regionId)
                          ?.name || ""}
                        <div>
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-500"
                            onClick={() => removeRegion(regionId)}
                          />
                        </div>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  대출종류 (다중선택 가능)
                </Label>
                <Popover
                  open={loanPopoverOpen}
                  onOpenChange={setLoanPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={loanPopoverOpen}
                      className="w-full justify-between"
                    >
                      {selectedLoans.length > 0
                        ? `${selectedLoans.length}개 지역 선택됨`
                        : "지역을 선택하세요..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="지역 검색..." />
                      <CommandList>
                        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                        <CommandGroup>
                          {loanKinds.map((item) => (
                            <CommandItem
                              key={item.id}
                              value={`${item.id}`}
                              onSelect={() => handleLoanSelect(item.id)}
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={selectedLoans.includes(item.id)}
                                  onChange={() => handleLoanSelect(item.id)}
                                />
                                <span>{item.name}</span>
                              </div>
                              <Check
                                className={`ml-auto h-4 w-4 ${
                                  selectedLoans.includes(item.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* 선택된 대출종류들을 Badge로 표시 */}
                {selectedLoans.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedLoans.map((loanId) => (
                      <Badge
                        key={loanId}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {loanKinds.find((item) => item.id === loanId)?.name ||
                          ""}
                        <div>
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-500"
                            onClick={() => removeLoan(loanId)}
                          />
                        </div>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  연금리
                </Label>
                <Input
                  value={lenderInfo.yearRate}
                  onChange={(e) =>
                    handleLenderInfoChange("yearRate", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  연체금리
                </Label>
                <Input
                  value={lenderInfo.overdueRate}
                  onChange={(e) =>
                    handleLenderInfoChange("overdueRate", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  조기상환수수료
                </Label>
                <Input
                  value={lenderInfo.earlyRepaymentFee}
                  onChange={(e) =>
                    handleLenderInfoChange("earlyRepaymentFee", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  상환기간
                </Label>
                <Input
                  value={lenderInfo.repaymentPeriod}
                  onChange={(e) =>
                    handleLenderInfoChange("repaymentPeriod", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  메인 광고 활성화 여부
                </Label>
                <div className="flex flex-row items-center justify-between">
                  <Switch
                    checked={formData.isVisibleMain}
                    onCheckedChange={(value) =>
                      handleFormDataChange("isVisibleMain", value)
                    }
                    className="data-[state=checked]:bg-green-500"
                  />
                  <div className="text-sm">
                    {formData.isVisibleMain
                      ? "메인 광고 영역에 노출됩니다."
                      : "메인 광고 노출에서 제외됩니다."}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  지역별 업체 광고 활성화 여부
                </Label>
                <div className="flex flex-row items-center justify-between">
                  <Switch
                    checked={formData.isVisibleArea}
                    onCheckedChange={(value) =>
                      handleFormDataChange("isVisibleArea", value)
                    }
                    className="data-[state=checked]:bg-green-500"
                  />
                  <div className="text-sm">
                    {formData.isVisibleArea
                      ? "지역별 업체 영역에 노출됩니다."
                      : "지역별 업체 노출에서 제외됩니다."}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  상품별 업체 광고 활성화 여부
                </Label>
                <div className="flex flex-row items-center justify-between">
                  <Switch
                    checked={formData.isVisibleLoan}
                    onCheckedChange={(value) =>
                      handleFormDataChange("isVisibleLoan", value)
                    }
                    className="data-[state=checked]:bg-green-500"
                  />
                  <div className="text-sm">
                    {formData.isVisibleLoan
                      ? "상품별 업체 영역에 노출됩니다."
                      : "상품별 업체 노출에서 제외됩니다."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 부가설명 */}
        <div className="lg:w-80">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">부가설명</h2>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg">
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              <TiptapEditor
                content={lenderInfo.description}
                onChangeContent={(value) =>
                  handleLenderInfoChange("description", value)
                }
                extensions={[]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
