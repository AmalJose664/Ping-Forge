import crypto from "crypto";
const secretKey = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");
export const encrypt = (key:string):string=>{
	
	const iv = crypto.randomBytes(16)
	const cipher = crypto.createCipheriv("aes-256-gcm", secretKey, iv)
	const encrypted = Buffer.concat([cipher.update(key, "utf-8"), cipher.final()])
	const tag = cipher.getAuthTag();

	return [iv.toString("hex"), tag.toString("hex"),  encrypted.toString("hex")].join(":")
}

export const decrypt = (data: string)=>{
	const [ivHex, tagHex, encryptedHex] = data.split(":");
	const decipher = crypto.createDecipheriv("aes-256-gcm", secretKey, Buffer.from(ivHex, "hex"))
	decipher.setAuthTag(Buffer.from(tagHex, "hex"))

	const decrypted = Buffer.concat([
		decipher.update(Buffer.from(encryptedHex, "hex")),
		decipher.final()
	])
	return decrypted.toString("utf-8")
}

export const getRandomKey = ()=>"sk_" + crypto.randomBytes(16).toString("hex")