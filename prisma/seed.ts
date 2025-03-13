import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Sprawdzamy czy już istnieje typ ogólny
  let typOgolny = await prisma.typSalaPrzedmiot.findUnique({
    where: { nazwa: "Ogólny" },
  });

  if (!typOgolny) {
    typOgolny = await prisma.typSalaPrzedmiot.create({
      data: { nazwa: "Ogólny" },
    });
    console.log("✓ Utworzono typ ogólny");
  }

  // Sprawdzamy czy już istnieje budynek główny
  let budynekGlowny = await prisma.budynek.findUnique({
    where: { nazwa: "Główny" },
  });

  if (!budynekGlowny) {
    budynekGlowny = await prisma.budynek.create({
      data: {
        nazwa: "Główny",
        pietra: {
          create: {
            numer: 0,
          },
        },
      },
      include: {
        pietra: true,
      },
    });
    console.log("✓ Utworzono budynek główny z parterem");
  }

  console.log("✓ Seed zakończony pomyślnie!");
}

main()
  .catch((e) => {
    console.error("❌ Błąd podczas seedowania:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
