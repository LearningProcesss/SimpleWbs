### commands

dotnet tool install --global dotnet-ef

dotnet tool install -g dotnet-aspnet-codegenerator

dotnet-aspnet-codegenerator controller -name MoviesController -m Movie -dc MvcMovieContext --relativeFolderPath Controllers --useDefaultLayout --referenceScriptLibraries -sqlite

<!-- export PATH="$PATH:$HOME/.dotnet/tools/" -->
export PATH="$PATH:/home/nonrootuser/.dotnet/tools"

dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design

dotnet ef migrations add CamelCaseName
dotnet ef database update

### dotnet project commands

dotnet new sln -n Name

dotnet sln add directory/.csproj


