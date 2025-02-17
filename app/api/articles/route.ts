export async function GET(req: Request) {
  try {
    // دریافت مقدار `groupId` از Query Params
    const { searchParams } = new URL(req.url);
    const groupIdSlug = searchParams.get("groupId");

    if (!groupIdSlug) {
      console.log("🚨 مقدار groupId دریافت نشد!");
      return new Response(
        JSON.stringify({ message: "🚨 مقدار groupId ارسال نشده است!" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`🔍 جستجوی دسته‌بندی برای نامک: ${groupIdSlug}`);

    // دریافت ID دسته‌بندی از وردپرس با استفاده از `slug`
    const categoryResponse = await fetch(
      `https://hamihealth.com/wp-json/wp/v2/categories?slug=${groupIdSlug}`
    );

    if (!categoryResponse.ok) {
      throw new Error(`🚨 خطا در دریافت دسته‌بندی - وضعیت: ${categoryResponse.status}`);
    }

    const categories = await categoryResponse.json();

    if (categories.length === 0) {
      console.log("🚨 دسته‌بندی یافت نشد!");
      return new Response(
        JSON.stringify({ message: "🚨 دسته‌بندی‌ای با این نامک یافت نشد!" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const categoryId = categories[0].id;
    console.log(`✅ دسته‌بندی با ID: ${categoryId} پیدا شد!`);

    // دریافت مقالات بر اساس ID دسته‌بندی
    const articlesResponse = await fetch(
      `https://hamihealth.com/wp-json/wp/v2/posts?categories=${categoryId}`
    );

    if (!articlesResponse.ok) {
      throw new Error("🚨 خطا در دریافت مقالات");
    }

    const articles = await articlesResponse.json();

    const formattedArticles = articles.map((article: any) => ({
      id: article.id,
      originalTitle: article.title.rendered,
      translatedTitle: article.title.rendered, // اگر نیاز به ترجمه باشد
      link: article.link,
    }));

    console.log(`✅ تعداد مقالات دریافت شده: ${formattedArticles.length}`);

    return new Response(JSON.stringify({ articles: formattedArticles }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ خطای سرور در route.ts:", error);
    // return new Response(
    //   JSON.stringify({ message: `🚨 خطای سرور: ${error.message}` }),
    //   { status: 500, headers: { "Content-Type": "application/json" } }
    // );
  }
}
