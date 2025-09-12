import crypto from "crypto";
export const runtime = "nodejs";

export const getRandomKey = ()=>"sk_" + crypto.randomBytes(16).toString("hex")