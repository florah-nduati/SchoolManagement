import pkg from "@prisma/client";

const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {

  // CREATE ROLES
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
    },
  });

  const teacherRole = await prisma.role.upsert({
    where: { name: "teacher" },
    update: {},
    create: {
      name: "teacher",
    },
  });

  const studentRole = await prisma.role.upsert({
    where: { name: "student" },
    update: {},
    create: {
      name: "student",
    },
  });

  // CREATE PERMISSIONS
  const manageUsers = await prisma.permission.upsert({
    where: { name: "manage_users" },
    update: {},
    create: {
      name: "manage_users",
    },
  });

  const viewStudents = await prisma.permission.upsert({
    where: { name: "view_students" },
    update: {},
    create: {
      name: "view_students",
    },
  });

  const createGrade = await prisma.permission.upsert({
    where: { name: "create_grade" },
    update: {},
    create: {
      name: "create_grade",
    },
  });

  // ASSIGN ROLE PERMISSIONS

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: adminRole.id,
        permissionId: manageUsers.id,
      },
    },
    update: {},
    create: {
      roleId: adminRole.id,
      permissionId: manageUsers.id,
    },
  });

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: teacherRole.id,
        permissionId: createGrade.id,
      },
    },
    update: {},
    create: {
      roleId: teacherRole.id,
      permissionId: createGrade.id,
    },
  });

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: studentRole.id,
        permissionId: viewStudents.id,
      },
    },
    update: {},
    create: {
      roleId: studentRole.id,
      permissionId: viewStudents.id,
    },
  });

  console.log("Seeding complete");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });