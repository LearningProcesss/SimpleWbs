FROM mcr.microsoft.com/dotnet/sdk:6.0

RUN groupadd --gid 1000 nonrootuser \
    && useradd --uid 1000 --gid 1000 -m nonrootuser

USER nonrootuser

WORKDIR /usr/src/app

