# Imagen base para compilar
FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /app

# Copiamos los csproj de todos los proyectos
COPY API/*.csproj ./API/
COPY Application/*.csproj ./Application/
COPY Infrastructure/*.csproj ./Infrastructure/
COPY Domain/*.csproj ./Domain/
COPY Persistence/*.csproj ./Persistence/

# Copiamos la solución
COPY *.sln ./

# Restauramos dependencias usando la solución
RUN dotnet restore *.sln

# Copiamos todo
COPY . ./

# Publicamos la API
RUN dotnet publish API/API.csproj -c Release -o out

# Imagen solo con runtime
FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app
COPY --from=build /app/out .

EXPOSE 5000
ENTRYPOINT ["dotnet", "API.dll"]
