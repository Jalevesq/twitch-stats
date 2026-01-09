FROM debian:bookworm-slim

ARG TARGETARCH

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

RUN if [ "$TARGETARCH" = "arm64" ]; then \
      ARCH="arm64"; \
    else \
      ARCH="x86_64"; \
    fi && \
    curl -L "https://github.com/twitchdev/twitch-cli/releases/download/v1.1.24/twitch-cli_1.1.24_Linux_${ARCH}.tar.gz" -o /tmp/twitch-cli.tar.gz && \
    cd /tmp && \
    tar -xzf twitch-cli.tar.gz && \
    mv /tmp/twitch-cli_*/twitch /usr/local/bin/twitch && \
    chmod +x /usr/local/bin/twitch && \
    rm -rf /tmp/*

EXPOSE 8080

CMD ["/usr/local/bin/twitch", "event", "websocket", "start-server", "--ip", "0.0.0.0", "--port", "8080"]