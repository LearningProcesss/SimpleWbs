FROM node:16

# RUN groupadd --gid 1000 nonrootuser \
#     && useradd --uid 1000 --gid 1000 -m nonrootuser

RUN echo "fs.inotify.max_user_watches=524288" >> /etc/sysctl.conf

USER node

WORKDIR /usr/src/app
