import { z } from "zod"

export const CATEGORY_NAME_VALIDAOTRS = z
    .string()
    .min(1, "Category name is required")
    .regex(
        /^[a-zA-Z0-9-]+$/,
        "Category name can only contain letters, numbers or hypens"
    )
