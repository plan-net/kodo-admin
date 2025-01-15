#!/bin/bash

# Number of chunks
chunks=5

# Get total lines in all files from Git HEAD
total_lines=$(git ls-tree -r --name-only HEAD | xargs cat | wc -l)

# Calculate lines per chunk (rounding up)
lines_per_chunk=$(( (total_lines + chunks - 1) / chunks ))

# Concatenate and split directly
git ls-tree -r --name-only HEAD | xargs cat | split -l "$lines_per_chunk" -d --additional-suffix=.txt - chunk_

echo "Files concatenated and split into 5 chunks as chunk_00.txt, chunk_01.txt, etc."
