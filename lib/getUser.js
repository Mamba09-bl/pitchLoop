import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode("MY_SUPER_SECRET_123");

export async function getUser() {
  const cookieStore = await cookies();
  //   console.log(cookieStore);

  const customToken = cookieStore.get("token")?.value;
  //   console.log("custom", customToken);

  if (customToken) {
    try {
      const result = await jwtVerify(customToken, SECRET);
      const payload = result.payload;
      // console.log("i am the result", result);F

      return { type: "custom", user: payload };
    } catch {
      return null;
    }
  }
}
