import type { Handler, HandlerEvent } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RequestBody {
  slug: string;
  action: "increment" | "get";
}

export const handler: Handler = async (event: HandlerEvent) => {
  // 只允許 POST 請求
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Request body is required" }),
      };
    }

    const { slug, action }: RequestBody = JSON.parse(event.body);

    if (!slug) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Slug is required" }),
      };
    }

    if (action === "increment") {
      // 增加瀏覽數
      const { data, error } = await supabase.rpc("increment_page_view", {
        page_slug: slug,
      });

      if (error) throw error;

      return {
        statusCode: 200,
        body: JSON.stringify({ views: data }),
      };
    } else if (action === "get") {
      // 取得瀏覽數
      const { data, error } = await supabase
        .from("page_views")
        .select("views")
        .eq("slug", slug)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      return {
        statusCode: 200,
        body: JSON.stringify({ views: data?.views || 0 }),
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid action" }),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
