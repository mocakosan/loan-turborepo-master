import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const bucket = process.env.SUPABASE_IMAGE_BUCKET!;

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("fileUrl");

    if (!fileUrl) {
      return NextResponse.json(
        { error: "fileUrl is required" },
        { status: 400 }
      );
    }

    const filePath = getPathFromUrl(fileUrl);
    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      return NextResponse.json({ error: "파일 삭제 실패" }, { status: 500 });
    }

    return NextResponse.json({ message: "파일 삭제 성공" });
  } catch (error) {
    console.error("업로드 에러:", error);
    return NextResponse.json({ error: "서버 에러" }, { status: 500 });
  }
}

function getPathFromUrl(url: string) {
  const parts = url.split(`${bucket}/`);
  return parts[1]; // 파일 경로만 추출
}
