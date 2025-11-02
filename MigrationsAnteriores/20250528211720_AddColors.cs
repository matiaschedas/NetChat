using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class AddColors : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TypingNotifications");

            migrationBuilder.DeleteData(
                table: "Channels",
                keyColumn: "Id",
                keyValue: new Guid("175d227f-8bdd-4c51-b7ec-f3bcab763b52"));

            migrationBuilder.DeleteData(
                table: "Channels",
                keyColumn: "Id",
                keyValue: new Guid("321ff86a-3769-4005-b489-849e65c72899"));

            migrationBuilder.DeleteData(
                table: "Channels",
                keyColumn: "Id",
                keyValue: new Guid("f435f082-eeab-433a-9ee3-73752be3bb32"));

            migrationBuilder.AddColumn<string>(
                name: "PrimaryAppColor",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecundaryAppColor",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.InsertData(
                table: "Channels",
                columns: new[] { "Id", "ChannelType", "Description", "Name", "PrivateChannelId" },
                values: new object[] { new Guid("2202ef52-296e-4c58-89f2-3479eda7644d"), 0, "Canal dedicado a dotnet core", "DotnetCore", null });

            migrationBuilder.InsertData(
                table: "Channels",
                columns: new[] { "Id", "ChannelType", "Description", "Name", "PrivateChannelId" },
                values: new object[] { new Guid("675fd18f-1d65-4d9c-a3e0-ca99884cfd62"), 0, "Canal dedicado a Angular", "Angular", null });

            migrationBuilder.InsertData(
                table: "Channels",
                columns: new[] { "Id", "ChannelType", "Description", "Name", "PrivateChannelId" },
                values: new object[] { new Guid("a0e2d5a9-d310-4ba9-8ba9-bad79a2fa9ab"), 0, "Canal dedicado a Reactjs", "Reactjs", null });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Channels",
                keyColumn: "Id",
                keyValue: new Guid("2202ef52-296e-4c58-89f2-3479eda7644d"));

            migrationBuilder.DeleteData(
                table: "Channels",
                keyColumn: "Id",
                keyValue: new Guid("675fd18f-1d65-4d9c-a3e0-ca99884cfd62"));

            migrationBuilder.DeleteData(
                table: "Channels",
                keyColumn: "Id",
                keyValue: new Guid("a0e2d5a9-d310-4ba9-8ba9-bad79a2fa9ab"));

            migrationBuilder.DropColumn(
                name: "PrimaryAppColor",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "SecundaryAppColor",
                table: "AspNetUsers");

            migrationBuilder.CreateTable(
                name: "TypingNotifications",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    ChannelId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TypingNotifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TypingNotifications_Channels_ChannelId",
                        column: x => x.ChannelId,
                        principalTable: "Channels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TypingNotifications_AspNetUsers_Id",
                        column: x => x.Id,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Channels",
                columns: new[] { "Id", "ChannelType", "Description", "Name", "PrivateChannelId" },
                values: new object[] { new Guid("321ff86a-3769-4005-b489-849e65c72899"), 0, "Canal dedicado a dotnet core", "DotnetCore", null });

            migrationBuilder.InsertData(
                table: "Channels",
                columns: new[] { "Id", "ChannelType", "Description", "Name", "PrivateChannelId" },
                values: new object[] { new Guid("175d227f-8bdd-4c51-b7ec-f3bcab763b52"), 0, "Canal dedicado a Angular", "Angular", null });

            migrationBuilder.InsertData(
                table: "Channels",
                columns: new[] { "Id", "ChannelType", "Description", "Name", "PrivateChannelId" },
                values: new object[] { new Guid("f435f082-eeab-433a-9ee3-73752be3bb32"), 0, "Canal dedicado a Reactjs", "Reactjs", null });

            migrationBuilder.CreateIndex(
                name: "IX_TypingNotifications_ChannelId",
                table: "TypingNotifications",
                column: "ChannelId");
        }
    }
}
