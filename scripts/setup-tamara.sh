#!/usr/bin/env bash
# One-time Tamara setup for the Supabase project behind netspacesol.com.
#
# Before running:
#   1. Run supabase/tamara.sql in Supabase → SQL Editor (creates the payments table).
#   2. Log the CLI into the Supabase account that owns the project:  supabase login
#   3. Have supabase/.env.tamara with the Tamara keys (not in git).
#
# Usage:  bash scripts/setup-tamara.sh            # secrets + deploy functions
#         bash scripts/setup-tamara.sh --webhook  # also register the webhook with Tamara
set -euo pipefail
cd "$(dirname "$0")/.."

PROJECT_REF=uolbribimnkvsqzjxfgg
ENV_FILE=supabase/.env.tamara
WEBHOOK_URL="https://${PROJECT_REF}.supabase.co/functions/v1/tamara-webhook"

[[ -f "$ENV_FILE" ]] || { echo "Missing $ENV_FILE"; exit 1; }

echo "→ Uploading Tamara secrets to Supabase"
supabase secrets set --project-ref "$PROJECT_REF" --env-file "$ENV_FILE"

echo "→ Deploying edge functions"
supabase functions deploy tamara-checkout --project-ref "$PROJECT_REF"
# Tamara can't send a Supabase key: the webhook checks Tamara's signed tamaraToken instead
supabase functions deploy tamara-webhook --project-ref "$PROJECT_REF" --no-verify-jwt

if [[ "${1:-}" == "--webhook" ]]; then
  echo "→ Registering the webhook with Tamara: $WEBHOOK_URL"
  # shellcheck disable=SC1090
  set -a; source "$ENV_FILE"; set +a
  curl -sS -X POST "$TAMARA_API_URL/webhooks" \
    -H "Authorization: Bearer $TAMARA_API_TOKEN" -H 'Content-Type: application/json' \
    --data "{\"type\":\"order\",\"events\":[\"order_approved\",\"order_declined\",\"order_authorised\",\"order_canceled\",\"order_captured\",\"order_refunded\",\"order_expired\"],\"url\":\"$WEBHOOK_URL\"}"
  echo
else
  echo "Webhook not registered. Either rerun with --webhook, or add it in the Tamara Partners Portal:"
  echo "  $WEBHOOK_URL  (type: Order; events: approved, declined, authorised, canceled, captured, refunded, expired)"
fi
echo "✓ Done"
