FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY . .
RUN dotnet restore "src/LinkVault.API/LinkVault.API.csproj"
RUN dotnet publish "src/LinkVault.API/LinkVault.API.csproj" -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app .
EXPOSE 8080
ENTRYPOINT ["dotnet", "LinkVault.API.dll"]
