#!/usr/bin/env python3
"""
NadaVerse Production Secret Key Generator
Generates high-entropy cryptographic secrets suitable for JWT signing and session integrity.
"""

import secrets

if __name__ == "__main__":
    secret_key = secrets.token_hex(32) # 64 hex characters (256-bit entropy)
    print("=" * 60)
    print("NadaVerse Production Secret Key Generated:")
    print(secret_key)
    print("=" * 60)
    print("Copy this into your production environment variables:")
    print(f"SECRET_KEY={secret_key}")
    print("=" * 60)
