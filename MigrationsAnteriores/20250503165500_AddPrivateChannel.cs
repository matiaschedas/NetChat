using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class AddPrivateChannel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Channels",
                keyColumn: "Id",
                keyValue: new Guid("224a7da5-49c1-4273-bc19-93a57cb5580c"));

            migrationBuilder.DeleteData(
                table: "Channels",
                keyColumn: "Id",
                keyValue: new Guid("b5e2962b-33b7-490a-9cd3-e09852575fe4"));

            migrationBuilder.DeleteData(
                table: "Channels",
                keyColumn: "Id",
                keyValue: new Guid("d922487c-47a0-487c-a3d5-6308632e221e"));

            migrationBuilder.AddColumn<string>(
                name: "PrivateChannelId",
                table: "Channels",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsOnline",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "Channels",
                columns: new[] { "Id", "ChannelType", "Description", "Name", "PrivateChannelId" },
                values: new object[] { new Guid("3928ee5a-9b93-4537-9387-108c58fe60a5"), 0, "Canal dedicado a dotnet core", "DotnetCore", null });

            migrationBuilder.InsertData(
                table: "Channels",
                columns: new[] { "Id", "ChannelType", "Description", "Name", "PrivateChannelId" },
                values: new object[] { new Guid("eda1da1e-a91d-4836-8f11-44eb5adc0bf3"), 0, "Canal dedicado a Angular", "Angular", null });

            migrationBuilder.InsertData(
                table: "Channels",
                columns: new[] { "Id", "ChannelType", "Description", "Name", "PrivateChannelId" },
                values: new object[] { new Guid("f3d556aa-94ce-4d7f-b9a4-77e0fc88fb72"), 0, "Canal dedicado a Reactjs", "Reactjs", null });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Channels",
                keyColumn: "Id",
                keyValue: new Guid("3928ee5a-9b93-4537-9387-108c58fe60a5"));

            migrationBuilder.DeleteData(
                table: "Channels",
                keyColumn: "Id",
                keyValue: new Guid("eda1da1e-a91d-4836-8f11-44eb5adc0bf3"));

            migrationBuilder.DeleteData(
                table: "Channels",
                keyColumn: "Id",
                keyValue: new Guid("f3d556aa-94ce-4d7f-b9a4-77e0fc88fb72"));

            migrationBuilder.DropColumn(
                name: "PrivateChannelId",
                table: "Channels");

            migrationBuilder.DropColumn(
                name: "IsOnline",
                table: "AspNetUsers");

            migrationBuilder.InsertData(
                table: "Channels",
                columns: new[] { "Id", "ChannelType", "Description", "Name" },
                values: new object[] { new Guid("d922487c-47a0-487c-a3d5-6308632e221e"), 0, "Canal dedicado a dotnet core", "DotnetCore" });

            migrationBuilder.InsertData(
                table: "Channels",
                columns: new[] { "Id", "ChannelType", "Description", "Name" },
                values: new object[] { new Guid("224a7da5-49c1-4273-bc19-93a57cb5580c"), 0, "Canal dedicado a Angular", "Angular" });

            migrationBuilder.InsertData(
                table: "Channels",
                columns: new[] { "Id", "ChannelType", "Description", "Name" },
                values: new object[] { new Guid("b5e2962b-33b7-490a-9cd3-e09852575fe4"), 0, "Canal dedicado a Reactjs", "Reactjs" });
        }
    }
}
