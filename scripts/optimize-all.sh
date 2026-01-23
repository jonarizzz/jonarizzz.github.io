#!/bin/bash

# Master script to optimize all images and prepare for deployment
# Usage: ./scripts/optimize-all.sh

echo "=========================================="
echo "Complete Image Optimization"
echo "=========================================="
echo ""

# Step 1: Optimize drawings
echo "Step 1: Optimizing drawings..."
./scripts/optimize-images.sh media/drwaings

echo ""
echo "=========================================="
echo "Optimization Summary"
echo "=========================================="
echo ""
echo "✓ Optimized images created in: media/drwaings_optimized"
echo ""
echo "Next steps:"
echo "1. Review optimized images"
echo "2. Update HTML to use optimized images"
echo ""
