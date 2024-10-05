import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { redirect } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";
import { userTable } from "@/db/schema";
import { db } from "@/db";
import { ActionResult } from "next/dist/server/app-render/types";

export default async function Page() { }

export async function signup(formData: FormData): Promise<ActionResult> {
    "use server";


    const userId = generateIdFromEntropySize(10); // 16 characters long

    const first_name = "My Name"
    const last_name = "My Surname"


    const passwordHash = await hash("password", {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
    });

    await db.insert(userTable).values({
        id: userId,
        email: "test@name.com",
        first_name: first_name,
        last_name: last_name,
        password_hash: passwordHash,
    });


    // const username = formData.get("email");
    //
    // // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
    // // keep in mind some database (e.g. mysql) are case insensitive
    //
    // if (
    //     typeof username !== "string" ||
    //     username.length < 3 ||
    //     username.length > 31 ||
    //     !/^[a-z0-9_-]+$/.test(username)
    // ) {
    //     return {
    //         error: "Invalid username",
    //     };
    // }
    // const password = formData.get("password");
    // if (
    //     typeof password !== "string" ||
    //     password.length < 6 ||
    //     password.length > 255
    // ) {
    //     return {
    //         error: "Invalid password",
    //     };
    // }
    //
    // const passwordHash = await hash(password, {
    //     memoryCost: 19456,
    //     timeCost: 2,
    //     outputLen: 32,
    //     parallelism: 1,
    // });
    //
    // const userId = generateIdFromEntropySize(10); // 16 characters long
    //
    // const first_name = formData.get("first-name");
    // const last_name = formData.get("last_name");
    //
    // await db.insert(userTable).values({
    //     id: userId,
    //     email: username,
    //     first_name: typeof first_name === "string" ? first_name : null,
    //     last_name: typeof last_name === "string" ? last_name : null,
    //     password_hash: passwordHash,
    // });
    //

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
    );

    return redirect("/");
}
