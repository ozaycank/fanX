const { z } = require("zod");

exports.updateProfileSchema = z.object({
  displayName: z.string().optional(),
  supportedTeam: z.string().optional(),
  profilePic: z
    .string()
    .url("Geçerli bir URL giriniz.")
    .optional()
    .or(z.literal("")),
});

exports.changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Eski parola zorunludur."),
  newPassword: z.string().min(6, "Yeni parola en az 6 karakter olmalıdır."),
});
