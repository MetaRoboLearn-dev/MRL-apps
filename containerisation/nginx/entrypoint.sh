#!/bin/sh
# Generates a self-signed certificate the first time the container starts,
# then hands control to nginx.
#
# To use your own certificate instead, mount a Docker volume or bind-mount
# containing server.crt and server.key at /etc/nginx/ssl before starting.
set -e

SSL_DIR=/etc/nginx/ssl

if [ ! -f "$SSL_DIR/server.crt" ] || [ ! -f "$SSL_DIR/server.key" ]; then
    echo "[entrypoint] Generating self-signed SSL certificate..."
    mkdir -p "$SSL_DIR"
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "$SSL_DIR/server.key" \
        -out    "$SSL_DIR/server.crt" \
        -subj   "/CN=localhost/O=MRL/C=US" \
        -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
    echo "[entrypoint] Certificate written to $SSL_DIR/server.crt"
else
    echo "[entrypoint] Using existing SSL certificate at $SSL_DIR/server.crt"
fi

exec nginx -g 'daemon off;'
