/*
  Warnings:

  - Made the column `servings` on table `Recipe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ingredients` on table `Recipe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `instructions` on table `Recipe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mealTypeId` on table `Recipe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cuisineId` on table `Recipe` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_cuisineId_fkey";

-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_mealTypeId_fkey";

-- AlterTable
ALTER TABLE "Recipe" ALTER COLUMN "servings" SET NOT NULL,
ALTER COLUMN "ingredients" SET NOT NULL,
ALTER COLUMN "instructions" SET NOT NULL,
ALTER COLUMN "mealTypeId" SET NOT NULL,
ALTER COLUMN "cuisineId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_mealTypeId_fkey" FOREIGN KEY ("mealTypeId") REFERENCES "MealType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_cuisineId_fkey" FOREIGN KEY ("cuisineId") REFERENCES "Cuisine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
