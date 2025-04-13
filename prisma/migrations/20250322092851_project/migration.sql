-- CreateTable
CREATE TABLE "home_slider" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "image_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "m_title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "home_events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "image_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "m_title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "upcoming_events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "image_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "m_title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "about_events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "image_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "m_title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "about_slider" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "image_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "m_title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "event_page_events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "image_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "m_title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "member_details" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "m_name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "m_position" TEXT NOT NULL,
    "image_url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "member_past_details" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "m_name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "m_position" TEXT NOT NULL,
    "image_url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "system_user" (
    "sys_uid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sys_role" TEXT NOT NULL,
    "sys_name" TEXT NOT NULL,
    "sys_email" TEXT NOT NULL,
    "sys_pass" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "home_slider_image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "img" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "image_data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "image_name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "year" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "system_user_sys_email_key" ON "system_user"("sys_email");
