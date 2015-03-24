#!/bin/sh

cd "$(dirname "$0")"
echo "$(dirname "$0")"
echo "Starting Development Server for TL;DR…"
grunt server
