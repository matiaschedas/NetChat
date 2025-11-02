using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class SeedData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Channels",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[] { new Guid("7eb8cb57-fac4-4e70-a685-5be6ac749540"), "Canal dedicado a dotnet core", "DotnetCore" });

            migrationBuilder.InsertData(
                table: "Channels",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[] { new Guid("6455d5e4-0db3-48aa-a893-266ee48a52fa"), "Canal dedicado a Angular", "Angular" });

            migrationBuilder.InsertData(
                table: "Channels",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[] { new Guid("bc42c9b2-6ce0-4400-bbf7-3c3f9356e56d"), "Canal dedicado a Reactjs", "Reactjs" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Channels",
                keyColumn: "Id",
                keyValue: new Guid("6455d5e4-0db3-48aa-a893-266ee48a52fa"));

            migrationBuilder.DeleteData(
                table: "Channels",
                keyColumn: "Id",
                keyValue: new Guid("7eb8cb57-fac4-4e70-a685-5be6ac749540"));

            migrationBuilder.DeleteData(
                table: "Channels",
                keyColumn: "Id",
                keyValue: new Guid("bc42c9b2-6ce0-4400-bbf7-3c3f9356e56d"));
        }
    }
}
