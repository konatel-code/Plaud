import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  TEMPLATE_DEFINITIONS,
  GLOSSARY_SEED,
} from "@daka/shared";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed: šablóny, glosár, admin používateľ");

  // --- Šablóny ---
  for (const t of TEMPLATE_DEFINITIONS) {
    await prisma.template.upsert({
      where: { kluc: t.kluc },
      update: {
        nazov: t.nazov,
        useCase: t.useCase,
        popis: t.popis,
        prompt: t.prompt,
        schemaJson: t.schema as object,
      },
      create: {
        kluc: t.kluc,
        nazov: t.nazov,
        typ: "SYSTEM",
        useCase: t.useCase,
        popis: t.popis,
        prompt: t.prompt,
        schemaJson: t.schema as object,
      },
    });
  }
  console.log(`  ✓ ${TEMPLATE_DEFINITIONS.length} šablón`);

  // --- Glosár ---
  for (const g of GLOSSARY_SEED) {
    await prisma.glossaryTerm.upsert({
      where: { pojem: g.pojem },
      update: { kategoria: g.kategoria },
      create: { pojem: g.pojem, kategoria: g.kategoria },
    });
  }
  console.log(`  ✓ ${GLOSSARY_SEED.length} pojmov v glosári`);

  // --- Admin používateľ (len pre dev) ---
  const email = "admin@ckdaka.sk";
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      meno: "Administrátor",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`  ✓ admin: ${email} / admin123 (zmeniť po prvom prihlásení!)`);

  console.log("✅ Seed hotový");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
