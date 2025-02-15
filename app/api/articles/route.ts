import { NextResponse } from "next/server";
import axios from "axios";

// تابع برای ترجمه متن به فارسی با استفاده از API رایگان
const translateText = async (text: string) => {
  try {
    const response = await axios.get(
      "https://api.mymemory.translated.net/get",
      {
        params: {
          q: text,
          langpair: "en|fa",
        },
      }
    );
    return response.data.responseData.translatedText || text;
  } catch (error) {
    console.error("❌ خطا در ترجمه:", error);
    return text; // اگر ترجمه نشد، متن اصلی را برمی‌گردانیم
  }
};

// تابع مخصوص متد GET
export async function GET() {
  try {
    console.log("✅ API articles فراخوانی شد!");

    // دریافت شناسه‌های مقالات از PubMed
    const pubmedResponse = await axios.get(
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi",
      {
        params: {
          db: "pubmed",
          term: "ovarian cancer",
          retmode: "json",
          retmax: 5, // دریافت ۵ مقاله
        },
      }
    );

    const articleIds = pubmedResponse.data.esearchresult?.idlist || [];
    if (articleIds.length === 0) {
      return NextResponse.json({ error: "مقاله‌ای یافت نشد." }, { status: 404 });
    }

    console.log("🔹 شناسه‌های مقالات:", articleIds);

    // دریافت جزئیات مقالات
    const detailsResponse = await axios.get(
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi",
      {
        params: {
          db: "pubmed",
          id: articleIds.join(","),
          retmode: "json",
        },
      }
    );

    // ترجمه عنوان مقالات
    const articles = await Promise.all(
      articleIds.map(async (id: string) => {
        const title = detailsResponse.data.result[id]?.title || "بدون عنوان";
        const translatedTitle = await translateText(title);
        return {
          id,
          title,
          translatedTitle,
          link: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        };
      })
    );

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("❌ خطا در دریافت مقالات:", error);
    return NextResponse.json({ error: "مشکلی در دریافت داده‌ها رخ داد." }, { status: 500 });
  }
}
