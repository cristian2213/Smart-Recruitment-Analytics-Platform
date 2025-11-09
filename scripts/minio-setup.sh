#!/bin/bash
# wait for MinIO to be ready
sleep 10

# set alias
mc alias set myminio http://minio:9000 $AWS_ACCESS_KEY_ID $AWS_SECRET_ACCESS_KEY

# create bucket if not exists
mc mb myminio/$AWS_BUCKET || true

# set public permissions
mc anonymous set public myminio/$AWS_BUCKET/users/public/
mc anonymous set public myminio/$AWS_BUCKET/public/

echo "MinIO public permissions configured"

# Verify permissions
echo "🔍 Verifying permissions..."
mc anonymous ls myminio/$AWS_BUCKET

echo "🎉 MinIO setup completed successfully!"
