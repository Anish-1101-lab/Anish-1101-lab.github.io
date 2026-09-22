#!/bin/sh
# Build the site and sync it to web.mit.edu/anish559/www/.
# Needs the MIT VPN (or campus network) and a Kerberos ticket:
#   kinit anish559@ATHENA.MIT.EDU
# Pass -n for a dry run that only lists what would change.
set -e
cd "$(dirname "$0")"
npm run build
rsync -avz --delete ${1:+"$1"} dist/ anish559@athena.dialup.mit.edu:/mit/anish559/www/
