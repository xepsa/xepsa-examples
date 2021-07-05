#!/bin/bash

# Source this file to setup environment.

# Enable Go Modules
export CGO_ENABLED=1; export CC=gcc;

# Ensure wasmer go module is installed in GOPATH
go get github.com/wasmerio/wasmer-go/wasmer

