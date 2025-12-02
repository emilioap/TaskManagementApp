FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 5072

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["Tasks.Api/Tasks.Api.csproj", "Tasks.Api/"]
COPY ["Tasks.Application/Tasks.Application.csproj", "Tasks.Application/"]
COPY ["Tasks.Infrastructure/Tasks.Infrastructure.csproj", "Tasks.Infrastructure/"]
COPY ["Tasks.Domain/Tasks.Domain.csproj", "Tasks.Domain/"]
RUN dotnet restore "Tasks.Api/Tasks.Api.csproj"
COPY . .
WORKDIR "/src/Tasks.Api"
RUN dotnet publish "Tasks.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:5072
ENTRYPOINT ["dotnet", "Tasks.Api.dll"]
