#!/bin/sh

# Path ke file .env
ENV_FILE=".env"

# Cek apakah file .env belum ada
if [ ! -f "$ENV_FILE" ]; then
  echo "Creating default .env file..."

  cat <<EOF > $ENV_FILE
# Default environment variables
NODE_ENV=development
PORT=3000

HOST_DB=localhost
#HOST_DB=host.docker.internal
PORT_DB=5432
USERNAME_DB="affanmaulana"
PASSWORD_DB=""
NAME_DB="pos_kyd"

# JWT
JWT_SECRET="wefwefwef"
JWT_EXPIRATION="2h"
JWT_REFRESH_EXPIRATION="7d"

# EMAIL
MAIL_HOST="MAIL_HOST"
MAIL_PORT="MAIL_PORT"
MAIL_USER="MAIL_USER"
MAIL_PASS="MAIL_PASS"

FRONTEND_URL="http://localhost:3001"
EOF

else
  echo ".env file already exists. Skipping creation."
fi

# Jalankan perintah default (start:dev)
exec "$@"
