#!/bin/bash

# Generar la clave privada RSA en formato PKCS#8 (formato estándar de OpenSSL genpkey)
openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048

# Extraer la clave pública correspondiente en formato PKCS#8 (formato estándar de rsa -pubout)
openssl rsa -pubout -in private.pem -out public.pem

echo "Claves generadas con éxito (private.pem y public.pem en formato PKCS#8)."
