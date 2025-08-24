import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const bucket = process.env.SUPABASE_IMAGE_BUCKET!;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    const newPath = `${uuidv4()}.${file.name.split(".").pop()}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(newPath, Buffer.from(await file.arrayBuffer()), {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: "파일 업로드 실패" }, { status: 500 });
    }

    const { publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path).data;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("업로드 에러:", error);
    return NextResponse.json({ error: "서버 에러" }, { status: 500 });
  }
}

function getPathFromUrl(url: string) {
  const parts = url.split(`${bucket}/`);
  return parts[1]; // 파일 경로만 추출
}
