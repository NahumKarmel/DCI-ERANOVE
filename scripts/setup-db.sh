#!/usr/bin/env bash
# Installe et demarre PostgreSQL 16 dans le Codespace, puis cree le role et la
# base de developpement. Rejouable sans risque.
# Usage :  bash scripts/setup-db.sh
set -euo pipefail

echo "--- PostgreSQL : verification ---"

if ! ls /usr/lib/postgresql/16 >/dev/null 2>&1; then
  echo "PostgreSQL 16 absent, installation en cours..."

  if ! apt-cache show postgresql-16 >/dev/null 2>&1; then
    echo "Ajout du depot officiel PostgreSQL (PGDG)..."
    sudo apt-get update -qq
    sudo apt-get install -y -qq curl ca-certificates gnupg lsb-release
    sudo install -d /usr/share/postgresql-common/pgdg
    sudo curl -fsSL -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc \
      https://www.postgresql.org/media/keys/ACCC4CF8.asc
    echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" \
      | sudo tee /etc/apt/sources.list.d/pgdg.list >/dev/null
    sudo apt-get update -qq
  fi

  sudo apt-get install -y -qq postgresql-16 postgresql-client-16
else
  echo "PostgreSQL 16 deja present."
fi

echo "--- Demarrage du service ---"
sudo service postgresql start >/dev/null 2>&1 || true
sleep 2

echo "--- Role et base ---"
sudo su postgres -c "psql -tAc \"SELECT 1 FROM pg_roles WHERE rolname='dci'\"" | grep -q 1 \
  || sudo su postgres -c "psql -q -c \"CREATE ROLE dci WITH LOGIN PASSWORD 'dci' CREATEDB;\""

sudo su postgres -c "psql -tAc \"SELECT 1 FROM pg_database WHERE datname='dci_dev'\"" | grep -q 1 \
  || sudo su postgres -c "createdb -O dci dci_dev"

echo ""
echo "--- Verification ---"
PGPASSWORD=dci psql -h localhost -U dci -d dci_dev -c "SELECT version();" | head -3
echo ""
echo "OK. DATABASE_URL attendue :"
echo "  postgresql://dci:dci@localhost:5432/dci_dev"
