import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

type CookieToSet = { name: string; value: string; options: CookieOptions };
import { homeFor, type Role } from "@/lib/types";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  
  const supabase = createServerClient(
   process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(list: CookieToSet[]) {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const redirect = (to: string) => {
    const url = request.nextUrl.clone();
    url.pathname = to;
    url.search = "";
    const res = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => res.cookies.set(c));
    return res;
  };

  if (path === "/auth/reset-password" && !user) return redirect("/");

  const portal: Role | null = path.startsWith("/employee")
    ? "employee"
    : path.startsWith("/sales")
    ? "sales"
    : null;
  if (!portal) return response;

  let role: Role | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    role = (data?.role as Role) ?? null;
  }

  const isPublic = /^\/(employee|sales)\/(login|forgot)$/.test(path);

  if (isPublic) {
    if (user && role) return redirect(homeFor(role));
    return response;
  }
  if (!user || !role) return redirect(`/${portal}/login`);
  if (role !== portal) return redirect(homeFor(role)); // strict role separation
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
