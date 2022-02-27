### commands

dotnet tool install --global dotnet-ef

export PATH="$PATH:$HOME/.dotnet/tools/"

dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design

dotnet ef migrations add CamelCaseName
dotnet ef database update

### dotnet project commands

dotnet new sln -n Name

dotnet sln add directory/.csproj


