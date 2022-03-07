using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace wbs_rest_aspnet.Migrations
{
    public partial class AddRefreshTokenEntityAndUserOneToMany : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RefreshTokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TokenHash = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    TokenSalt = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Ts = table.Column<DateTime>(type: "smalldatetime", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "smalldatetime", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RefreshTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_UserId",
                table: "RefreshTokens",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RefreshTokens");
        }
    }
}
